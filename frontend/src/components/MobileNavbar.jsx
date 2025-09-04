import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  UserCircle,
  Home,
  Grid3X3,
  Heart,
  Package,
  User,
  Menu,
} from "lucide-react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const MobileNavbar = ({ token, getCartCount, setShowSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(ShopContext) || {};

  const isAuthenticated = Boolean(token);
  const cartCount = getCartCount ? getCartCount() : 0;

  // Bottom navigation items
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

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            aria-label="Zero Fashion Home"
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <img
                src={assets.logo || "/apple-touch-icon.png"}
                alt="Zero Fashion"
                className="w-5 h-5 object-contain"
              />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight font-asterion">
              ZERO FASHION
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-semibold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all"
              aria-label={isAuthenticated ? "Profile" : "Login"}
            >
              {isAuthenticated && user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[64px]"></div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            const active = isActive(item.path);
            
            // Skip auth-required items for non-authenticated users
            if (item.authRequired && !isAuthenticated) {
              return null;
            }
            
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center px-3 py-2 min-w-[60px] rounded-lg transition-all duration-200 ${
                  active
                    ? "text-black bg-gray-100"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <ItemIcon className={`w-5 h-5 mb-1 ${active ? 'text-black' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium ${active ? 'text-black' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
      
      {/* Bottom spacer for navigation */}
      <div className="h-[68px]"></div>
    </>
  );
};

MobileNavbar.propTypes = {
  token: PropTypes.string,
  getCartCount: PropTypes.func.isRequired,
  setShowSearch: PropTypes.func.isRequired,
};

export default MobileNavbar;
