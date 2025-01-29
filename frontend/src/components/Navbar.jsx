import React, { useEffect, useState, useContext } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { assets } from "../assets/assets"
import { ShopContext } from "../context/ShopContext"
import { Search, User, ShoppingBag, Menu, X } from "lucide-react"

const NavbarLink = ({ to, children }) => (
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
            transition={{ duration: 0.3 }}
        />
    </NavLink>
)

const DropdownItem = ({ onClick, color = "gray", children }) => (
    <motion.div
        whileHover={{ backgroundColor: color === "red" ? "#FEE2E2" : "#F3F4F6" }}
        onClick={onClick}
        className={`px-4 py-3 text-sm ${color === "red" ? "text-red-600" : "text-gray-700"
            } cursor-pointer transition-colors duration-200`}
    >
        {children}
    </motion.div>
)

const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const [user, setUser] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const { setShowSearch, getCartCount, token, setToken, setCartItems, backendUrl } = useContext(ShopContext)

    const navigate = useNavigate()

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/collection", label: "Collection" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
    ]

    const dropdownOptions = [
        { label: "My Profile", path: "/profile" },
        { label: "Orders", path: "/order" },
    ]

    const logout = () => {
        localStorage.removeItem("token")
        setToken("")
        setCartItems([])
        setShowDropdown(false)
        navigate("/login")
    }

    const handleProfileClick = () => {
        if (token) {
            setShowDropdown(!showDropdown)
        } else {
            navigate("/login")
        }
    }

    const fetchUserDetails = async (authToken) => {
        if (!authToken) return
        try {
            const response = await fetch(`${backendUrl}/api/user/user`, {
                headers: { token: authToken },
            })
            const result = await response.json()
            if (result.success) {
                setUser(result.user)
            } else {
                console.error("Error fetching user details:", result.message)
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    useEffect(() => {
        if (token) {
            fetchUserDetails(token)
        } else {
            setUser(null)
            setShowDropdown(false)
        }
    }, [token, backendUrl]) // Added backendUrl to dependencies

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".profile-icon")) {
                setShowDropdown(false)
            }
        }
        if (showDropdown) {
            document.addEventListener("click", handleClickOutside)
        } else {
            document.removeEventListener("click", handleClickOutside)
        }
        return () => document.removeEventListener("click", handleClickOutside)
    }, [showDropdown])

    const animationVariants = {
        dropdown: {
            hidden: { opacity: 0, y: -10, scale: 0.95 },
            visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.2 },
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
                transition: { type: "tween", duration: 0.3 },
            },
            exit: {
                x: "100%",
                transition: { type: "tween", duration: 0.3 },
            },
        },
    }

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ${scrolled ? "shadow-lg py-2" : "py-4"
                }`}
            initial={false}
            animate={{ y: scrolled ? -10 : 0 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <motion.div
                            className="w-10 h-10 bg-black rounded-lg flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <span className="text-white font-bold text-xl">ZF</span>
                        </motion.div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-lg font-bold text-gray-900">ZERO</span>
                            <span className="text-sm font-medium text-gray-900">FASHION</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {navLinks.map(({ path, label }) => (
                            <NavbarLink key={path} to={path}>
                                {label}
                            </NavbarLink>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        <motion.button
                            onClick={() => setShowSearch(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <Search size={20} />
                        </motion.button>

                        <div className="relative profile-icon">
                            <motion.button
                                onClick={handleProfileClick}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            >
                                <User size={20} />
                            </motion.button>
                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        variants={animationVariants.dropdown}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-lg overflow-hidden"
                                    >
                                        {dropdownOptions.map(({ label, path }) => (
                                            <DropdownItem
                                                key={path}
                                                onClick={() => {
                                                    navigate(path)
                                                    setShowDropdown(false)
                                                }}
                                            >
                                                {label}
                                            </DropdownItem>
                                        ))}
                                        <hr className="my-2 border-gray-200" />
                                        <DropdownItem onClick={logout} color="red">
                                            Logout
                                        </DropdownItem>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link to="/cart" className="relative">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                            >
                                <ShoppingBag size={20} />
                                <motion.span
                                    className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                    {getCartCount()}
                                </motion.span>
                            </motion.div>
                        </Link>

                        <motion.button
                            onClick={() => setVisible(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="sm:hidden text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                        >
                            <Menu size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        variants={animationVariants.mobileMenu}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-white z-50 sm:hidden"
                    >
                        <div className="flex flex-col h-full p-6">
                            <div className="flex justify-end">
                                <motion.button
                                    onClick={() => setVisible(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                >
                                    <X size={24} />
                                </motion.button>
                            </div>
                            <div className="flex flex-col space-y-4 mt-8">
                                {navLinks.map(({ path, label }) => (
                                    <NavLink
                                        key={path}
                                        to={path}
                                        className={({ isActive }) =>
                                            `text-2xl font-medium ${isActive ? "text-indigo-600" : "text-gray-800 hover:text-indigo-600"
                                            } transition-colors duration-200`
                                        }
                                        onClick={() => setVisible(false)}
                                    >
                                        {label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar
