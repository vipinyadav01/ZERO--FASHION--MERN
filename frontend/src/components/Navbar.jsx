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
  LogOut,
  Camera,
  Heart,
  Info,
  Phone,
} from "lucide-react"
import PropTypes from "prop-types"
import { ShopContext } from "../context/ShopContext"
import SearchBar from "./SearchBar"

const animations = {
  dropdown: {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  },
  dock: {
    hidden: { y: 100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
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

const DockSearchBar = ({ setShowSearchBar }) => {
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
    <div className="bg-white/95 backdrop-blur-xl p-6 shadow-2xl rounded-2xl border border-stone-200/50">
      <form onSubmit={handleSearch} className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Products"
            className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-stone-100 focus:border-stone-400 text-stone-800 placeholder-stone-500 bg-stone-50/50 hover:bg-white transition-all duration-300 font-outfit"
            autoFocus
          />
        </div>
        <button
          type="button"
          className="ml-3 p-4 text-stone-500 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all duration-200 border border-stone-200"
        >
          <Camera className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

DockSearchBar.propTypes = {
  setShowSearchBar: PropTypes.func.isRequired,
}

const CartItem = memo(({ item }) => {
  return (
    <motion.div
      className="flex items-center p-4 border-b border-stone-100/80 hover:bg-stone-50/50 transition-colors duration-200 group"
      variants={animations.slideUp}
      initial="hidden"
      animate="visible"
    >
      <div className="w-16 h-16 bg-stone-100 rounded-xl mr-4 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name || "Product"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = "/placeholder.svg"
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-800 truncate font-outfit">{item.name || "Product"}</p>
        <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
          <span className="bg-stone-100 px-2 py-1 rounded-md font-medium">Size: {item.size}</span>
          <span className="bg-stone-100 px-2 py-1 rounded-md font-medium">Qty: {item.quantity || 1}</span>
        </div>
      </div>
      <p className="text-sm font-bold text-stone-900 whitespace-nowrap ml-3">₹{item.price?.toFixed(2) || "0.00"}</p>
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
    { icon: ListOrdered, label: "Order", path: token ? "/order" : "/login" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 md:hidden border-t border-stone-200">
      <div className="flex justify-around py-3 bg-stone-50">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
              location.pathname === item.path 
                ? "text-white bg-gradient-to-br from-stone-800 to-stone-900 shadow-lg" 
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs mt-1 font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Desktop Floating Dock Component
const FloatingDock = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  const { token, setToken, getCartCount, setCartItems, cartItems, setUser, backendUrl, setShowSearch, products, getCartAmount } = useContext(
    ShopContext,
  ) || {
    token: null,
    setToken: () => { },
    getCartCount: () => 0,
    setCartItems: () => { },
    cartItems: {},
    setUser: () => { },
    backendUrl: "",
    setShowSearch: () => { },
    products: [],
    getCartAmount: () => 0,
  }

  const navigate = useNavigate()
  const location = useLocation()

  const dockItems = [
    { icon: Home, label: "Home", path: "/", type: "nav" },
    { icon: Play, label: "Collection", path: "/collection", type: "nav" },
    { icon: Heart, label: "Wishlist", path: "/wishlist", type: "nav" },
    { icon: Info, label: "About", path: "/about", type: "nav" },
    { icon: Phone, label: "Contact", path: "/contact", type: "nav" },
    { icon: Search, label: "Search", path: "/search", type: "action", action: () => setShowSearch(true) },
    { icon: User, label: "Profile", path: "/profile", type: "user" },
    { icon: ShoppingBag, label: "Cart", path: "/cart", type: "cart" },
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

  const fetchUserData = useCallback(async (token) => {
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
  }, [backendUrl, setUser])

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
  }, [setToken, setUser, handleLogout, fetchUserData])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dock-container')) {
        setShowUserDropdown(false)
        setShowCartDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleItemClick = (item) => {
    if (item.type === "action" && item.action) {
      item.action()
    } else if (item.type === "user") {
      if (token) {
        setShowUserDropdown((prev) => !prev)
      } else {
        navigate("/login")
      }
    } else if (item.type === "cart") {
      if (getCartCount() > 0) {
        setShowCartDropdown((prev) => !prev)
      } else {
        navigate("/cart")
      }
    } else {
      navigate(item.path)
    }
  }

  const isAuthenticated = () => !!token && !!userInfo

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  // Get enriched cart items with product details
  const getCartItemsForDisplay = () => {
    if (!cartItems || !products || Object.keys(cartItems).length === 0) {
      return []
    }

    const cartItemsArray = []
    
    for (const itemId in cartItems) {
      const product = products.find(p => p._id === itemId)
      if (product) {
        const sizes = cartItems[itemId]
        for (const size in sizes) {
          const quantity = sizes[size]
          if (quantity > 0) {
            cartItemsArray.push({
              _id: itemId,
              name: product.name,
              price: product.price,
              image: product.image?.[0] || '/placeholder.svg',
              size: size,
              quantity: quantity
            })
          }
        }
      }
    }
    
    return cartItemsArray
  }

  return (
    <div className="dock-container hidden md:block">
      {/* Floating Dock with Integrated Logo */}
      <motion.div
        className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[60]"
        variants={animations.dock}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl px-6 py-4">
          <div className="flex items-center space-x-6">
            {/* Brand Logo and Name */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 rounded-2xl flex items-center justify-center shadow-xl border border-stone-200/20 group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <motion.span
                  className="text-white font-bold text-lg font-outfit"
                  whileHover={{ scale: 1.1 }}
                >
                  ZF
                </motion.span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-stone-900 tracking-wider font-outfit">ZERO</span>
                <span className="text-xs font-medium text-stone-600 tracking-widest">FASHION</span>
              </div>
            </Link>
            
            {/* Separator */}
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-stone-300 to-transparent"></div>
            
            {/* Navigation Icons */}
            <div className="flex items-center space-x-2">
              {dockItems.map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => handleItemClick(item)}
                  className={`relative group p-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path) 
                      ? "bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 text-white shadow-lg" 
                      : "bg-stone-50 text-stone-700 hover:bg-stone-100 hover:text-stone-900 border border-stone-200"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5" />
                  
                  {/* Badge for cart count */}
                  {item.type === "cart" && getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold shadow-lg border-2 border-white">
                      {getCartCount()}
                    </span>
                  )}

                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-3 py-1.5 bg-stone-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-xl font-medium">
                    {item.label}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45"></div>
                  </div>

                  {/* Active indicator */}
                  {isActive(item.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-amber-100 rounded-full shadow-sm"
                      layoutId="activeIndicator"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

         {/* User Dropdown */}
         <AnimatePresence>
           {showUserDropdown && isAuthenticated() && (
             <motion.div
               variants={animations.dropdown}
               initial="hidden"
               animate="visible"
               exit="exit"
               className="absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-[70]"
             >
              <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
                <p className="text-sm font-semibold text-stone-900 font-outfit">
                  {userInfo?.username || userInfo?.name || "My Account"}
                </p>
                {userInfo?.email && <p className="text-xs text-stone-600 mt-1 truncate">{userInfo.email}</p>}
              </div>
              <Link
                to="/profile"
                className="flex items-center px-6 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors duration-200 group"
                onClick={() => setShowUserDropdown(false)}
              >
                <UserCircle className="w-4 h-4 mr-3 text-stone-600 group-hover:text-stone-800" />
                <span className="font-medium">My Profile</span>
              </Link>
              <Link
                to="/order"
                className="flex items-center px-6 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors duration-200 group"
                onClick={() => setShowUserDropdown(false)}
              >
                <ListOrdered className="w-4 h-4 mr-3 text-stone-600 group-hover:text-stone-800" />
                <span className="font-medium">Orders</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group border-t border-stone-100"
              >
                <LogOut className="w-4 h-4 mr-3 group-hover:text-red-700" />
                <span className="font-medium">Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

         {/* Cart Dropdown */}
         <AnimatePresence>
           {showCartDropdown && (
             <motion.div
               variants={animations.dropdown}
               initial="hidden"
               animate="visible"
               exit="exit"
               className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-[70]"
             >
              <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-stone-900 font-outfit">Your Cart ({getCartCount()} items)</p>
                  <p className="text-sm font-bold text-stone-900">₹{getCartAmount()}</p>
                </div>
              </div>
              {(() => {
                const displayItems = getCartItemsForDisplay()
                return displayItems.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {displayItems.slice(0, 3).map((item) => (
                      <CartItem key={`${item._id}-${item.size}`} item={item} />
                    ))}
                    {displayItems.length > 3 && (
                      <p className="text-xs text-center py-3 text-stone-600 bg-stone-50 font-medium">
                        {displayItems.length - 3} more items in cart
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <p className="text-stone-600 mb-4 font-medium">Your cart is empty</p>
                    <button
                      onClick={() => {
                        setShowCartDropdown(false)
                        navigate("/collection")
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-stone-800 via-stone-900 to-stone-950 text-white rounded-xl text-sm font-semibold hover:from-stone-900 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Start Shopping
                    </button>
                  </div>
                )
              })()}
              <Link
                to="/cart"
                className="block px-6 py-4 text-sm text-center text-white bg-gradient-to-r from-stone-800 via-stone-900 to-stone-950 hover:from-stone-900 hover:to-black transition-all duration-300 font-semibold"
                onClick={() => setShowCartDropdown(false)}
              >
                View Full Cart
              </Link>
            </motion.div>
          )}
        </AnimatePresence>


      </motion.div>
    </div>
  )
}

const Navbar = () => {
  const { token, setShowSearch, getCartCount } = useContext(
    ShopContext,
  ) || {
    token: null,
    setShowSearch: () => { },
    getCartCount: () => 0,
  }

  const isAuthenticated = () => !!token

  return (
    <>
      {/* Unified SearchBar for all devices */}
      <SearchBar />
      
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 md:hidden border-b border-stone-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-sm font-outfit">ZF</span>
            </div>
            <span className="text-lg font-bold text-stone-900 font-outfit">ZFashion</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div
              className="relative flex items-center bg-stone-50 rounded-xl px-3 py-2 w-36 border border-stone-200"
              onClick={() => setShowSearch(true)}
            >
              <Search className="w-4 h-4 text-stone-500 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none placeholder-stone-500 text-stone-800 w-full font-outfit"
                readOnly
              />
            </div>
            <div className="relative">
              <Link to="/cart" className="relative p-2 bg-stone-50 rounded-xl border border-stone-200 hover:bg-stone-100 transition-all duration-200">
                <ShoppingBag className="w-5 h-5 text-stone-700" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border-2 border-white shadow-md">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-around py-3 bg-stone-50 border-t border-stone-100">
          <Link
            to={isAuthenticated() ? "/profile" : "/login"}
            className="flex flex-col items-center border border-stone-200 bg-white px-4 py-2 rounded-xl hover:bg-stone-50 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <UserCircle className="w-5 h-5 text-stone-700 group-hover:text-stone-900" />
            <span className="text-xs mt-1 font-medium text-stone-700 group-hover:text-stone-900">Profile</span>
          </Link>
          <Link
            to={isAuthenticated() ? "/notifications" : "/login"}
            className="flex flex-col items-center border border-stone-200 bg-white px-4 py-2 rounded-xl hover:bg-stone-50 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <Bell className="w-5 h-5 text-stone-700 group-hover:text-stone-900" />
            <span className="text-xs mt-1 font-medium text-stone-700 group-hover:text-stone-900">Notification</span>
          </Link>
          <Link
            to="/contact"
            className="flex flex-col items-center border border-stone-200 bg-white px-4 py-2 rounded-xl hover:bg-stone-50 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <Contact className="w-5 h-5 text-stone-700 group-hover:text-stone-900" />
            <span className="text-xs mt-1 font-medium text-stone-700 group-hover:text-stone-900">Contact</span>
          </Link>
        </div>
      </div>



      <div className="h-44 md:hidden"></div>

      {/* Desktop Floating Dock */}
      <FloatingDock />

      <BottomNavigation />
    </>
  )
}

export default memo(Navbar)
