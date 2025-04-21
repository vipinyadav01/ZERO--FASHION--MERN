import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  if (!showSearch || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="border-t border-b bg-gray-50 text-center py-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center max-w-xl mx-auto">
          <div className="relative flex items-center justify-between border border-gray-400 px-5 py-2 my-3 rounded-full w-full">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none bg-inherit text-sm"
              type="text"
              placeholder="Search products..."
              aria-label="Search products"
            />
            <button 
              className="ml-2 focus:outline-none" 
              aria-label="Search"
              onClick={() => setShowSearch(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setShowSearch(false)}
            className="ml-3 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none"
            aria-label="Close search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchBar;
