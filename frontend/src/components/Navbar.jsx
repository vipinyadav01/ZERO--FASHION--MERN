import React, { useEffect, useState, useContext, useCallback, memo } from "react"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Search, User, ShoppingBag, Menu, X, Bell, Heart } from "lucide-react"
import { ShopContext } from "../context/ShopContext"

// Extracted animation variants
const animations = {
    dropdown: {
        hidden: { opacity: 0, y: -10, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 30 }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    },
    mobileMenu: {
        hidden: { x: "100%" },
        visible: {
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: {
            x: "100%",
            transition: { duration: 0.3 }
        }
    },
    logoHover: {
        rest: { scale: 1 },
        hover: { scale: 1.05, transition: { duration: 0.2 } }
    }
}

// Memoized NavbarLink component
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
))

// Memoized DropdownItem component
const DropdownItem = memo(({ onClick, color = "gray", children, icon: Icon }) => (
    <motion.div
        whileHover={{ backgroundColor: color === "red" ? "#FEE2E2" : "#F3F4F6" }}
        onClick={onClick}
        className={`px-4 py-3 text-sm ${color === "red" ? "text-red-600" : "text-gray-700"
            } cursor-pointer transition-colors duration-200 flex items-center gap-2`}
    >
        {Icon && <Icon size={16} />}
        {children}
    </motion.div>
))

