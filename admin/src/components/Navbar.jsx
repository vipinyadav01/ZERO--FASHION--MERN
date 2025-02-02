import React, { useState } from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        setIsLoading(true);
        setTimeout(() => {
            setToken("");
            setIsLoading(false);
        }, 1000);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <img
                            className="w-8 h-8 sm:w-10 sm:h-10"
                            src={assets.logo}
                            alt="Company logo"
                        />
                        <div className="ml-4">
                            <div className="text-lg font-bold text-white leading-none">ZERO</div>
                            <div className="text-xl font-extrabold text-white uppercase leading-none">
                                FASHION
                            </div>
                            <div className="text-sm font-bold text-teal-200 tracking-wide">ADMIN</div>
                        </div>
                    </div>
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:items-center">
                        <div className="relative ml-3">
                            <button
                                onClick={toggleDropdown}
                                type="button"
                                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                id="user-menu"
                                aria-expanded="false"
                                aria-haspopup="true"
                            >
                                <span className="sr-only">Open user menu</span>
                                <img
                                    className="h-8 w-8 rounded-full border-2 border-teal-300"
                                    src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                                    alt="User avatar"
                                />
                                <span className="ml-2 p-2 text-white font-medium">Admin</span>
                            </button>
                            {isDropdownOpen && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-in-out"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu"
                                >
                                    <div className="py-1" role="none">
                                        <a
                                            href="/list"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-500 hover:text-teal-700"
                                            role="menuitem"
                                        >
                                            List
                                        </a>
                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoading}
                                            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-red-500 hover:text-white"
                                            role="menuitem"
                                        >
                                            {isLoading ? "Logging out..." : "Logout"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="sm:hidden bg-gradient-to-r from-blue-600 to-teal-500 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a
                            href="/list"
                            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-600"
                        >
                            List
                        </a>
                        <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-600"
                        >
                            {isLoading ? "Logging out..." : "Logout"}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
