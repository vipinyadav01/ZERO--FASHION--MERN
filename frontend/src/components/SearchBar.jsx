import React, { useEffect, useState, useCallback, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { Search, X, Camera, Mic } from "lucide-react";

const SearchBar = () => {
  const context = useContext(ShopContext);
  const {
    search = "",
    setSearch = () => {},
    showSearch,
    setShowSearch = () => {},
  } = context || {};

  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const popularCategories = [
    "T-Shirts", "Jeans", "Dresses", "Sneakers", "Jackets", 
    "Accessories", "Bags", "Watches", "Sunglasses", "Hoodies"
  ];

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/collection?search=${encodeURIComponent(search.trim())}`);
      setShowSearch(false);
    }
  }, [search, navigate, setShowSearch]);

  const handleClose = useCallback(() => {
    setShowSearch(false);
    setSearch("");
  }, [setShowSearch, setSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && visible) {
      handleClose();
    }
  }, [visible, handleClose]);

  const getSearchSuggestions = useCallback(() => {
    if (!search.trim()) return [];
    return [
      `${search} for men`,
      `${search} for women`,
      `${search} sale`,
      `${search} new arrivals`
    ];
  }, [search]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setSearch(suggestion);
    navigate(`/collection?search=${encodeURIComponent(suggestion)}`);
    setShowSearch(false);
  }, [setSearch, navigate, setShowSearch]);

  const handleCategoryClick = useCallback((category) => {
    setSearch(category);
    navigate(`/collection?search=${encodeURIComponent(category)}`);
    setShowSearch(false);
  }, [setSearch, navigate, setShowSearch]);

  useEffect(() => {
    setVisible(showSearch);
  }, [showSearch]);

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [visible, handleKeyDown]);

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50"
      onClick={handleClose}
    >
      <div 
        className="bg-white border-b"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-black">Search Products</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <div className={`relative flex items-center bg-white rounded-lg border-2 transition-colors ${
              focused ? "border-black" : "border-gray-200"
            }`}>
              <div className="absolute left-4">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="flex-1 pl-12 pr-24 sm:pr-20 py-3 sm:py-4 text-base sm:text-lg outline-none bg-transparent text-black placeholder-gray-500 rounded-lg"
                type="text"
                placeholder="Search for products..."
                aria-label="Search products"
                autoFocus
              />
              
              <div className="absolute right-2 flex items-center space-x-1 sm:space-x-2">
                <button
                  type="button"
                  className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Voice search"
                >
                  <Mic className="w-4 h-4 text-gray-500" />
                </button>
                
                <button
                  type="button"
                  className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Camera search"
                >
                  <Camera className="w-4 h-4 text-gray-500" />
                </button>
                
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {search && (
            <div className="mt-4 bg-gray-50 rounded-lg border overflow-hidden">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Suggestions</h3>
                <div className="space-y-2">
                  {getSearchSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center w-full text-left px-3 py-2 rounded-lg hover:bg-white transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!search && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Popular Categories</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {popularCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-black hover:text-white text-gray-700 rounded-full text-xs sm:text-sm font-medium transition-all border border-gray-200 hover:border-black"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs text-gray-500 hidden sm:block">
              Press <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700 font-mono">Enter</kbd> to search or <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700 font-mono">Esc</kbd> to close
            </p>
            <p className="text-xs text-gray-500 sm:hidden">
              Tap search or press Enter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;