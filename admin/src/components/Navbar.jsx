import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, X, ChevronDown, Bell, Search } from "lucide-react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const notificationsRef = useRef(null);

    const handleLogout = () => {
        setIsLoading(true);
        setTimeout(() => {
            sessionStorage.removeItem("token");
            setToken("");
            setIsLoading(false);
            setIsMenuOpen(false);
        }, 1000);
    };

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
    const toggleNotifications = () => setIsNotificationsOpen(prev => !prev);

    // Sample notifications
    const notifications = [
        { id: 1, title: "New order received", time: "5 min ago", read: false },
        { id: 2, title: "Product inventory low", time: "2 hours ago", read: false },
        { id: 3, title: "System update completed", time: "Yesterday", read: true },
    ];

    // Close dropdown and notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="bg-gradient-to-b from-[#1a1a1a] to-[#131313] shadow-xl fixed top-0 left-0 right-0 w-full z-50 border-b border-[#939393]/10">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and branding */}
                    <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all duration-300">
                        <img
                            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                            src={assets.logo}
                            alt="Logo"
                        />
                        <div>
                            <div className="flex items-baseline">
                                <span className="text-base sm:text-lg font-bold text-white mr-1">ZERO</span>
                                <span className="text-lg sm:text-xl font-extrabold text-[#ff6200] uppercase">FASHION</span>
                            </div>
                            <div className="text-[10px] sm:text-xs font-semibold text-[#939393] tracking-widest uppercase -mt-1">
                                Admin Portal
                            </div>
                        </div>
                    </Link>

                    {/* Search bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md mx-6">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4 text-[#939393]" />
                            </div>
                            <input
                                type="search"
                                className="block w-full p-2 pl-10 text-sm bg-[#1a1a1a] rounded-lg border border-[#939393]/20 focus:ring-2 focus:ring-[#ff6200] focus:border-transparent text-white placeholder-[#939393] outline-none transition-all duration-300"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-[#939393] hover:text-[#ff6200] hover:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Action buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={toggleNotifications}
                                className="p-2 text-[#939393] hover:text-[#ff6200] rounded-lg hover:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#ff6200] relative transition-all duration-300"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-0 right-0 block w-2 h-2 bg-[#ff6200] rounded-full ring-2 ring-[#1a1a1a]"></span>
                            </button>

                            {/* Notifications dropdown */}
                            {isNotificationsOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-[#1a1a1a] border border-[#939393]/20 focus:outline-none transition-all duration-200">
                                    <div className="px-4 py-3 border-b border-[#939393]/20">
                                        <h3 className="text-sm font-medium text-white">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-[#939393]/20 scrollbar-track-transparent">
                                        {notifications.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`px-4 py-3 hover:bg-[#131313] cursor-pointer border-l-2 ${
                                                    item.read ? "border-transparent" : "border-[#ff6200]"
                                                } transition-all duration-150`}
                                            >
                                                <p className="text-sm font-medium text-white">{item.title}</p>
                                                <p className="text-xs text-[#939393] mt-1">{item.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-2 border-t border-[#939393]/20">
                                        <a href="#" className="text-xs font-medium text-[#ff6200] hover:text-[#ff6200]/80 transition-colors duration-150">
                                            View all notifications
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                type="button"
                                className="flex items-center text-sm px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300"
                            >
                                <img
                                    className="h-8 w-8 rounded-full border-2 border-[#ff6200]/50 object-cover"
                                    src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                                    alt="User avatar"
                                />
                                <span className="ml-2 text-white font-medium hidden lg:inline">Admin</span>
                                <ChevronDown
                                    size={16}
                                    className={`ml-2 text-[#939393] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-[#1a1a1a] border border-[#939393]/20 focus:outline-none transition-all duration-200"
                                    role="menu"
                                >
                                    <div className="py-3 px-4 border-b border-[#939393]/20">
                                        <div className="text-sm font-medium text-white">Admin User</div>
                                        <div className="text-xs text-[#939393] truncate">admin@zerofashion.com</div>
                                    </div>
                                    <div className="py-1" role="none">
                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoading}
                                            className="flex w-full items-center px-4 py-2 text-sm text-[#ff6200] hover:bg-[#131313] hover:text-[#ff6200]/80 transition-all duration-150"
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
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#1a1a1a] shadow-2xl border-t border-[#939393]/10">
                    {/* Search in mobile menu */}
                    <div className="px-4 pt-4 pb-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4 text-[#939393]" />
                            </div>
                            <input
                                type="search"
                                className="block w-full p-2 pl-10 text-sm bg-[#131313] rounded-lg border border-[#939393]/20 focus:ring-2 focus:ring-[#ff6200] focus:border-transparent text-white placeholder-[#939393] transition-all duration-300"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    <div className="px-2 pt-2 pb-3 space-y-1 divide-y divide-[#939393]/10">
                        {/* Notifications in mobile menu */}
                        <div className="py-2">
                            <div className="px-3 py-2 text-sm font-medium text-[#939393]">Notifications</div>
                            {notifications.map((item) => (
                                <div
                                    key={item.id}
                                    className={`px-3 py-2 hover:bg-[#131313] rounded-lg mx-2 border-l-2 ${
                                        item.read ? "border-transparent" : "border-[#ff6200]"
                                    } transition-all duration-150`}
                                >
                                    <p className="text-sm font-medium text-white">{item.title}</p>
                                    <p className="text-xs text-[#939393] mt-1">{item.time}</p>
                                </div>
                            ))}
                            <div className="px-3 py-2">
                                <a href="#" className="text-xs font-medium text-[#ff6200] hover:text-[#ff6200]/80 transition-colors duration-150">
                                    View all notifications
                                </a>
                            </div>
                        </div>

                        {/* User profile section in mobile menu */}
                        <div className="pt-4 pb-2">
                            <div className="flex items-center px-3 py-2">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-full border-2 border-[#ff6200]/50"
                                        src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                                        alt="User avatar"
                                    />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">Admin User</div>
                                    <div className="text-sm font-medium text-[#939393] truncate">admin@zerofashion.com</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                    className="flex w-full items-center px-3 py-2 rounded-lg text-base font-medium text-[#ff6200] hover:text-[#ff6200]/80 hover:bg-[#131313] transition-all duration-150"
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