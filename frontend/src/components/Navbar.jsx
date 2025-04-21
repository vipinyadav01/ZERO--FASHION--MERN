"use client"

import { useState, useEffect, useContext, useCallback, memo } from "react"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  User,
  ShoppingBag,
  Home,
  Play,
  Grid,
  ListOrdered,
  UserCircle,
  Contact,
  Bell,
  Headset,
  LogOut,
  ChevronRight,
  Camera,
  X,
} from "lucide-react"
import PropTypes from "prop-types"
import { ShopContext } from "../context/ShopContext"

const animations = {
  dropdown: {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  },
}

const NavbarLink = memo(({ to, children }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? "text-black" : "text-gray-500 hover:text-black"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative z-10">{children}</span>
          <motion.span
            className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: isActive ? 1 : 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </>
      )}
    </NavLink>
  )
})

NavbarLink.displayName = "NavbarLink"
NavbarLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const SearchBar = ({ setShowSearchBar }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
      setShowSearchBar(false)
    }
  }

  return (
    <div className="bg-white p-5 shadow-lg rounded-xl border border-gray-100">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Products"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-800 placeholder-gray-500 bg-gray-50 hover:bg-white transition-colors duration-200"
            autoFocus
          />
        </div>
        <button
          type="button"
          className="ml-2 p-3 text-gray-500 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
        >
          <Camera className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

SearchBar.propTypes = {
  setShowSearchBar: PropTypes.func.isRequired,
}

const CartItem = memo(({ item }) => {
  return (
    <motion.div
      className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
      variants={animations.slideUp}
      initial="hidden"
      animate="visible"
    >
      <div className="w-14 h-14 bg-gray-100 rounded-md mr-3 overflow-hidden">
        {item.image && (
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name || "Product"}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.name || "Product"}</p>
        <p className="text-xs text-gray-600">Qty: {item.quantity || 1}</p>
      </div>
      <p className="text-sm font-medium text-black whitespace-nowrap">${item.price?.toFixed(2) || "0.00"}</p>
    </motion.div>
  )
})

CartItem.displayName = "CartItem"
CartItem.propTypes = {
  item: PropTypes.object.isRequired,
}

// Keep BottomNavigation intact as per requirements
const BottomNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useContext(ShopContext)

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Play, label: "Collection", path: "/collection" },
    { icon: Grid, label: "Wishlist", path: "/wishlist" },
    { icon: Headset, label: "Support", path: token ? "/support" : "/login" },
    { icon: ListOrdered, label: "Order", path: token ? "/order" : "/login" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 md:hidden">
      <div className="flex justify-around py-2 bg-gray-50">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative flex flex-col items-center justify-center p-2 ${location.pathname === item.path ? "text-black" : "text-gray-600 hover:text-black"
              }`}
            whileTap={{ scale: 0.9 }}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  const { token, setToken, setShowSearch, getCartCount, setCartItems, cartItems, setUser, backendUrl } = useContext(
    ShopContext,
  ) || {
    token: null,
    setToken: () => { },
    setShowSearch: () => { },
    getCartCount: () => 0,
    setCartItems: () => { },
    cartItems: [],
    setUser: () => { },
    backendUrl: "",
  }

  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/collection", label: "Collection" },
    { path: "/wishlist", label: "Wishlist" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ]

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error("Invalid token format", e)
      return null
    }
  }

  const fetchUserData = async (token) => {
    try {
      const res = await fetch(`${backendUrl}/api/user/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const fetchedUserData = await res.json()
      const userData = fetchedUserData?.user || {
        username: "User",
        email: "user@example.com",
        avatar: null,
      }
      const finalUserData = {
        ...userData,
        username: userData.username || userData.name || "User",
        name: userData.username || userData.name || "User",
      }

      localStorage.setItem("userData", JSON.stringify(finalUserData))
      setUserInfo(finalUserData)
      setUser?.(finalUserData)

      return finalUserData
    } catch (error) {
      console.error("Error fetching user data:", error)
      return null
    }
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiry")
    localStorage.removeItem("userData")
    setToken(null)
    setUserInfo(null)
    setUser?.(null)
    setCartItems([])
    setShowUserDropdown(false)
    navigate("/login")
  }, [navigate, setToken, setCartItems, setUser])

  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        const decodedToken = decodeToken(storedToken)
        if (decodedToken) {
          const currentTime = Math.floor(Date.now() / 1000)
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            handleLogout()
            return
          }
          setToken(storedToken)
          const storedUserData = localStorage.getItem("userData")
          if (storedUserData) {
            try {
              const parsedUserData = JSON.parse(storedUserData)
              const updatedUserData = {
                ...parsedUserData,
                name: parsedUserData.username || parsedUserData.name || "User",
              }
              setUserInfo(updatedUserData)
              setUser?.(updatedUserData)
            } catch (error) {
              console.error("Error parsing user data:", error)
              await fetchUserData(storedToken)
            }
          } else {
            await fetchUserData(storedToken)
          }
        } else {
          handleLogout()
        }
      }
    }
    checkTokenValidity()
  }, [setToken, setUser, handleLogout])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.querySelector("nav")
      const searchBar = document.querySelector(".search-bar")
      const userDropdown = document.querySelector(".user-dropdown")
      const cartDropdown = document.querySelector(".cart-dropdown")
      if (
        navbar &&
        (!searchBar || !searchBar.contains(event.target)) &&
        (!userDropdown || !userDropdown.contains(event.target)) &&
        (!cartDropdown || !cartDropdown.contains(event.target)) &&
        !navbar.contains(event.target)
      ) {
        setShowUserDropdown(false)
        setShowCartDropdown(false)
        setShowSearchBar(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (setShowSearch) {
      setShowSearch(location.pathname.includes("/search"))
      return () => setShowSearch(false)
    }
  }, [location.pathname, setShowSearch])

  const handleUserIconClick = () => {
    if (token) {
      setShowUserDropdown((prev) => !prev)
    } else {
      navigate("/login")
    }
  }

  const handleCartIconClick = () => {
    if (token) {
      setShowCartDropdown((prev) => !prev)
    } else {
      navigate("/login")
    }
  }

  const isAuthenticated = () => !!token && !!userInfo

  return (
    <>
      {/* Mobile Header - */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">ZF</span>
            </div>
            <span className="text-lg font-bold text-black">ZFashion</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div
              className="relative flex items-center bg-gray-100 rounded-full px-3 py-2 w-40 border border-gray-200"
              onClick={() => setShowSearchBar(true)}
            >
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search for Products"
                className="bg-transparent text-sm outline-none placeholder-gray-500 text-gray-800 w-full"
                readOnly
              />
            </div>
            <div className="relative">
              <Link to={isAuthenticated() ? "/cart" : "/login"} className="relative">
                <ShoppingBag className="w-6 h-6 text-black" />
                {isAuthenticated() && getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-around py-2 bg-gray-100 text-gray-700">
          <Link
            to={isAuthenticated() ? "/profile" : "/login"}
            className="flex flex-col items-center border border-black px-3 py-2 rounded-md hover:text-black transition-colors"
          >
            <UserCircle className="w-5 h-5 text-black" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          <Link
            to={isAuthenticated() ? "/notifications" : "/login"}
            className="flex flex-col items-center border border-black px-3 py-2 rounded-md hover:text-black transition-colors"
          >
            <Bell className="w-5 h-5 text-black" />
            <span className="text-xs mt-1">Notification</span>
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center border border-black px-3 py-2 rounded-md hover:text-black transition-colors"
          >
            <Contact className="w-5 h-5 text-black" />
            <span className="text-xs mt-1">Contact</span>
          </Link>
        </div>

        <div className="flex items-center px-4 py-2 bg-white text-gray-700 border-t border-gray-200">
          <Home className="w-4 h-4 text-black mr-2" />
          <span className="text-sm font-medium truncate">GLA UNIVERSITY MATHURA, MAIN CAN...</span>
          <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
        </div>
      </div>

      {showSearchBar && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-50 md:hidden">
          <div className="bg-white p-4 rounded-b-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-black">Search Products</h3>
              <button onClick={() => setShowSearchBar(false)} className="text-gray-600 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SearchBar setShowSearchBar={setShowSearchBar} />
          </div>
        </div>
      )}

      <div className="h-40 md:hidden"></div>

      {/* Desktop Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-500 ${scrolled ? "shadow-xl py-2" : "py-5"
          } hidden md:block`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <motion.span
                  className="text-white font-bold text-xl"
                  initial={{ opacity: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  ZF
                </motion.span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-black tracking-wider">ZERO</span>
                <span className="text-xs font-medium text-gray-600 tracking-widest">FASHION</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(({ path, label }) => (
                <NavbarLink key={path} to={path}>
                  {label}
                </NavbarLink>
              ))}
            </div>
            <div className="flex items-center space-x-6">
              <motion.button
                onClick={() => setShowSearchBar(!showSearchBar)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-black hover:text-gray-800 transition-colors duration-300 relative"
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
              </motion.button>
              <div className="relative user-dropdown">
                <motion.button
                  onClick={handleUserIconClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-black hover:text-gray-800 transition-colors duration-300"
                  aria-label="User profile"
                  aria-expanded={showUserDropdown}
                >
                  <User className="w-6 h-6" />
                </motion.button>
                <AnimatePresence>
                  {showUserDropdown && isAuthenticated() && (
                    <motion.div
                      variants={animations.dropdown}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-4 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">
                          {userInfo?.username || userInfo?.name || "My Account"}
                        </p>
                        {userInfo?.email && <p className="text-xs text-gray-600 mt-1 truncate">{userInfo.email}</p>}
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <UserCircle className="w-4 h-4 mr-3 text-black" />
                        My Profile
                      </Link>
                      <Link
                        to="/order"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <ListOrdered className="w-4 h-4 mr-3 text-black" />
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
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
                  className="text-black hover:text-gray-800 transition-colors duration-300 relative"
                  aria-label="Shopping cart"
                  aria-expanded={showCartDropdown}
                >
                  <ShoppingBag className="w-6 h-6" />
                  {isAuthenticated() && getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {showCartDropdown && isAuthenticated() && (
                    <motion.div
                      variants={animations.dropdown}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-medium text-gray-800">Your Cart ({getCartCount()} items)</p>
                      </div>
                      {cartItems && cartItems.length > 0 ? (
                        <div className="max-h-72 overflow-y-auto">
                          {cartItems.slice(0, 3).map((item, index) => (
                            <CartItem key={index} item={item} />
                          ))}
                          {cartItems.length > 3 && (
                            <p className="text-xs text-center py-2 text-gray-600">
                              {cartItems.length - 3} more items in cart
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-600">Your cart is empty</p>
                        </div>
                      )}
                      <Link
                        to="/cart"
                        className="block px-4 py-3 text-sm text-center text-white bg-black hover:bg-gray-900 transition-colors duration-200"
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

      <AnimatePresence>
        {showSearchBar && (
          <motion.div
            className="fixed top-16 left-0 right-0 bg-white z-40 shadow-xl search-bar hidden md:block"
            variants={animations.dropdown}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="max-w-2xl mx-auto py-4 px-6">
              <SearchBar setShowSearchBar={setShowSearchBar} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation />
    </>
  )
}

export default memo(Navbar)