import { useState, useEffect, useContext, useCallback, memo } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";

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
        `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
          isActive ? "text-teal-700" : "text-gray-700 hover:text-teal-600"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative z-10">{children}</span>
          <motion.span
            className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-700 rounded-full"
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

NavbarLink.displayName = "NavbarLink";
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
    <div className="bg-white p-4 shadow-md rounded-b-lg">
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for Products"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-800 placeholder-gray-500"
          autoFocus
        />
        <button
          type="submit"
          className="bg-teal-700 text-white px-5 py-2.5 rounded-r-lg hover:bg-teal-800 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  setShowSearchBar: PropTypes.func.isRequired,
};

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(ShopContext);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Play, label: "Collection", path: "/collection" },
    { icon: Grid, label: "Wishlist", path: "/wishlist" },
    { icon: Headset, label: "Support", path: token ? "/support" : "/login" },
    { icon: ListOrdered, label: "Order", path: token ? "/order" : "/login" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 md:hidden">
      <div className="flex justify-around py-2 bg-cyan-50">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`relative flex flex-col items-center justify-center p-2 ${
              location.pathname === item.path ? "text-teal-700" : "text-gray-600 hover:text-teal-600"
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
  const [userInfo, setUserInfo] = useState(null);

  const {
    token,
    setToken,
    setShowSearch,
    getCartCount,
    setCartItems,
    cartItems,
    setUser,
    backendUrl,
  } = useContext(ShopContext) || {
    token: null,
    setToken: () => {},
    setShowSearch: () => {},
    getCartCount: () => 0,
    setCartItems: () => {},
    cartItems: [],
    setUser: () => {},
    backendUrl: "",
  };

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/collection", label: "Collection" },
    { path: "/wishlist", label: "Wishlist" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Invalid token format", e);
      return null;
    }
  };

  const fetchUserData = async (token) => {
    try {
      const res = await fetch(`${backendUrl}/api/user/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const fetchedUserData = await res.json();
      const userData = fetchedUserData?.user || {
        username: "User",
        email: "user@example.com",
        avatar: null,
      };
      const finalUserData = {
        ...userData,
        username: userData.username || userData.name || "User",
        name: userData.username || userData.name || "User",
      };

      localStorage.setItem("userData", JSON.stringify(finalUserData));
      setUserInfo(finalUserData);
      setUser?.(finalUserData);

      return finalUserData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("userData");
    setToken(null);
    setUserInfo(null);
    setUser?.(null);
    setCartItems([]);
    setShowUserDropdown(false);
    navigate("/login");
  }, [navigate, setToken, setCartItems, setUser]);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const decodedToken = decodeToken(storedToken);
        if (decodedToken) {
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            handleLogout();
            return;
          }
          setToken(storedToken);
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            try {
              const parsedUserData = JSON.parse(storedUserData);
              const updatedUserData = {
                ...parsedUserData,
                name: parsedUserData.username || parsedUserData.name || "User",
              };
              setUserInfo(updatedUserData);
              setUser?.(updatedUserData);
            } catch (error) {
              console.error("Error parsing user data:", error);
              await fetchUserData(storedToken);
            }
          } else {
            await fetchUserData(storedToken);
          }
        } else {
          handleLogout();
        }
      }
    };
    checkTokenValidity();
  }, [setToken, setUser, handleLogout]);

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
        (!searchBar || !searchBar.contains(event.target)) &&
        (!userDropdown || !userDropdown.contains(event.target)) &&
        (!cartDropdown || !cartDropdown.contains(event.target)) &&
        !navbar.contains(event.target)
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
    if (setShowSearch) {
      setShowSearch(location.pathname.includes("/search"));
      return () => setShowSearch(false);
    }
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

  const isAuthenticated = () => !!token && !!userInfo;

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-cyan-50">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-700 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">ZF</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-teal-700 to-cyan-500 bg-clip-text text-transparent">
              ZFashion
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <div
              className="relative flex items-center bg-gray-100 rounded-full px-3 py-2 w-48 border border-gray-200"
              onClick={() => setShowSearchBar(true)}
            >
              <Search className="w-4 h-4 text-teal-700 mr-2" />
              <input
                type="text"
                placeholder="Search for Products"
                className="bg-transparent text-sm outline-none placeholder-gray-500 text-gray-800 w-full"
                readOnly
              />
            </div>
            <div className="relative">
              <Link to={isAuthenticated() ? "/cart" : "/login"} className="relative">
                <ShoppingBag className="w-6 h-6 text-teal-700" />
                {isAuthenticated() && getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-teal-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
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
            className="flex flex-col items-center hover:text-teal-600 transition-colors"
          >
            <UserCircle className="w-5 h-5 text-teal-700" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          <Link
            to={isAuthenticated() ? "/notifications" : "/login"}
            className="flex flex-col items-center hover:text-teal-600 transition-colors"
          >
            <Bell className="w-5 h-5 text-teal-700" />
            <span className="text-xs mt-1">Notification</span>
          </Link>
          <Link to="/contact" className="flex flex-col items-center hover:text-teal-600 transition-colors">
            <Contact className="w-5 h-5 text-teal-700" />
            <span className="text-xs mt-1">Contact</span>
          </Link>
        </div>
        <div className="flex items-center px-4 py-2 bg-white text-gray-700 border-t border-gray-200">
          <Home className="w-4 h-4 text-teal-700 mr-2" />
          <span className="text-sm font-medium truncate">GLA UNIVERSITY MATHURA, MAIN CAN...</span>
        </div>
      </div>

      {showSearchBar && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 z-50 md:hidden">
          <div className="bg-white p-4 rounded-b-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-teal-700">Search Products</h3>
              <button onClick={() => setShowSearchBar(false)} className="text-gray-600 hover:text-gray-800">
                ✕
              </button>
            </div>
            <SearchBar setShowSearchBar={setShowSearchBar} />
          </div>
        </div>
      )}

      <div className="h-28 md:hidden"></div>

      {/* Desktop Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 bg-white z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg py-2" : "py-4"
        } hidden md:block`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">ZF</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-teal-700 to-cyan-500 bg-clip-text text-transparent">
                  ZERO
                </span>
                <span className="text-xs font-medium text-gray-600">FASHION</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
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
                className="text-teal-700 hover:text-teal-800 transition-colors duration-200 relative group"
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
              </motion.button>
              <div className="relative user-dropdown">
                <motion.button
                  onClick={handleUserIconClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-teal-700 hover:text-teal-800 transition-colors duration-200"
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
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 bg-cyan-50">
                        <p className="text-sm font-medium text-gray-800">
                          {userInfo?.username || userInfo?.name || "My Account"}
                        </p>
                        {userInfo?.email && (
                          <p className="text-xs text-gray-600 mt-1 truncate">{userInfo.email}</p>
                        )}
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-100 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <UserCircle className="w-4 h-4 mr-2 text-teal-700" />
                        My Profile
                      </Link>
                      <Link
                        to="/order"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-100 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <ListOrdered className="w-4 h-4 mr-2 text-teal-700" />
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
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
                  className="text-teal-700 hover:text-teal-800 transition-colors duration-200 relative"
                  aria-label="Shopping cart"
                  aria-expanded={showCartDropdown}
                >
                  <ShoppingBag className="w-6 h-6" />
                  {isAuthenticated() && getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-teal-700 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
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
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 bg-cyan-50">
                        <p className="text-sm font-medium text-gray-800">
                          Your Cart ({getCartCount()} items)
                        </p>
                      </div>
                      {cartItems && cartItems.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto">
                          {cartItems.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex items-center p-3 border-b border-gray-200">
                              <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {item.name || "Product"}
                                </p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity || 1}</p>
                              </div>
                              <p className="text-sm font-medium text-teal-700">
                                ${item.price || "0.00"}
                              </p>
                            </div>
                          ))}
                          {cartItems.length > 2 && (
                            <p className="text-xs text-center py-2 text-gray-600">
                              {cartItems.length - 2} more items in cart
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-600">Your cart is empty</div>
                      )}
                      <Link
                        to="/cart"
                        className="block px-4 py-3 text-sm text-center text-white bg-teal-700 hover:bg-teal-800 transition-colors"
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
            className="fixed top-16 left-0 right-0 bg-white z-40 shadow-lg search-bar hidden md:block"
            variants={animations.dropdown}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="max-w-2xl mx-auto">
              <SearchBar setShowSearchBar={setShowSearchBar} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation />
    </>
  );
};

export default memo(Navbar);