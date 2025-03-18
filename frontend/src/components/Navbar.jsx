import { useState, useEffect, useContext, useCallback, memo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import SearchBar from "./SearchBar";


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
    logoHover: {
        rest: { scale: 1 },
        hover: { scale: 1.05, rotate: 2, transition: { duration: 0.2 } },
    },
};

const NavbarLink = memo(({ to, children }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <span className="relative z-10">{children}</span>
                    <motion.span
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full"
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

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);

    const { setShowSearch, getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/collection", label: "Collection" },
        { path: "/wishlist", label: "Wishlist" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
    ];

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken("");
        setCartItems([]);
        setShowUserDropdown(false);
        navigate("/login");
    }, [setToken, setCartItems, navigate]);

    const handleUserIconClick = () => {
        if (token) setShowUserDropdown(!showUserDropdown);
        else navigate("/login");
    };

    const handleCartIconClick = () => {
        if (token) setShowCartDropdown(!showCartDropdown);
        else navigate("/login");
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = visible ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [visible]);

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

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ${scrolled ? "shadow-md py-2" : "py-4"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
                        <motion.div
                            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md"
                            variants={animations.logoHover}
                            initial="rest"
                            whileHover="hover"
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-white font-bold text-lg sm:text-xl">ZF</span>
                        </motion.div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                ZERO
                            </span>
                            <span className="text-xs font-medium text-gray-800">FASHION</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map(({ path, label }) => (
                            <NavbarLink key={path} to={path}>
                                {label}
                            </NavbarLink>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        <motion.button
                            onClick={() => setShowSearchBar(!showSearchBar)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 relative group"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.button>

                        <div className="relative user-dropdown">
                            <motion.button
                                onClick={handleUserIconClick}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
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
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                                    >
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/order"
                                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            Orders
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative cart-dropdown">
                            <motion.button
                                onClick={handleCartIconClick}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 relative"
                                aria-label="Shopping cart"
                                aria-expanded={showCartDropdown}
                            >
                                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
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
                                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                Your Cart ({getCartCount()} items)
                                            </p>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="block px-4 py-3 text-sm text-indigo-600 hover:bg-indigo-50 text-center transition-colors"
                                        >
                                            View Full Cart
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            onClick={() => setVisible(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="md:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            aria-label="Menu"
                        >
                            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {visible && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-60 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setVisible(false)}
                        />
                        <motion.div
                            variants={animations.mobileMenu}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 right-0 w-3/4 sm:w-64 h-full bg-white z-50 shadow-2xl"
                        >
                            <div className="flex flex-col h-full p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <Link to="/" onClick={() => setVisible(false)}>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white font-bold text-xl">ZF</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                                    ZERO
                                                </span>
                                                <span className="text-sm font-medium text-gray-800">FASHION</span>
                                            </div>
                                        </div>
                                    </Link>
                                    <motion.button
                                        onClick={() => setVisible(false)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="text-gray-600 hover:text-indigo-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.button>
                                </div>
                                <nav className="flex flex-col space-y-4 flex-grow">
                                    {navLinks.map(({ path, label }) => (
                                        <NavLink
                                            key={path}
                                            to={path}
                                            className={({ isActive }) =>
                                                `text-lg font-medium ${isActive ? "text-indigo-600" : "text-gray-800 hover:text-indigo-600"
                                                } transition-colors duration-200`
                                            }
                                            onClick={() => setVisible(false)}
                                        >
                                            {label}
                                        </NavLink>
                                    ))}
                                </nav>
                                <div className="mt-auto space-y-3">
                                    {token ? (
                                        <>
                                            <Link
                                                to="/profile"
                                                className="block w-full py-2.5 px-4 bg-indigo-50 text-indigo-600 rounded-lg text-center text-sm font-medium"
                                                onClick={() => setVisible(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setVisible(false);
                                                }}
                                                className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-lg text-center text-sm font-medium"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="block w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg text-center text-sm font-medium"
                                            onClick={() => setVisible(false)}
                                        >
                                            Login
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search Bar */}
            <AnimatePresence>
                {showSearchBar && (
                    <motion.div
                        className="fixed top-16 left-0 right-0 bg-white z-40 shadow-lg search-bar"
                        variants={animations.dropdown}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <SearchBar setShowSearchBar={setShowSearchBar} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default memo(Navbar);
