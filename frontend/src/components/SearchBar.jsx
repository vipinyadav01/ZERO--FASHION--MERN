import React, { useEffect, useState, useCallback } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Camera, Mic } from "lucide-react";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      // Navigate to collection page with search query
      navigate(`/collection?search=${encodeURIComponent(search.trim())}`);
      setShowSearch(false);
    }
  };

  const handleClose = useCallback(() => {
    setShowSearch(false);
    setSearch("");
  }, [setShowSearch, setSearch]);

  useEffect(() => {
    // Show search bar when showSearch is true from context
    setVisible(showSearch);
  }, [showSearch]);

  useEffect(() => {
    // Handle keyboard events
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && visible) {
        handleClose();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [visible, handleClose]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed top-0 left-0 right-0 z-[80] bg-black/20 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
      >
        <motion.div 
          className="bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-2xl"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-black">Search Products</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-black/5 transition-colors duration-200 group"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-gray-600 group-hover:text-black" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="relative">
              <div className={`relative flex items-center bg-white rounded-2xl border-2 transition-all duration-300 shadow-lg ${
                focused ? "border-black shadow-xl" : "border-gray-200 hover:border-gray-300"
              }`}>
                <div className="absolute left-4">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  className="flex-1 pl-12 pr-24 sm:pr-20 py-3 sm:py-4 text-base sm:text-lg outline-none bg-transparent text-black placeholder-gray-500 rounded-2xl"
                  type="text"
                  placeholder="Search for products..."
                  aria-label="Search products"
                  autoFocus
                />
                
                <div className="absolute right-2 flex items-center space-x-1 sm:space-x-2">
                  <button
                    type="button"
                    className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                    aria-label="Voice search"
                  >
                    <Mic className="w-4 h-4 text-gray-500 group-hover:text-black" />
                  </button>
                  
                  <button
                    type="button"
                    className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
                    aria-label="Camera search"
                  >
                    <Camera className="w-4 h-4 text-gray-500 group-hover:text-black" />
                  </button>
                  
                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 font-medium text-sm sm:text-base"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Search Suggestions */}
            {search && (
              <motion.div 
                className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Suggestions</h3>
                  <div className="space-y-2">
                    {[
                      `${search} for men`,
                      `${search} for women`,
                      `${search} sale`,
                      `${search} new arrivals`
                    ].map((suggestion, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setSearch(suggestion);
                          navigate(`/collection?search=${encodeURIComponent(suggestion)}`);
                          setShowSearch(false);
                        }}
                        className="flex items-center w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                        whileHover={{ x: 4 }}
                      >
                        <Search className="w-4 h-4 text-gray-400 mr-3 group-hover:text-black" />
                        <span className="text-gray-700 group-hover:text-black">{suggestion}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Popular Categories */}
            {!search && (
              <motion.div 
                className="mt-4 sm:mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Popular Categories</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    "T-Shirts", "Jeans", "Dresses", "Sneakers", "Jackets", 
                    "Accessories", "Bags", "Watches", "Sunglasses", "Hoodies"
                  ].map((category, index) => (
                    <motion.button
                      key={category}
                      onClick={() => {
                        setSearch(category);
                        navigate(`/collection?search=${encodeURIComponent(category)}`);
                        setShowSearch(false);
                      }}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-black hover:text-white text-gray-700 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-black"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Search Tips */}
            <motion.div 
              className="mt-4 sm:mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs text-gray-500 hidden sm:block">
                Press <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700 font-mono">Enter</kbd> to search or <kbd className="px-2 py-1 bg-gray-200 rounded text-gray-700 font-mono">Esc</kbd> to close
              </p>
              <p className="text-xs text-gray-500 sm:hidden">
                Tap search or press Enter
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchBar;
