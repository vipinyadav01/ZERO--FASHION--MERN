import { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  User, 
  ShoppingBag, 
  Home, 
  Play, 
  Heart, 
  UserCircle, 
  ListOrdered, 
  LogOut 
} from "lucide-react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import CartItem from "./CartItem";

//DesktopNavbar Component
const DesktopNavbar = ({ token, setShowSearch, getCartCount }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Get context with safe defaults
  const context = useContext(ShopContext);
  const {
    setToken = () => {},
    setCartItems = () => {},
    cartItems = {},
    setUser = () => {},
    backendUrl = "",
    products = [],
    getCartAmount = () => 0,
  } = context || {};

  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items configuration
  const navItems = useCallback(() => [
    {
      icon: Home,
      label: "Home",
      path: "/",
      type: "nav",
    },
    {
      icon: Play,
      label: "Collection",
      path: "/collection",
      type: "nav",
    },
    {
      icon: Heart,
      label: "Wishlist",
      path: "/wishlist",
      type: "nav",
    },
    {
      icon: Search,
      label: "Search",
      type: "action",
      action: () => {
        console.log("Search button clicked, setting showSearch to true");
        setShowSearch(true);
      },
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      type: "user",
    },
    {
      icon: ShoppingBag,
      label: "Cart",
      path: "/cart",
      type: "cart",
    },
  ], [setShowSearch]);

  // Decode JWT token safely
  const decodeToken = useCallback((token) => {
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
    } catch (error) {
      console.error("Invalid token format:", error);
      return null;
    }
  }, []);

  // Fetch user data from API
  const fetchUserData = useCallback(async (token) => {
    try {
      const response = await fetch(`${backendUrl}/api/user/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedUserData = await response.json();
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
  }, [backendUrl, setUser]);

  // Handle user logout
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

  // Check token validity and load user data
  useEffect(() => {
    const checkTokenValidity = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;

      const decodedToken = decodeToken(storedToken);
      if (!decodedToken) {
        handleLogout();
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        handleLogout();
        return;
      }

      setToken(storedToken);

      // Try to load user data from localStorage first
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
    };

    checkTokenValidity();
  }, [setToken, setUser, handleLogout, fetchUserData, decodeToken]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".navbar-container")) {
        setShowUserDropdown(false);
        setShowCartDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowUserDropdown, setShowCartDropdown]);

  // Handle navigation item clicks
  const handleItemClick = useCallback((item) => {
    if (item.type === "action" && item.action) {
      item.action();
    } else if (item.type === "user") {
      if (token) {
        setShowUserDropdown((prev) => !prev);
        setShowCartDropdown(false);
      } else {
        navigate("/login");
      }
    } else if (item.type === "cart") {
      const cartCount = getCartCount ? getCartCount() : 0;
      if (cartCount > 0) {
        setShowCartDropdown((prev) => !prev);
        setShowUserDropdown(false);
      } else {
        navigate("/cart");
      }
    } else {
      navigate(item.path);
      setShowUserDropdown(false);
      setShowCartDropdown(false);
    }
  }, [token, navigate, getCartCount]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => Boolean(token && userInfo), [token, userInfo]);

  // Check if path is active
  const isActive = useCallback((path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  // Get cart items for display
  const getCartItemsForDisplay = useCallback(() => {
    if (!cartItems || !products || Object.keys(cartItems).length === 0) {
      return [];
    }

    const cartItemsArray = [];
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        const sizes = cartItems[itemId];
        for (const size in sizes) {
          const quantity = sizes[size];
          if (quantity > 0) {
            cartItemsArray.push({
              _id: itemId,
              name: product.name,
              price: product.price,
              image: product.image?.[0] || "/placeholder.svg",
              size: size,
              quantity: quantity,
            });
          }
        }
      }
    }
    return cartItemsArray;
  }, [cartItems, products]);

  // Get cart count safely
  const cartCount = getCartCount ? getCartCount() : 0;

  return (
    <div className="navbar-container hidden lg:flex justify-center w-full">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <img
                  src="/apple-touch-icon.png"
                  alt="Zero Fashion"
                  className="w-6 h-6"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-black tracking-wide">
                  ZERO
                </span>
                <span className="text-xs text-gray-500 tracking-[0.2em] -mt-1">
                  FASHION
                </span>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center space-x-1">
              {navItems().map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className={`relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-black text-white"
                      : "text-gray-700 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                  
                  {/* Cart Badge */}
                  {item.type === "cart" && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Dropdown */}
        {showUserDropdown && isAuthenticated() && (
          <div className="absolute top-full right-6 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="font-semibold text-gray-900">
                {userInfo?.username || userInfo?.name || "My Account"}
              </p>
              {userInfo?.email && (
                <p className="text-sm text-gray-600 truncate">{userInfo.email}</p>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowUserDropdown(false)}
              >
                <UserCircle className="w-4 h-4 mr-3" />
                My Profile
              </Link>

              <Link
                to="/order"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowUserDropdown(false)}
              >
                <ListOrdered className="w-4 h-4 mr-3" />
                Orders
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Cart Dropdown */}
        {showCartDropdown && (
          <div className="absolute top-full right-6 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
            {/* Cart Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">
                  Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
                </p>
                <p className="font-bold text-black">
                  ₹{getCartAmount()}
                </p>
              </div>
            </div>

            {/* Cart Items */}
            {(() => {
              const displayItems = getCartItemsForDisplay();
              return displayItems.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {displayItems.slice(0, 3).map((item) => (
                    <CartItem 
                      key={`${item._id}-${item.size}`} 
                      item={item} 
                    />
                  ))}
                  {displayItems.length > 3 && (
                    <p className="text-xs text-center py-2 text-gray-500 bg-gray-50">
                      +{displayItems.length - 3} more {displayItems.length - 3 === 1 ? "item" : "items"}
                    </p>
                  )}
                  
                  {/* View Cart Button */}
                  <Link
                    to="/cart"
                    className="block w-full py-3 text-center text-white bg-black hover:bg-gray-800 transition-colors font-medium"
                    onClick={() => setShowCartDropdown(false)}
                  >
                    View Full Cart
                  </Link>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => {
                      setShowCartDropdown(false);
                      navigate("/collection");
                    }}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Start Shopping
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

DesktopNavbar.propTypes = {
  token: PropTypes.string,
  setShowSearch: PropTypes.func.isRequired,
  getCartCount: PropTypes.func.isRequired,
};

export default DesktopNavbar;