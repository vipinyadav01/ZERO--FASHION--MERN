import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  UserCircle,
  Contact,
  Bell,
  Home,
  Play,
  Grid,
  ListOrdered,
} from "lucide-react";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";

const MobileNavbar = ({ token, setShowSearch, getCartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = () => Boolean(token);

  // Navigation items configuration
  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      path: "/", 
      ariaLabel: "Navigate to Home" 
    },
    { 
      icon: Play, 
      label: "Collection", 
      path: "/collection", 
      ariaLabel: "Navigate to Collection" 
    },
    { 
      icon: Grid, 
      label: "Wishlist", 
      path: "/wishlist", 
      ariaLabel: "Navigate to Wishlist" 
    },
    {
      icon: ListOrdered,
      label: "Order",
      path: isAuthenticated() ? "/order" : "/login",
      ariaLabel: isAuthenticated() ? "Navigate to Orders" : "Navigate to Login",
    },
  ];

  // Handle search input click
  const handleSearchClick = () => {
    if (setShowSearch) {
      setShowSearch(true);
    }
  };

  // Get cart count safely
  const cartCount = getCartCount ? getCartCount() : 0;

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 md:hidden border-b border-stone-200 shadow-sm shadow-stone-200/40">
        <div className="flex items-center justify-between px-4 py-3.5">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            aria-label="Navigate to ZFashion Homepage"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-stone-800 to-stone-950 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <img
                src="/apple-touch-icon.png"
                alt="Zero Fashion Logo"
                className="w-6 h-6"
              />
            </div>
            <span className="text-lg font-semibold text-stone-900 font-['Asterion'] tracking-tight">
              ZeroFashion
            </span>
          </Link>

          {/* Search and Cart Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              className="relative flex items-center bg-stone-100 rounded-lg px-3 py-2 w-32 border border-black hover:bg-stone-200 transition-colors duration-200"
              onClick={handleSearchClick}
              aria-label="Open search"
            >
              <Search className="w-4 h-4 text-stone-600 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none placeholder-stone-500 text-stone-800 w-full font-outfit"
                onClick={handleSearchClick}
                readOnly
              />
            </button>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 bg-stone-100 rounded-lg border border-black hover:bg-stone-200 transition-colors duration-200"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-stone-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold border border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex justify-around py-3 bg-stone-50 border-t border-stone-100">
          {/* Profile Button */}
          <Link
            to={isAuthenticated() ? "/profile" : "/login"}
            className="flex flex-col items-center border border-black bg-white px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors duration-200 shadow-sm hover:shadow-md group"
            aria-label={isAuthenticated() ? "View profile" : "Login"}
          >
            <UserCircle className="w-4 h-4 text-stone-700 group-hover:text-stone-900" />
            <span className="text-xs mt-1 font-medium text-stone-700 group-hover:text-stone-900">
              Profile
            </span>
          </Link>

          {/* Notifications Button */}
          <Link
            to={isAuthenticated() ? "/notifications" : "/login"}
            className="flex flex-col items-center border border-black bg-white px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors duration-200 shadow-sm hover:shadow-md group"
            aria-label={isAuthenticated() ? "View notifications" : "Login"}
          >
            <Bell className="w-4 h-4 text-stone-700 group-hover:text-stone-900" />
            <span className="text-xs mt-1 font-medium text-stone-700 group-hover:text-stone-900">
              Notifications
            </span>
          </Link>

          {/* Contact Button */}
          <Link
            to="/contact"
            className="flex flex-col items-center border border-black bg-white px-4 py-2 rounded-lg hover:bg-stone-100 transition-colors duration-200 shadow-sm hover:shadow-md group"
            aria-label="Contact us"
          >
            <Contact className="w-4 h-4 text-stone-700 group-hover:text-stone-900" />
            <span className="text-xs mt-1 font-medium text-stone-700 group-hover:text-stone-900">
              Contact
            </span>
          </Link>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[120px] md:hidden"></div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-stone-100 via-white to-stone-200 shadow-[0_-4px_24px_rgba(0,0,0,0.10)] z-50 md:hidden border-t border-stone-200 backdrop-blur-lg">
        <div className="flex justify-around py-2 bg-stone-50/80 rounded-t-2xl shadow-inner">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 font-outfit
                  ${isActive
                    ? "text-white bg-gradient-to-br from-stone-800 to-stone-950 shadow-lg scale-105 border-2 border-stone-900"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 border border-transparent"
                  }
                  group
                `}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.07 }}
                aria-label={item.ariaLabel}
              >
                {/* Icon Container */}
                <span
                  className={`flex items-center justify-center w-3 h-3 rounded-full mb-0.5 transition-all duration-300
                    ${isActive
                      ? "bg-gradient-to-br from-stone-900 to-stone-700 shadow-md"
                      : "bg-stone-100 group-hover:bg-stone-200"
                    }
                  `}
                >
                  <item.icon
                    className={`w-3 h-3 transition-colors duration-300
                      ${isActive ? "text-white" : "text-stone-700 group-hover:text-stone-900"}
                    `}
                  />
                </span>

                {/* Label */}
                <span
                  className={`text-[0.78rem] font-semibold tracking-tight transition-colors duration-300
                    ${isActive ? "text-stone-100 drop-shadow" : "text-stone-700 group-hover:text-stone-900"}
                  `}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

// PropTypes for type checking
MobileNavbar.propTypes = {
  token: PropTypes.string,
  setShowSearch: PropTypes.func.isRequired,
  getCartCount: PropTypes.func.isRequired,
};

export default MobileNavbar;