const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const [user, setUser] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [showNotifications, setShowNotifications] = useState(false)
    const [wishlistCount, setWishlistCount] = useState(0)

    const {
        setShowSearch,
        getCartCount,
        token,
        setToken,
        setCartItems,
        backendUrl
    } = useContext(ShopContext)

    const navigate = useNavigate()
    const location = useLocation()

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/collection", label: "Collection" },
        { path: "/wishlist", label: "Wishlist" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" }
    ]

    const dropdownOptions = [
        { label: "My Profile", path: "/profile", icon: User },
        { label: "Orders", path: "/order", icon: ShoppingBag },
        { label: "Wishlist", path: "/wishlist", icon: Heart },
        { label: "Notifications", path: "/notifications", icon: Bell }
    ]

    // Memoized handlers
    const logout = useCallback(() => {
        localStorage.removeItem("token")
        setToken("")
        setCartItems([])
        setShowDropdown(false)
        navigate("/login")
    }, [setToken, setCartItems, navigate])

    const handleProfileClick = useCallback(() => {
        if (token) {
            setShowDropdown(!showDropdown)
        } else {
            navigate("/login")
        }
    }, [token, showDropdown, navigate])

    // Enhanced user details fetch with error handling
    const fetchUserDetails = useCallback(async (authToken) => {
        if (!authToken) return
        try {
            const response = await fetch(`${backendUrl}/api/user/user`, {
                headers: {
                    token: authToken,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            if (result.success) {
                setUser(result.user)
                setWishlistCount(result.user.wishlist?.length || 0)
            }
        } catch (error) {
            console.error("Error fetching user details:", error)
            // Implement proper error handling here
        }
    }, [backendUrl])

    // Scroll handler with throttling
    useEffect(() => {
        let ticking = false
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 20)
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".profile-icon")) {
                setShowDropdown(false)
            }
            if (!event.target.closest(".notifications-icon")) {
                setShowNotifications(false)
            }
        }

        if (showDropdown || showNotifications) {
            document.addEventListener("click", handleClickOutside)
        }

        return () => document.removeEventListener("click", handleClickOutside)
    }, [showDropdown, showNotifications])

    // Fetch user data on token change
    useEffect(() => {
        if (token) {
            fetchUserDetails(token)
        } else {
            setUser(null)
            setShowDropdown(false)
        }
    }, [token, fetchUserDetails])

    // Close mobile menu on route change
    useEffect(() => {
        setVisible(false)
    }, [location.pathname])

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ${scrolled ? "shadow-lg py-2" : "py-4"
                }`}
            initial={false}
            animate={{ y: scrolled ? -10 : 0 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo with enhanced animation */}
                    <Link to="/" className="flex items-center space-x-3">
                        <motion.div
                            className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center"
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
                            <span className="text-sm font-medium text-gray-900">
                                FASHION
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation with enhanced styling */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {navLinks.map(({ path, label }) => (
                            <NavbarLink key={path} to={path}>
                                {label}
                            </NavbarLink>
                        ))}
                    </div>

                    {/* Enhanced Right Icons Section */}
                    <div className="flex items-center space-x-4">
                        <motion.button
                            onClick={() => setShowSearch(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </motion.button>

                        {/* Notifications Icon */}
                        <div className="relative notifications-icon">
                            <motion.button
                                onClick={() => setShowNotifications(!showNotifications)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                aria-label="Notifications"
                            >
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <motion.span
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                        {notifications.length}
                                    </motion.span>
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        variants={animations.dropdown}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg overflow-hidden"
                                    >
                                        {notifications.length > 0 ? (
                                            notifications.map((notification, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 border-b border-gray-100 hover:bg-gray-50"
                                                >
                                                    {notification.message}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-gray-500">
                                                No new notifications
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Enhanced Profile Section */}
                        <div className="relative profile-icon">
                            <motion.button
                                onClick={handleProfileClick}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                aria-label="User profile"
                            >
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt="Profile"
                                        className="w-6 h-6 rounded-full"
                                    />
                                ) : (
                                    <User size={20} />
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        variants={animations.dropdown}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg overflow-hidden"
                                    >
                                        {user && (
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        )}

                                        {dropdownOptions.map(({ label, path, icon }) => (
                                            <DropdownItem
                                                key={path}
                                                onClick={() => {
                                                    navigate(path)
                                                    setShowDropdown(false)
                                                }}
                                                icon={icon}
                                            >
                                                {label}
                                            </DropdownItem>
                                        ))}

                                        <hr className="my-2 border-gray-200" />
                                        <DropdownItem onClick={logout} color="red" icon={X}>
                                            Logout
                                        </DropdownItem>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Enhanced Cart Icon */}
                        <Link to="/cart" className="relative">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            >
                                <ShoppingBag size={20} />
                                {getCartCount() > 0 && (
                                    <motion.span
                                        className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                        {getCartCount()}
                                    </motion.span>
                                )}
                            </motion.div>
                        </Link>

                        {/* Mobile Menu Button */}
                        <motion.button
                            onClick={() => setVisible(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="sm:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            aria-label="Menu"
                        >
                            <Menu size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Enhanced Mobile Menu with Date/Time and User Info */}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        variants={animations.mobileMenu}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-white z-50 sm:hidden"
                    >
                        <div className="flex flex-col h-full p-6">
                            {/* Mobile Menu Header */}
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">
                                        {new Date().toLocaleString('en-US', {
                                            timeZone: 'UTC',
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: false
                                        })} UTC
                                    </span>
                                    {user && (
                                        <span className="text-sm font-medium text-indigo-600">
                                            @{user.username || 'Guest'}
                                        </span>
                                    )}
                                </div>
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

                            {/* Mobile Menu User Profile Section */}
                            {user && (
                                <div className="mt-6 pb-6 border-b border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <User size={24} className="text-indigo-600" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {user.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile Menu Navigation Links */}
                            <div className="flex flex-col space-y-4 mt-6">
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

                            {/* Mobile Menu Quick Actions */}
                            <div className="mt-auto">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-indigo-50 p-4 rounded-lg"
                                    >
                                        <div className="text-center">
                                            <ShoppingBag className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                                Cart Items: {getCartCount()}
                                            </span>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-indigo-50 p-4 rounded-lg"
                                    >
                                        <div className="text-center">
                                            <Heart className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                                            <span className="text-sm font-medium text-gray-900">
                                                Wishlist: {wishlistCount}
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Mobile Menu Footer Actions */}
                                {token ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={logout}
                                        className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-center space-x-2"
                                    >
                                        <X size={18} />
                                        <span>Logout</span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setVisible(false)
                                            navigate('/login')
                                        }}
                                        className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center space-x-2"
                                    >
                                        <User size={18} />
                                        <span>Login</span>
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default memo(Navbar)
