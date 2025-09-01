import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../constants";
import { LogOut, Menu, X, Search, User } from "lucide-react";

const Navbar = ({ onLogout }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState({ name: "", email: "", profileImage: "", role: "" });

  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch current user
  useEffect(() => {
    const controller = new AbortController();
    const fetchUser = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${backendUrl}/api/user/user`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (res.data?.success && res.data?.user) {
          const u = res.data.user;
          setUser({
            name: u.name || "",
            email: u.email || "",
            role: u.role || "",
            profileImage: u.profileImage || "",
          });
        } else {
          throw new Error(res.data?.message || "Failed to load user");
        }
      } catch (err) {
        if (err.name === "AbortError" || err.code === "ERR_CANCELED") return;

        const message = err.response?.data?.message || err.message || "Failed to load user";
        toast.error(message);
        setUser({
          name: "Admin",
          email: "admin@zerofashion.com",
          role: "Administrator",
          profileImage: "",
        });
      }
    };
    fetchUser();
    return () => controller.abort();
  }, []);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isMenuOpen]);

  // Handle logout
  const handleLogout = () => {
    if (isLoading) return;
    setIsLoading(true);
    Promise.resolve(onLogout?.()).finally(() => {
      setIsLoading(false);
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    });
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  const avatarSrc = user.profileImage || "/zero.png";
  const displayName = user.name || "Admin";
  const displayEmail = user.email || "admin@zerofashion.com";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Zero Fashion Logo"
              className="w-8 h-8 rounded-md"
              loading="eager"
              decoding="async"
            />
            <span className="text-lg font-semibold">Zero Fashion</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 mx-4 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Search..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-800"
              >
                <img
                  src={avatarSrc}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full border border-gray-700"
                />
                <span className="hidden lg:inline text-sm">{displayName}</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-md shadow-lg border border-gray-700">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <img
                        src={avatarSrc}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full border border-gray-700"
                      />
                      <div>
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="flex items-center w-full p-4 text-sm hover:bg-gray-800 disabled:opacity-50"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    {isLoading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Logging out...
                      </span>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="Search..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-md">
              <img
                src={avatarSrc}
                alt="User avatar"
                className="w-10 h-10 rounded-full border border-gray-700"
              />
              <div>
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center w-full p-3 mt-2 text-sm bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              <LogOut className="w-5 h-5 mr-2" />
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging out...
                </span>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;