import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, X, ChevronDown, Bell, Search, User, Settings, HelpCircle, Command } from "lucide-react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const notificationsRef = useRef(null);
    const searchInputRef = useRef(null);

    const handleLogout = () => {
        setIsLoading(true);
        setTimeout(() => {
            sessionStorage.removeItem("token");
            setToken("");
            setIsLoading(false);
            setIsMenuOpen(false);
        }, 1000);
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
        if (!isMenuOpen) {
            setIsMobileSearchOpen(false);
        }
    };

    const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
    const toggleNotifications = () => setIsNotificationsOpen(prev => !prev);
    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(prev => !prev);
        setTimeout(() => {
            if (searchInputRef.current && !isMobileSearchOpen) {
                searchInputRef.current.focus();
            }
        }, 100);
    };

    // Sample notifications with more variety
    const notifications = [
        { id: 1, title: "New order received", desc: "Order #1247 from customer John D.", time: "5 min ago", read: false, type: "order" },
        { id: 2, title: "Product inventory low", desc: "Winter Jacket - Only 3 items left", time: "2 hours ago", read: false, type: "warning" },
        { id: 3, title: "System update completed", desc: "Dashboard performance improved", time: "Yesterday", read: true, type: "system" },
        { id: 4, title: "Payment processed", desc: "Monthly subscription renewed", time: "3 hours ago", read: true, type: "payment" },
        { id: 5, title: "New user registered", desc: "Welcome new customer Sarah M.", time: "1 day ago", read: true, type: "user" },
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    // Close mobile menu when screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
                setIsMobileSearchOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                toggleMobileSearch();
            }
            if (event.key === 'Escape') {
                setIsMobileSearchOpen(false);
                setIsMenuOpen(false);
                setIsDropdownOpen(false);
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order': return '🛍️';
            case 'warning': return '⚠️';
            case 'system': return '⚙️';
            case 'payment': return '💳';
            case 'user': return '👤';
            default: return '📢';
        }
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${
                isScrolled 
                    ? 'bg-slate-900/98 backdrop-blur-2xl shadow-2xl border-b border-slate-700/60' 
                    : 'bg-slate-900/95 backdrop-blur-xl shadow-xl border-b border-slate-700/40'
            }`}>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                    <div className={`flex items-center justify-between transition-all duration-300 ${
                        isScrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20'
                    }`}>
                        {/* Enhanced Logo and branding */}
                        <Link 
                            to="/dashboard" 
                            className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-all duration-300 group relative"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500"></div>
                                <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300 group-hover:rotate-3">
                                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-sm">ZF</span>
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <div className="flex items-baseline">
                                    <span className="text-base sm:text-lg lg:text-xl font-bold text-white mr-1 group-hover:text-slate-100 transition-colors">ZERO</span>
                                    <span className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                                        FASHION
                                    </span>
                                </div>
                                <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-400 tracking-widest uppercase -mt-1 group-hover:text-slate-300 transition-colors">
                                    Admin Portal
                                </div>
                            </div>
                        </Link>

                        {/* Enhanced Search bar - Desktop */}
                        <div className="hidden lg:flex flex-1 max-w-xl mx-6 xl:mx-8">
                            <div className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors duration-300" />
                                </div>
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full py-3 px-5 pl-12 pr-20 text-sm bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-600/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white placeholder-slate-400 outline-none transition-all duration-300 hover:bg-slate-800/80 focus:bg-slate-800/90"
                                    placeholder="Search products, orders, users..."
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="p-1 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
                                        >
                                            <X className="w-4 h-4 text-slate-400 hover:text-white transition-colors duration-200" />
                                        </button>
                                    )}
                                    <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-700/50 border border-slate-600/30">
                                        <Command className="w-3 h-3 text-slate-500" />
                                        <span className="text-xs text-slate-500 font-medium">K</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Desktop Action buttons */}
                        <div className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
                            {/* Search button for medium screens */}
                            <button 
                                onClick={toggleMobileSearch}
                                className="lg:hidden p-2.5 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:scale-105"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Enhanced Notifications */}
                            <div className="relative" ref={notificationsRef}>
                                <button
                                    onClick={toggleNotifications}
                                    className="relative p-2.5 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 group hover:scale-105"
                                    aria-label="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full ring-2 ring-slate-900 animate-pulse shadow-lg">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Enhanced Notifications dropdown */}
                                {isNotificationsOpen && (
                                    <div className="origin-top-right absolute right-0 mt-3 w-80 lg:w-96 xl:w-[400px] rounded-2xl shadow-2xl bg-slate-800/98 backdrop-blur-2xl border border-slate-700/60 focus:outline-none transform transition-all duration-300 scale-100 opacity-100 overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/60 to-slate-700/60">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-base font-semibold text-white">Notifications</h3>
                                                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 font-medium border border-indigo-500/20">
                                                    {unreadCount} new
                                                </span>
                                            </div>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                                            {notifications.slice(0, 5).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className={`px-6 py-4 hover:bg-slate-700/30 cursor-pointer border-l-3 ${
                                                        item.read ? "border-transparent" : "border-indigo-500"
                                                    } transition-all duration-200 group/item hover:translate-x-1`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-lg mt-0.5 flex-shrink-0">
                                                            {getNotificationIcon(item.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-white group-hover/item:text-indigo-200 transition-colors truncate">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                                {item.desc}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                                                        </div>
                                                        {!item.read && (
                                                            <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-6 py-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/60 to-slate-700/60">
                                            <div className="flex items-center justify-between">
                                                <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                                                    View all notifications
                                                </button>
                                                <button className="text-xs text-slate-500 hover:text-slate-400 transition-colors duration-200">
                                                    Mark all as read
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Enhanced User dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    type="button"
                                    className="flex items-center text-sm px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50 hover:scale-[1.02]"
                                    aria-label="User menu"
                                >
                                    <div className="relative">
                                        <img
                                            className="h-8 w-8 lg:h-9 lg:w-9 rounded-xl border-2 border-indigo-500/30 object-cover"
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRs_rWILOMx5-v3aXwJu7LWUhnPceiKvvDg&s"
                                            alt="User avatar"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800 shadow-sm">
                                            <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    <span className="ml-3 text-white font-medium hidden lg:inline">Admin</span>
                                    <ChevronDown
                                        size={16}
                                        className={`ml-2 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* Enhanced Dropdown menu */}
                                {isDropdownOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-3 w-64 lg:w-72 xl:w-80 rounded-2xl shadow-2xl bg-slate-800/98 backdrop-blur-2xl border border-slate-700/60 ring-1 ring-white/5 focus:outline-none transition-all duration-300 overflow-hidden"
                                        role="menu"
                                    >
                                        <div className="py-5 px-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/60 to-slate-700/60">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img
                                                        className="h-12 w-12 rounded-xl border-2 border-indigo-500/30 object-cover"
                                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRs_rWILOMx5-v3aXwJu7LWUhnPceiKvvDg&s"
                                                        alt="User avatar"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800 shadow-sm">
                                                        <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-base font-semibold text-white">Admin User</div>
                                                    <div className="text-sm text-slate-300 opacity-80 truncate">admin@zerofashion.com</div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                                        <span className="text-xs text-emerald-400 font-medium">Online</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-3" role="none">
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoading}
                                                className="flex w-full items-center px-6 py-3 text-sm text-white hover:bg-slate-700/30 hover:text-red-300 transition-all duration-200 group disabled:opacity-50 hover:translate-x-1"
                                                role="menuitem"
                                            >
                                                <div className="p-2 rounded-lg bg-red-500/20 mr-3 group-hover:bg-red-500/30 transition-colors">
                                                    <LogOut size={16} className="text-red-400" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    {isLoading ? (
                                                        <span className="flex items-center">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Logging out...
                                                        </span>
                                                    ) : (
                                                        <div>
                                                            <div className="font-medium">Logout</div>
                                                            <div className="text-xs text-slate-400">Sign out of your account</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Mobile menu button */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                onClick={toggleMobileSearch}
                                className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                onClick={toggleMenu}
                                type="button"
                                className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
                                <div className="relative w-6 h-6">
                                    <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
                                    <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                                    <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                {isMobileSearchOpen && (
                    <div className="absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-2xl border-b border-slate-700/50 p-4 lg:hidden">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Search className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                ref={searchInputRef}
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full py-3 px-5 pl-12 pr-12 text-sm bg-slate-800/60 rounded-2xl border border-slate-600/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white placeholder-slate-400 outline-none transition-all duration-300"
                                placeholder="Search products, orders, users..."
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                                >
                                    <X className="w-4 h-4 text-slate-400 hover:text-white transition-colors duration-200" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Enhanced Mobile menu overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed top-16 left-0 right-0 bottom-0 bg-slate-900/98 backdrop-blur-2xl border-t border-slate-700/50 transition-transform duration-300 transform translate-y-0">
                        <div className="flex flex-col h-full">
                            {/* Enhanced Mobile menu content */}
                            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                                {/* Enhanced Notifications in mobile menu */}
                                <div className="p-6 border-b border-slate-700/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 font-medium border border-indigo-500/20">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {notifications.slice(0, 4).map((item) => (
                                            <div
                                                key={item.id}
                                                className={`p-4 hover:bg-slate-800/30 rounded-xl border-l-3 ${
                                                    item.read ? "border-transparent" : "border-indigo-500"
                                                } transition-all duration-200`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="text-base mt-0.5 flex-shrink-0">
                                                        {getNotificationIcon(item.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white">{item.title}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200 mt-4 w-full text-center p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50">
                                        View all notifications
                                    </button>
                                </div>

                                {/* Enhanced User profile section in mobile menu */}
                                <div className="p-6">
                                    <div className="flex items-center mb-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                        <div className="flex-shrink-0 relative">
                                            <img
                                                className="h-14 w-14 rounded-xl border-2 border-indigo-500/30"
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRs_rWILOMx5-v3aXwJu7LWUhnPceiKvvDg&s"
                                                alt="User avatar"
                                            />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800 shadow-sm">
                                                <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="text-lg font-semibold text-white">Admin User</div>
                                            <div className="text-sm font-medium text-slate-400 truncate">admin@zerofashion.com</div>
                                            <div className="flex items-center gap-1 mt-1">
                                                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                                <span className="text-xs text-emerald-400 font-medium">Online</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoading}
                                        className="flex w-full items-center justify-center px-6 py-4 rounded-xl text-base font-medium text-white bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 disabled:opacity-50"
                                    >
                                        <LogOut size={20} className="mr-3" />
                                        {isLoading ? (
                                            <span className="flex items-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Logging out...
                                            </span>
                                        ) : (
                                            "Logout"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;