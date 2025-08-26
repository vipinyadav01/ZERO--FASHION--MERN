import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../App";
import { LogOut, Menu, X, ChevronDown, Bell, Search, User, Settings, HelpCircle, Command } from "lucide-react";

const Navbar = ({ onLogout }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState({ name: "", email: "", profileImage: "", role: "" });
    const dropdownRef = useRef(null);
    const notificationsRef = useRef(null);
    const searchInputRef = useRef(null);

    const handleLogout = () => {
        if (isLoading) return;
        setIsLoading(true);
        Promise.resolve(onLogout?.())
            .finally(() => {
                setIsLoading(false);
                setIsMenuOpen(false);
                setIsDropdownOpen(false);
            });
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

    const notifications = [
        { id: 1, title: "New order received", desc: "Order #1247 from customer John D.", time: "5 min ago", read: false, type: "order" },
        { id: 2, title: "Product inventory low", desc: "Winter Jacket - Only 3 items left", time: "2 hours ago", read: false, type: "warning" },
        { id: 3, title: "System update completed", desc: "Dashboard performance improved", time: "Yesterday", read: true, type: "system" },
        { id: 4, title: "Payment processed", desc: "Monthly subscription renewed", time: "3 hours ago", read: true, type: "payment" },
        { id: 5, title: "New user registered", desc: "Welcome new customer Sarah M.", time: "1 day ago", read: true, type: "user" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fetch current user
    useEffect(() => {
        const controller = new AbortController();
        const fetchUser = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) return;
                const res = await axios.get(`${backendUrl}/api/user/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal
                });
                if (res.data?.success && res.data?.user) {
                    const u = res.data.user;
                    setUser({
                        name: u.name || "",
                        email: u.email || "",
                        role: u.role || "",
                        profileImage: u.profileImage || "" 
                    });
                } else {
                    throw new Error(res.data?.message || "Failed to load user");
                }
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Failed to load user";
                toast.error(message);
                setUser({
                    name: "Admin",
                    email: "admin@zerofashion.com",
                    role: "Administrator",
                    profileImage: "" 
                });
            }
        };
        fetchUser();
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const avatarSrc = user.profileImage || "/zero.png";
    const displayName = user.name || "Admin";
    const displayEmail = user.email || "admin@zerofashion.com";

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
                        
                        <Link 
                            to="/dashboard" 
                            className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity"
                        >
                            <img
                                src="/zero.png"
                                alt="Zero Fashion Logo"
                                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg"
                                loading="eager"
                                decoding="async"
                            />
                            <div className="hidden sm:block">
                                <div className="flex items-baseline">
                                    <span className="text-base sm:text-lg lg:text-xl font-bold text-white mr-1">ZERO</span>
                                    <span className="text-lg sm:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        FASHION
                                    </span>
                                </div>
                                <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-400 tracking-widest uppercase -mt-1">
                                    Admin Portal
                                </div>
                            </div>
                        </Link>

                        {/* Search bar - Desktop */}
                        <div className="hidden lg:flex flex-1 max-w-xl mx-6 xl:mx-8">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Search className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full py-3 px-5 pl-12 pr-20 text-sm bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-600/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white placeholder-slate-400 outline-none transition-all duration-300"
                                    placeholder="Search products, orders, users..."
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="p-1 rounded-lg hover:bg-slate-700/50"
                                        >
                                            <X className="w-4 h-4 text-slate-400 hover:text-white" />
                                        </button>
                                    )}
                                    <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-700/50 border border-slate-600/30">
                                        <Command className="w-3 h-3 text-slate-500" />
                                        <span className="text-xs text-slate-500 font-medium">K</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Action buttons */}
                        <div className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3">
                            <button 
                                onClick={toggleMobileSearch}
                                className="lg:hidden p-2.5 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            <div className="relative" ref={notificationsRef}>
                                <button
                                    onClick={toggleNotifications}
                                    className="relative p-2.5 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    aria-label="Notifications"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full ring-2 ring-slate-900">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {isNotificationsOpen && (
                                    <div className="origin-top-right absolute right-0 mt-3 w-80 lg:w-96 xl:w-[400px] rounded-2xl shadow-2xl bg-slate-800/98 backdrop-blur-2xl border border-slate-700/60 focus:outline-none overflow-hidden">
                                        <div className="px-6 py-4 border-b border-slate-700/50">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-base font-semibold text-white">Notifications</h3>
                                                <span className="text-xs px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 font-medium border border-slate-600/40">
                                                    {unreadCount} new
                                                </span>
                                            </div>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.slice(0, 5).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className={`px-6 py-4 hover:bg-slate-700/30 cursor-pointer border-l-3 ${
                                                        item.read ? "border-transparent" : "border-indigo-500"
                                                    } transition-all duration-200`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-lg mt-0.5 flex-shrink-0">
                                                            {getNotificationIcon(item.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-white truncate">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                                {item.desc}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    type="button"
                                    className="flex items-center text-sm px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-slate-700/50"
                                    aria-label="User menu"
                                >
                                    <div className="relative">
                                        <img
                                            className="h-8 w-8 lg:h-9 lg:w-9 rounded-xl border-2 border-indigo-500/30 object-cover"
                                            src={avatarSrc}
                                            alt="User avatar"
                                        />
                                    </div>
                                    <span className="ml-3 text-white font-medium hidden lg:inline">{displayName}</span>
                                    <ChevronDown
                                        size={16}
                                        className={`ml-2 text-slate-400 ${isDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {isDropdownOpen && (
                                    <div
                                        className="origin-top-right absolute right-0 mt-3 w-64 lg:w-72 xl:w-80 rounded-2xl shadow-2xl bg-slate-800/98 backdrop-blur-2xl border border-slate-700/60 ring-1 ring-white/5 focus:outline-none overflow-hidden"
                                        role="menu"
                                    >
                                        <div className="py-5 px-6 border-b border-slate-700/50">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    className="h-12 w-12 rounded-xl border-2 border-indigo-500/30 object-cover"
                                                    src={avatarSrc}
                                                    alt="User avatar"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-base font-semibold text-white">{displayName}</div>
                                                    <div className="text-sm text-slate-300 opacity-80 truncate">{displayEmail}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-3" role="none">
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoading}
                                                className="flex w-full items-center px-6 py-3 text-sm text-white hover:bg-slate-700/30 transition-all duration-200 group disabled:opacity-50"
                                                role="menuitem"
                                            >
                                                <div className="p-2 rounded-lg bg-red-500/20 mr-3">
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

                        {/* Mobile actions */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                onClick={toggleMobileSearch}
                                className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <button
                                onClick={toggleMenu}
                                type="button"
                                className="inline-flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
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
                                className="block w-full py-3 px-5 pl-12 pr-12 text-sm bg-slate-800/60 rounded-2xl border border-slate-600/50 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white placeholder-slate-400 outline-none"
                                placeholder="Search products, orders, users..."
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                                >
                                    <X className="w-4 h-4 text-slate-400 hover:text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Mobile menu overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed top-16 left-0 right-0 bottom-0 bg-slate-900/98 backdrop-blur-2xl border-t border-slate-700/50">
                        <div className="flex flex-col h-full">
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-6 border-b border-slate-700/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <span className="text-xs px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 font-medium border border-slate-600/40">
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
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center mb-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                                        <img
                                            className="h-14 w-14 rounded-xl border-2 border-indigo-500/30"
                                            src={avatarSrc}
                                            alt="User avatar"
                                        />
                                        <div className="ml-4 flex-1">
                                            <div className="text-lg font-semibold text-white">{displayName}</div>
                                            <div className="text-sm font-medium text-slate-400 truncate">{displayEmail}</div>
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