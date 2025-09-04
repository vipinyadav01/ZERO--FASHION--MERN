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
  ChevronDown 
} from "lucide-react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const DesktopNavbar = ({ token, setShowSearch, getCartCount }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const context = useContext(ShopContext);
  const {
    setToken = () => {},
    setUser = () => {},
    user = null,
    currency = "₹",
    getCartAmount = () => 0,
  } = context || {};

  const navigate = useNavigate();
  const location = useLocation();

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
      if (!event.target.closest('.dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserDropdown]);



  // Utility functions
  const isAuthenticated = Boolean(token && user);
  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const cartCount = getCartCount ? getCartCount() : 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <img
                src={assets.logo || "/apple-touch-icon.png"}
                alt="Zero Fashion"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                ZERO
              </span>
              <span className="text-xs text-gray-500 tracking-widest -mt-1">
                FASHION
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-8">
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    active
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:text-black hover:bg-gray-50"
                  }`}
                >
                  <ItemIcon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 hover:scale-110"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative dropdown-container">
              {isAuthenticated ? (
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name || "Profile"}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium"
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
};

export default DesktopNavbar;