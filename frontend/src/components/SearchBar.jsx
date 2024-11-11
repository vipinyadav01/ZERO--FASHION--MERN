import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection") || location.pathname === "/") {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  useEffect(() => {
    if (showSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSearch]);

  if (!visible || !showSearch) {
    return null;
  }

  const handleSearchClose = () => {
    setShowSearch(false);
    setSearch("");
  };

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={handleSearchClose} />

      {/* Search bar container - Updated positioning */}
      <div className="fixed mt-16 md:mt-20 inset-x-0 z-30 bg-white md:bg-gray-50 transform transition-transform duration-200 ease-in-out">
        <div className="border-b shadow-md">
          {/* Mobile header */}
          <div className="flex items-center justify-between px-4 py-2 border-b md:hidden">
            <h2 className="text-lg font-medium">Search</h2>
            <button
              type="button"
              onClick={handleSearchClose}
              className="p-2 hover:opacity-75"
              aria-label="Close search"
            >
              <img className="w-4" src={assets.cross_icon} alt="" />
            </button>
          </div>

          {/* Search input container */}
          <div className="p-4 md:py-2 md:container md:mx-auto">
            <div className="flex items-center">
              {/* Search input */}
              <div className="flex-1 relative">
                <div className="relative flex items-center border border-gray-300 rounded-full bg-gray-50 md:bg-white overflow-hidden">
                  <img
                    className="w-4 h-4 absolute left-4 opacity-50"
                    src={assets.search_icon}
                    alt=""
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 md:py-2 outline-none bg-transparent text-sm"
                    type="text"
                    placeholder="Search products..."
                    aria-label="Search products"
                    autoFocus
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-4 p-1 hover:opacity-75"
                      aria-label="Clear search"
                    >
                      <img className="w-3" src={assets.cross_icon} alt="" />
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop close button */}
              <button
                type="button"
                onClick={handleSearchClose}
                className="hidden md:inline-flex p-2 hover:opacity-75 ml-2"
                aria-label="Close search"
              >
                <img className="w-3" src={assets.cross_icon} alt="" />
              </button>
            </div>

            {/* Recent searches - Mobile only */}
            <div className="mt-6 md:hidden">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Searches</h3>
              <div className="space-y-4">
                {["Summer Collection", "New Arrivals", "Sale Items"].map((item, index) => (
                  <button
                    key={index}
                    className="flex items-center w-full text-left text-sm hover:bg-gray-50 p-2 rounded"
                    onClick={() => setSearch(item)}
                  >
                    <img className="w-4 mr-3 opacity-50" src={assets.search_icon} alt="" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;