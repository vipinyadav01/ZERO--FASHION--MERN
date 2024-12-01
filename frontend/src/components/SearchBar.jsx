import React, { useEffect, useState, useRef, useCallback } from "react";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    setVisible(
      location.pathname.includes("collection") || location.pathname === "/"
    );
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = showSearch ? "hidden" : "unset";

    if (showSearch) {
      searchInputRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSearch]);

  const handleSearchClose = useCallback(() => {
    setShowSearch(false);
    setSearch("");
  }, [setShowSearch, setSearch]);

  const handleSearchChange = useCallback(
    (e) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );

  const handleSearchSubmit = useCallback(
    (e) => {
      if (e.key === "Enter") {
        navigate(`/search?q=${search}`);
        setShowSearch(false);
      }
    },
    [navigate, search, setShowSearch]
  );

  return (
    <>
      {showSearch && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={handleSearchClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 right-0 z-40 bg-white md:bg-gray-50 transform transition-transform duration-200 ease-in-out ${
          showSearch ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="border-b shadow-md">
          <div className="flex items-center justify-between px-4 py-2 border-b md:hidden">
            <h2 className="text-lg font-medium">Search</h2>
            <button
              type="button"
              onClick={handleSearchClose}
              className="p-2 hover:opacity-75"
              aria-label="Close search"
            >
              <img className="w-4" src={assets.cross_icon} alt="Close" />
            </button>
          </div>

          <div className="p-4 md:py-2 md:container md:mx-auto">
            <div className="flex items-center">
              <div className="flex-1 relative">
                <div className="relative flex items-center border border-gray-300 rounded-full bg-gray-50 md:bg-white overflow-hidden">
                  <img
                    className="w-4 h-4 absolute left-4 opacity-50"
                    src={assets.search_icon}
                    alt="Search"
                  />
                  <input
                    ref={searchInputRef}
                    value={search}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchSubmit}
                    className="w-full pl-12 pr-4 py-3 md:py-2 outline-none bg-transparent text-sm"
                    type="text"
                    placeholder="Search products..."
                    aria-label="Search products"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={handleSearchClose}
                      className="absolute right-4 p-1 hover:opacity-75"
                      aria-label="Clear search"
                    >
                      <img
                        className="w-3"
                        src={assets.cross_icon}
                        alt="Clear"
                      />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSearchClose}
                className="hidden md:inline-flex p-2 hover:opacity-75 ml-2"
                aria-label="Close search"
              >
                <img className="w-3" src={assets.cross_icon} alt="Close" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
