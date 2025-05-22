import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, X, ChevronDown, Bell, Search, User, Settings, HelpCircle } from "lucide-react";
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

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <nav className="bg-slate-800 shadow-xl fixed top-0 left-0 right-0 w-full z-50 border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and branding */}
                    <Link to="/dashboard" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all duration-300">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-lg sm:text-xl font-bold text-white">ZF</span>
                        </div>
                        <div>
                            <div className="flex items-baseline">
                                <span className="text-base sm:text-lg font-bold text-white mr-1">ZERO</span>
                                <span className="text-lg sm:text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 uppercase">FASHION</span>
                            </div>
                            <div className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-widest uppercase -mt-1">
                                Admin Portal
                            </div>
                        </div>
                    </Link>

                    {/* Search bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md mx-6">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="search"
                                className="block w-full py-2 px-4 pl-10 text-sm bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all duration-300"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Action buttons - Desktop */}
                    <div className="hidden md:flex items-center space-x-3">
                        {/* Notifications */}
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={toggleNotifications}
                                className="p-2 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 relative transition-all duration-300"
                                aria-label="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 block w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-slate-800"></span>
                                )}
                            </button>

                            {/* Notifications dropdown */}
                            {isNotificationsOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-slate-800 border border-slate-700 focus:outline-none transition-all duration-200 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-700 bg-slate-800/90 backdrop-blur-sm">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-white">Notifications</h3>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                                                {unreadCount} new
                                            </span>
                                        </div>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                        {notifications.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`px-4 py-3 hover:bg-slate-700 cursor-pointer border-l-2 ${
                                                    item.read ? "border-transparent" : "border-indigo-500"
                                                } transition-all duration-150`}
                                            >
                                                <p className="text-sm font-medium text-white">{item.title}</p>
                                                <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-4 py-3 border-t border-slate-700 bg-slate-800/90 backdrop-blur-sm">
                                        <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-150">
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
                                className="flex items-center text-sm px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                aria-label="User menu"
                            >
                                <img
                                    className="h-8 w-8 rounded-lg border-2 border-indigo-500/30 object-cover"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRs_rWILOMx5-v3aXwJu7LWUhnPceiKvvDg&s"
                                    alt="User avatar"
                                />
                                <span className="ml-2 text-white font-medium hidden lg:inline">Admin</span>
                                <ChevronDown
                                    size={16}
                                    className={`ml-2 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div
                                    className="origin-top-right absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/10 ring-1 ring-white/5 focus:outline-none transition-all duration-300 overflow-hidden"
                                    role="menu"
                                >
                                    <div className="py-4 px-5 border-b border-white/10 bg-white/5">
                                        <div className="text-base font-semibold text-white">Admin User</div>
                                        <div className="text-sm text-slate-300 opacity-80 truncate">admin@zerofashion.com</div>
                                    </div>
                                    <div className="py-2" role="none">
                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoading}
                                            className="flex w-full items-center px-5 py-2.5 text-sm text-white hover:bg-white/10 hover:text-indigo-300 transition-all duration-200 group"
                                            role="menuitem"
                                        >
                                            <LogOut size={16} className="mr-3 text-slate-400 group-hover:text-indigo-300 transition-colors" />
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
                <div className="md:hidden bg-slate-800 shadow-2xl border-t border-slate-700">
                    {/* Search in mobile menu */}
                    <div className="px-4 pt-4 pb-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4 text-slate-400" />
                            </div>
                            <input
                                type="search"
                                className="block w-full p-2 pl-10 text-sm bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-400 outline-none transition-all duration-300"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    <div className="px-2 pt-2 pb-3 space-y-1 divide-y divide-slate-700/50">
                        {/* Notifications in mobile menu */}
                        <div className="py-2">
                            <div className="px-3 py-2 text-sm font-medium text-slate-300 flex justify-between items-center">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {notifications.map((item) => (
                                <div
                                    key={item.id}
                                    className={`px-3 py-2 hover:bg-slate-700 rounded-lg mx-2 border-l-2 ${
                                        item.read ? "border-transparent" : "border-indigo-500"
                                    } transition-all duration-150`}
                                >
                                    <p className="text-sm font-medium text-white">{item.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                                </div>
                            ))}
                            <div className="px-3 py-2">
                                <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-150">
                                    View all notifications
                                </a>
                            </div>
                        </div>

                        {/* User profile section in mobile menu */}
                        <div className="pt-4 pb-2">
                            <div className="flex items-center px-3 py-2">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-10 w-10 rounded-lg border-2 border-indigo-500/30"
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRs_rWILOMx5-v3aXwJu7LWUhnPceiKvvDg&s"
                                        alt="User avatar"
                                    />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">Admin User</div>
                                    <div className="text-sm font-medium text-slate-400 truncate">admin@zerofashion.com</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1 px-2">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoading}
                                    className="flex w-full items-center px-3 py-2 rounded-lg text-base font-medium text-indigo-400 hover:text-indigo-300 hover:bg-slate-700 transition-all duration-150"
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