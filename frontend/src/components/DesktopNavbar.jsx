import { useState, useContext, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Search, 
  User, 
  ShoppingBag, 
  Home, 
  Grid3X3, 
  Heart, 
  UserCircle, 
  Package, 
  LogOut,
  ChevronDown,
  Bell
} from "lucide-react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import NotificationDropdown from "./NotificationDropdown";

const DesktopNavbar = ({ token, setShowSearch, getCartCount, isTablet = false }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  const context = useContext(ShopContext);
  const {
    setToken = () => {},
    setUser = () => {},
    user = null,
  } = context || {};

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch real notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoadingNotifications(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/user?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.notifications) {
          const formattedNotifications = data.notifications.map((notif) => {
            return {
              id: notif._id,
              type: notif.type,
              title: notif.title,
              message: notif.message,
              timestamp: notif.createdAt,
              isRead: notif.read,
            };
          });
          setNotifications(formattedNotifications);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [token]);

  // Utility functions - Define early so they can be used in effects
  const isAuthenticated = Boolean(token && user);
  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const cartCount = getCartCount ? getCartCount() : 0;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Navigation items
  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: Grid3X3,
      label: "Collection",
      path: "/collection",
    },
    {
      icon: Heart,
      label: "Wishlist",
      path: "/wishlist",
      authRequired: true,
    },
    {
      icon: Package,
      label: "About",
      path: "/about",
    },
  ];

  // Handle user logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("wishlistItems");
    
    setToken(null);
    setUser(null);
    setShowUserDropdown(false);
    navigate("/login");
  }, [navigate, setToken, setUser]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container') && !event.target.closest('.notification-container')) {
        setShowUserDropdown(false);
        setShowNotificationDropdown(false);
      }
    };

    if (showUserDropdown || showNotificationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown, showNotificationDropdown]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (showNotificationDropdown && isAuthenticated) {
      fetchNotifications();
    }
  }, [showNotificationDropdown, isAuthenticated, fetchNotifications]);



  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 sm:space-x-3 group hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center p-1">
              <img
                src={assets.logo || "/apple-touch-icon.png"}
                alt="Zero Fashion"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-brand-text-primary tracking-tight">
                ZERO
              </span>
              <span className="text-[10px] sm:text-xs text-brand-text-secondary tracking-widest -mt-1 uppercase">
                FASHION
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className={`hidden ${isTablet ? 'md:flex' : 'lg:flex'} items-center space-x-4 lg:space-x-8`}>
            {navItems.map((item) => {
              const ItemIcon = item.icon;
              const active = isActive(item.path);
              
              // Skip auth-required items for non-authenticated users
              if (item.authRequired && !isAuthenticated) {
                return null;
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 border-b-2 ${
                    active
                      ? "border-brand-accent text-brand-text-primary"
                      : "border-transparent text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-border"
                  }`}
                >
                  <ItemIcon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-1.5 sm:p-2 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface rounded-none transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Notifications Dropdown */}
            {isAuthenticated && (
              <div className="relative notification-container">
                <button
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="relative p-1.5 sm:p-2 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface rounded-none transition-all duration-200"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-brand-accent text-white rounded-full text-[10px] w-3.5 h-3.5 flex items-center justify-center font-semibold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Import NotificationDropdown Component */}
                <NotificationDropdown
                  notifications={notifications}
                  loading={loadingNotifications}
                  unreadCount={unreadCount}
                  isOpen={showNotificationDropdown}
                />
              </div>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface rounded-none transition-all duration-200"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-brand-accent text-white rounded-full text-[10px] w-4 h-4 sm:w-4 sm:h-4 flex items-center justify-center font-semibold">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative dropdown-container">
              {isAuthenticated ? (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-2 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface rounded-none transition-all duration-200"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name || "Profile"}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-brand-border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = ""; // Clear src to trigger fallback
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {(!user?.profileImage) && (
                    <div className="w-8 h-8 bg-brand-surface rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-brand-text-primary">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  {/* Hidden fallback for onError */}
                  <div className="w-8 h-8 bg-brand-surface rounded-full hidden items-center justify-center">
                     <span className="text-sm font-semibold text-brand-text-primary">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-6 py-2 bg-brand-accent text-white rounded-none hover:bg-black transition-all duration-200 font-medium uppercase text-xs tracking-wider"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* User Dropdown */}
              {showUserDropdown && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="font-semibold text-gray-900">
                      {user?.name || "My Account"}
                    </p>
                    {user?.email && (
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <UserCircle className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/order"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <Package className="w-4 h-4 mr-3" />
                      Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

DesktopNavbar.propTypes = {
  token: PropTypes.string,
  setShowSearch: PropTypes.func.isRequired,
  getCartCount: PropTypes.func.isRequired,
  isTablet: PropTypes.bool,
};

export default DesktopNavbar;