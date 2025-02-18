import { useState, useEffect, useContext, useCallback, memo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

const animations = {
    dropdown: {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 30 },
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: { duration: 0.2 },
        },
    },
    mobileMenu: {
        hidden: { x: "100%" },
        visible: {
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
        exit: {
            x: "100%",
            transition: { duration: 0.3 },
        },
    },
    logoHover: {
        rest: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.2 } },
    },
};

const NavbarLink = memo(({ to, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative overflow-hidden group px-3 py-2 transition-colors duration-300 ${isActive ? "text-indigo-600" : "text-gray-700 hover:text-indigo-600"
            }`
        }
    >
        <span className="relative z-10">{children}</span>
        <motion.div
            className="absolute inset-0 bg-indigo-100 rounded-md -z-10"
            initial={false}
            animate={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
    </NavLink>
));

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showCartDropdown, setShowCartDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);

    const { setShowSearch, getCartCount, token, setToken, setCartItems, backendUrl } =
        useContext(ShopContext);

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
        if (token) {
            setShowUserDropdown(!showUserDropdown);
        } else {
            navigate("/login");
        }
    };

    const handleCartIconClick = () => {
        if (token) {
            setShowCartDropdown(!showCartDropdown);
        } else {
            navigate("/login");
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = visible ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ${scrolled ? "shadow-lg py-1" : "py-3"
                }`}
            initial={false}
            animate={{ y: scrolled ? -10 : 0 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-3">
                        <motion.div
                            className="w-10 h-10 bg-black rounded-lg flex items-center justify-center"
                            variants={animations.logoHover}
                            initial="rest"
                            whileHover="hover"
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-white font-bold text-xl">ZF</span>
                        </motion.div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                ZERO
                            </span>
                            <span className="text-sm font-medium text-gray-900">FASHION</span>
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center space-x-4">
                        {navLinks.map(({ path, label }) => (
                            <NavbarLink key={path} to={path}>
                                {label}
                            </NavbarLink>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <motion.button
                            onClick={() => setShowSearchBar(!showSearchBar)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 relative group"
                            aria-label="Search"
                        >
                            <Search size={20} />
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Search
                            </span>
                        </motion.button>

                        <div className="relative user-dropdown">
                            <motion.button
                                onClick={handleUserIconClick}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 relative group"
                                aria-label="User profile"
                            >
                                <User size={20} />
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {token ? "Profile" : "Login"}
                                </span>
                            </motion.button>

                            <AnimatePresence>
                                {showUserDropdown && token && (
                                    <motion.div
                                        variants={animations.dropdown}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-lg overflow-hidden"
                                    >
                                        <div className="py-2">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/order"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                                            >
                                                Orders
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative cart-dropdown">
                            <motion.button
                                onClick={handleCartIconClick}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 relative group"
                                aria-label="Shopping cart"
                            >
                                <ShoppingBag size={20} />
                                {getCartCount() > 0 && (
                                    <span className="absolute -top-2 -right-1 bg-indigo-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                        {getCartCount()}
                                    </span>
                                )}
                                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {token ? "Cart" : "Login to view cart"}
                                </span>
                            </motion.button>

                            <AnimatePresence>
                                {showCartDropdown && token && (
                                    <motion.div
                                        variants={animations.dropdown}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg overflow-hidden"
                                    >
                                        <div className="py-2">
                                            <div className="px-4 py-2 border-b border-gray-200">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Your Cart ({getCartCount()} items)
                                                </p>
                                            </div>
                                            {/* Add cart items here */}
                                            <Link
                                                to="/cart"
                                                className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 text-center"
                                            >
                                                View Full Cart
                                            </Link>
                                        </div>
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
                            <Menu size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        key="mobile-menu"
                        variants={{
                            hidden: { x: "100%" },
                            visible: { x: 0, transition: { type: "spring", stiffness: 100 } },
                            exit: { x: "100%", transition: { ease: "easeInOut", duration: 0.3 } },
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto"
                    >
                        {/* Menu Container */}
                        <div className="flex flex-col h-full p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-8">
                                <Link
                                    to="/"
                                    className="flex items-center space-x-3"
                                    onClick={() => setVisible(false)}
                                >
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">ZF</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                            ZERO
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">FASHION</span>
                                    </div>
                                </Link>

                                {/* Close Button */}
                                <motion.button
                                    onClick={() => setVisible(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                    aria-label="Close menu"
                                >
                                    <X size={24} />
                                </motion.button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex flex-col space-y-4">
                                {navLinks.map(({ path, label }) => (
                                    <motion.div
                                        key={path}
                                        whileHover={{ x: 10 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    >
                                        <NavLink
                                            to={path}
                                            className={({ isActive }) =>
                                                `text-xl font-medium ${isActive
                                                    ? "text-indigo-600"
                                                    : "text-gray-800 hover:text-indigo-600"
                                                } transition-colors duration-200 flex items-center space-x-2`
                                            }
                                            onClick={() => setVisible(false)}
                                        >
                                            {label}
                                        </NavLink>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Authentication Buttons */}
                            <div className="mt-auto">
                                {token ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="block w-full py-3 px-4 bg-indigo-50 text-indigo-600 rounded-lg text-center mb-4"
                                            onClick={() => setVisible(false)}
                                        >
                                            My Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setVisible(false);
                                            }}
                                            className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-lg text-center"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-lg text-center"
                                        onClick={() => setVisible(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Bar */}
            <AnimatePresence>
                {showSearchBar && (
                    <motion.div
                        className="fixed top-16 left-0 right-0 bg-white z-40 p-4 shadow-lg search-bar"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default memo(Navbar);
