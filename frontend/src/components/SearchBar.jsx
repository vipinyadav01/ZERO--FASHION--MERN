import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const SearchBar = ({ setShowSearchBar }) => {
    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const location = useLocation();
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = showSearch ? "hidden" : "unset";
        if (showSearch) searchInputRef.current?.focus();
        return () => (document.body.style.overflow = "unset");
    }, [showSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const searchBar = document.querySelector(".search-bar");
            if (searchBar && !searchBar.contains(event.target)) {
                setShowSearch(false);
                if (setShowSearchBar) setShowSearchBar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowSearch, setShowSearchBar]);

    const handleSearchClose = useCallback(() => {
        setShowSearch(false);
        if (setShowSearchBar) setShowSearchBar(false);
        setTimeout(() => setSearch(""), 200);
    }, [setShowSearch, setSearch, setShowSearchBar]);

    const handleSearchChange = useCallback(
        (e) => setSearch(e.target.value),
        [setSearch]
    );

    const handleSearchSubmit = useCallback(
        (e) => {
            if (e.key === "Enter" && search.trim() !== "") {
                navigate(`/search?q=${search}`);
                handleSearchClose();
            }
        },
        [navigate, search, handleSearchClose]
    );

    return (
        <AnimatePresence>
            {showSearch && (
                <>
                    {/* Backdrop for Mobile */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleSearchClose}
                    />

                    {/* Search Bar */}
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-50 bg-white md:bg-gray-50 shadow-lg search-bar md:max-w-3xl md:mx-auto md:rounded-b-xl md:mt-16"
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <div className="p-4 sm:p-6">
                            {/* Header for Mobile */}
                            <div className="flex items-center justify-between mb-4 md:hidden">
                                <h2 className="text-lg font-semibold text-gray-800">Search</h2>
                                <motion.button
                                    onClick={handleSearchClose}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-gray-600 hover:text-indigo-600 transition-colors"
                                    aria-label="Close search"
                                >
                                    <img className="w-5 h-5" src={assets.cross_icon} alt="Close" />
                                </motion.button>
                            </div>

                            {/* Search Input */}
                            <div className="relative flex items-center">
                                <div className="relative flex-1">
                                    <motion.div
                                        className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200 overflow-hidden"
                                        initial={{ scale: 0.98 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <img
                                            className="w-5 h-5 absolute left-4 text-gray-400"
                                            src={assets.search_icon}
                                            alt="Search icon"
                                        />
                                        <input
                                            ref={searchInputRef}
                                            value={search}
                                            onChange={handleSearchChange}
                                            onKeyDown={handleSearchSubmit}
                                            className="w-full pl-12 pr-10 py-3 sm:py-3.5 text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent outline-none"
                                            type="text"
                                            placeholder="Search products..."
                                            aria-label="Search products"
                                        />
                                        {search && (
                                            <motion.button
                                                onClick={() => setSearch("")}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="absolute right-3 p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                                                aria-label="Clear search"
                                            >
                                                <img className="w-4 h-4" src={assets.cross_icon} alt="Clear" />
                                            </motion.button>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Close Button for Desktop */}
                                <motion.button
                                    onClick={handleSearchClose}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="hidden md:flex ml-3 p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                                    aria-label="Close search"
                                >
                                    <img className="w-4 h-4" src={assets.cross_icon} alt="Close" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SearchBar;
