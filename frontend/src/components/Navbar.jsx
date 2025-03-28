import React, { useState, useEffect, useContext, useCallback, memo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, User, ShoppingBag,
    Home, PlayIcon, Grid, ListOrdered, UserCircle,
    Contact, Bell, Headset
} from "lucide-react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext"; // Import the real ShopContext

const animations = {
    dropdown: {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
    },
    mobileMenu: {
        hidden: { x: "100%" },
        visible: { x: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { x: "100%", transition: { duration: 0.25, ease: "easeIn" } },
    },
};

const NavbarLink = memo(({ to, children }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? "text-blue-600" : "text-black/70 hover:text-blue-600"}`
            }
        >
            {({ isActive }) => (
                <>
                    <span className="relative z-10">{children}</span>
                    <motion.span
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isActive ? 1 : 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                </>
            )}
        </NavLink>
    );
});

NavbarLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const SearchBar = ({ setShowSearchBar }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setShowSearchBar(false);
        }
    };

    return (
        <div className="bg-white p-4">
            <form onSubmit={handleSearch} className="flex items-center">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for Products"
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                >
                    Search
                </button>
            </form>
        </div>
    );
};

const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getCartCount, token } = useContext(ShopContext);

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: PlayIcon, label: "Collection", path: "/collection" },
        { icon: Grid, label: "Wishlist", path: "/wishlist" },
        {
            icon: Headset,
            label: "Support",
            path: token ? "/support" : "/login",
        },
        {
            icon: ListOrdered,
            label: "Order",
            path: token ? "/order" : "/login",
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[ распределение_0_-2px_10px_rgba(0,0,0,0.1)] z-50 md:hidden">
            <div className="flex justify-around py-2">
                {navItems.map((item) => (
                    <motion.button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`relative flex flex-col items-center justify-center ${location.pathname === item.path
                            ? "text-blue-600"
                            : "text-black/70 hover:text-blue-600"
                            }`}
                        whileTap={{ scale: 0.9 }}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs mt-1">{item.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);

    const {
        token,
        setToken,
        setShowSearch,
        getCartCount,
        setCartItems,
        cartItems,
    } = useContext(ShopContext);

    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/collection", label: "Collection" },
        { path: "/wishlist", label: "Wishlist" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
    ];

    // Sync token with localStorage on mount and changes
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken && !token) {
            setToken(storedToken);
        }
    }, [token, setToken]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null); // Update context state
        setCartItems([]); // Reset cart items
        setShowUserDropdown(false);
        setShowCartDropdown(false);
        navigate("/login");
    }, [navigate, setToken, setCartItems]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const navbar = document.querySelector("nav");
            const searchBar = document.querySelector(".search-bar");
            const userDropdown = document.querySelector(".user-dropdown");
            const cartDropdown = document.querySelector(".cart-dropdown");
            if (
                navbar &&
                !navbar.contains(event.target) &&
                !searchBar?.contains(event.target) &&
                !userDropdown?.contains(event.target) &&
                !cartDropdown?.contains(event.target)
            ) {
                setShowUserDropdown(false);
                setShowCartDropdown(false);
                setShowSearchBar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setShowSearch(location.pathname.includes("/search"));
        return () => setShowSearch(false);
    }, [location.pathname, setShowSearch]);

    const handleUserIconClick = () => {
        if (token) {
            setShowUserDropdown((prev) => !prev);
        } else {
            navigate("/login");
        }
    };

    const handleCartIconClick = () => {
        if (token) {
            setShowCartDropdown((prev) => !prev);
        } else {
            navigate("/login");
        }
    };

    return (
        <>
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 bg-white text-black z-50 md:hidden">
                <div className="flex items-center justify-between px-4 py-2">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-sm">ZF</span>
                        </div>
                        <span className="text-lg font-bold text-black">ZFashion</span>
                    </Link>

                    {/* Search and Cart */}
                    <div className="flex items-center space-x-4">
                        <div
                            className="relative flex items-center bg-gray-100 rounded-full px-3 py-2 w-48"
                            onClick={() => setShowSearchBar(true)}
                        >
                            <Search className="w-5 h-5 text-blue-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Search for Products"
                                className="bg-transparent text-sm outline-none placeholder-black/70 text-black w-full"
                                readOnly
                            />
                        </div>

                        {/* Cart Icon */}
                        <div className="relative">
                            <Link to={token ? "/cart" : "/login"} className="relative">
                                <ShoppingBag className="w-6 h-6 text-blue-500" />
                                {token && getCartCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex justify-around py-2 bg-white text-black">
                    <Link to={token ? "/profile" : "/login"} className="flex flex-col items-center hover:text-blue-600">
                        <UserCircle className="w-6 h-6 text-blue-500" />
                        <span className="text-xs mt-1">Profile</span>
                    </Link>
                    <Link to={token ? "/notifications" : "/login"} className="flex flex-col items-center hover:text-blue-600">
                        <Bell className="w-6 h-6 text-blue-500" />
                        <span className="text-xs mt-1">Notification</span>
                    </Link>
                    <Link to="/contact" className="flex flex-col items-center hover:text-blue-600">
                        <Contact className="w-6 h-6 text-blue-500" />
                        <span className="text-xs mt-1">Contact</span>
                    </Link>
                </div>

                {/* Location Display */}
                <div className="flex items-center px-4 py-2 bg-white text-black">
                    <Home className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium truncate">GLA UNIVERSITY MATHURA, MAIN CAN...</span>
                </div>
            </div>

            {/* Search Bar Overlay */}
            {showSearchBar && <SearchBar setShowSearchBar={setShowSearchBar} />}

            {/* Adjust top margin for content below mobile navbar */}
            <div className="h-24 md:hidden"></div>

            {/* Desktop Navigation */}
            <motion.nav
                className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ${scrolled ? "shadow-lg py-2" : "py-4"} hidden md:block`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg sm:text-xl">ZF</span>
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-lg font-bold text-black">ZERO</span>
                                <span className="text-xs font-medium text-black/70">FASHION</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map(({ path, label }) => (
                                <NavbarLink key={path} to={path}>
                                    {label}
                                </NavbarLink>
                            ))}
                        </div>

                        {/* Desktop Icons */}
                        <div className="flex items-center space-x-4 sm:space-x-6">
                            <motion.button
                                onClick={() => setShowSearchBar(!showSearchBar)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-blue-500 hover:text-blue-600 transition-colors duration-200 relative group"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.button>

                            {/* User Dropdown */}
                            <div className="relative user-dropdown">
                                <motion.button
                                    onClick={handleUserIconClick}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                    aria-label="User profile"
                                    aria-expanded={showUserDropdown}
                                >
                                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.button>
                                <AnimatePresence>
                                    {showUserDropdown && token && (
                                        <motion.div
                                            variants={animations.dropdown}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                                        >
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2.5 text-sm text-black hover:bg-gray-100 transition-colors"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2.5 text-sm text-black hover:bg-gray-100 transition-colors"
                                                onClick={() => setShowUserDropdown(false)}
                                            >
                                                Orders
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-100 transition-colors"
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Cart Dropdown */}
                            <div className="relative cart-dropdown">
                                <motion.button
                                    onClick={handleCartIconClick}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200 relative"
                                    aria-label="Shopping cart"
                                    aria-expanded={showCartDropdown}
                                >
                                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                                    {token && getCartCount() > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                            {getCartCount()}
                                        </span>
                                    )}
                                </motion.button>
                                <AnimatePresence>
                                    {showCartDropdown && token && (
                                        <motion.div
                                            variants={animations.dropdown}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-200">
                                                <p className="text-sm font-medium text-black">
                                                    Your Cart ({getCartCount()} items)
                                                </p>
                                            </div>
                                            <Link
                                                to="/cart"
                                                className="block px-4 py-3 text-sm text-black hover:bg-gray-100 text-center transition-colors"
                                                onClick={() => setShowCartDropdown(false)}
                                            >
                                                View Full Cart
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Search Bar */}
            <AnimatePresence>
                {showSearchBar && (
                    <motion.div
                        className="fixed top-16 left-0 right-0 bg-white z-40 shadow-lg search-bar md:top-[4.5rem]"
                        variants={animations.dropdown}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <SearchBar setShowSearchBar={setShowSearchBar} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation */}
            <BottomNavigation />
        </>
    );
};

export default memo(Navbar);
