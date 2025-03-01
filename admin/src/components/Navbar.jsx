import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        setIsLoading(true);
        setTimeout(() => {
            sessionStorage.removeItem("token");
            setToken("");
            setIsLoading(false);
        }, 1000);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: <User size={18} /> },
        { name: "Profile", href: "/profile", icon: <User size={18} /> },
    ];

    return (
        <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and branding */}
                    <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <img
                            className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
                            src={assets.logo}
                            alt="Zero Fashion Logo"
                        />
                        <div>
                            <div className="flex items-baseline">
                                <span className="text-lg font-bold text-white mr-1">ZERO</span>
                                <span className="text-xl font-extrabold text-white uppercase">FASHION</span>
                            </div>
                            <div className="text-xs font-semibold text-teal-300 tracking-widest uppercase -mt-1">
                                Admin Panel
                            </div>
                        </div>
                    </Link>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* User dropdown - Desktop */}
                    <div className="hidden md:block relative" ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            type="button"
                            className="flex items-center text-sm px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200"
                            aria-expanded={isDropdownOpen}
                        >
                            <img
                                className="h-8 w-8 rounded-full border-2 border-teal-400 object-cover"
                                src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                                alt="User avatar"
                            />
                            <span className="ml-2 text-gray-100 font-medium">Admin</span>
                            <ChevronDown
                                size={16}
                                className={`ml-1 text-gray-300 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* Dropdown menu */}
                        {isDropdownOpen && (
                            <div
                                className="origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-in-out divide-y divide-gray-100"
                                role="menu"
                            >
                                <div className="py-2 px-4">
                                    <div className="text-sm font-medium text-gray-900">Admin User</div>
                                    <div className="text-xs text-gray-500">admin@zerofashion.com</div>
                                </div>
                                <div className="py-1" role="none">
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-150"
                                        role="menuitem"
                                    >
                                        <User size={16} className="mr-2" />
                                        My Profile
                                    </Link>
                                </div>
                                <div className="py-1" role="none">
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                                        role="menuitem"
                                    >
                                        <LogOut size={16} className="mr-2" />
                                        {isLoading ? "Logging out..." : "Logout"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-800 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 divide-y divide-slate-700/50">
                        {/* Nav items */}
                        <div className="space-y-1 py-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 transition-colors duration-150"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* User profile section in mobile menu */}
                        <div className="pt-4 pb-2">
                            <div className="flex items-center px-3 py-2">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-full border-2 border-teal-400"
                                        src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                                        alt="User avatar"
                                    />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">Admin User</div>
                                    <div className="text-sm font-medium text-gray-400">admin@zerofashion.com</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <Link
                                    to="/profile"
                                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 transition-colors duration-150"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User size={18} className="mr-3" />
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    disabled={isLoading}
                                    className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors duration-150"
                                >
                                    <LogOut size={18} className="mr-3" />
                                    {isLoading ? "Logging out..." : "Logout"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
