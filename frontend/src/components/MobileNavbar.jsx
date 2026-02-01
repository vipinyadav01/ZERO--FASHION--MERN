import { useContext, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Home,
  Grid3X3,
  Heart,
  Package,
  User,
  UserCircle,
  Bell,
} from "lucide-react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const MobileNavbar = ({ token, getCartCount, setShowSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(ShopContext) || {};

  const isAuthenticated = Boolean(token);
  const cartCount = useMemo(() => getCartCount ? getCartCount() : 0, [getCartCount]);

  // Bottom navigation items with better organization
  const navItems = useMemo(() => [
    { 
      icon: Home, 
      label: "Home", 
      path: "/",
      id: "home"
    },
    { 
      icon: Grid3X3, 
      label: "Shop", 
      path: "/collection",
      id: "collection"
    },
    { 
      icon: Heart, 
      label: "Wishlist", 
      path: "/wishlist", 
      authRequired: true,
      id: "wishlist"
    },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
      authRequired: true,
      id: "notifications"
    },
    {
      icon: Package,
      label: "Orders",
      path: "/order",
      id: "orders"
    },
  ], []);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    navigate(path);
  };

  const ProfileImage = ({ user, isAuthenticated }) => {
    if (isAuthenticated && user?.profileImage) {
      return (
        <div className="relative w-5 h-5 sm:w-6 sm:h-6">
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover ring-2 ring-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'block';
              }
            }}
          />
          <UserCircle 
            className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600 hidden" 
            style={{ display: 'none' }}
          />
        </div>
      );
    }
    return <User className="w-7 h-7 sm:w-8 sm:h-8" />;
  };

  return (
    <>
      {/* Mobile Header - Flipkart Style */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100 shadow-sm">
        <div className="h-14 sm:h-16 flex items-center justify-between gap-2 px-3 sm:px-4 max-w-screen-xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 group"
            aria-label="Zero Fashion Home"
          >
            <motion.div 
              className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/pwa-192x192.png"
                alt="Zero"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                loading="eager"
                onError={e => { e.target.onerror = null; e.target.src = "/apple-touch-icon.png"; }}
              />
            </motion.div>
          </Link>

          {/* Search Bar - Central Focus */}
          <motion.button
            onClick={() => setShowSearch(true)}
            className="flex-1 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-150 rounded-lg transition-colors duration-200"
            whileTap={{ scale: 0.98 }}
            aria-label="Search products"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" strokeWidth={2} />
            <span className="text-xs sm:text-sm text-gray-500 truncate">Search for items...</span>
          </motion.button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Cart */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/cart"
                className="relative p-2 sm:p-2.5 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 overflow-visible"
                aria-label={`Shopping cart with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold shadow-md"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </Link>
            </motion.div>

            {/* Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className="p-2 sm:p-2.5 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
                aria-label={isAuthenticated ? "Your profile" : "Sign in"}
              >
                <ProfileImage 
                  user={user} 
                  isAuthenticated={isAuthenticated} 
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 z-50 pb-safe">
        <div className="flex justify-around items-center px-2 py-2 max-w-screen-xl mx-auto">
          {navItems.map((item) => {
            const ItemIcon = item.icon;
            const active = isActive(item.path);
            
            if (item.authRequired && !isAuthenticated) {
              return null;
            }
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`relative flex flex-col items-center justify-center px-3 sm:px-4 py-2 sm:py-3 min-w-[60px] sm:min-w-[70px] rounded-2xl transition-all duration-200 ${
                  active
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: active ? 1 : 1.05 }}
                initial={false}
                animate={{ 
                  backgroundColor: active ? "rgba(0, 0, 0, 0.08)" : "transparent" 
                }}
                aria-label={`Navigate to ${item.label}`}
              >
                {active && (
                  <motion.div
                    className="absolute inset-0 bg-gray-900/10 rounded-2xl"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                <ItemIcon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 transition-all duration-200 ${
                    active ? 'text-black' : 'text-gray-500'
                  }`} 
                  strokeWidth={active ? 2 : 1.5}
                />
                <span className={`text-[11px] sm:text-xs font-medium transition-all duration-200 ${
                  active ? 'text-black' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                
                {active && (
                  <motion.div
                    className="absolute -bottom-0.5 w-1 h-1 bg-black rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      <div className="h-14 sm:h-16" />
    </>
  );
};

MobileNavbar.propTypes = {
  token: PropTypes.string,
  getCartCount: PropTypes.func.isRequired,
  setShowSearch: PropTypes.func.isRequired,
};

export default MobileNavbar;