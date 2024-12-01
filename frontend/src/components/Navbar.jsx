import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";

const NavbarLink = ({ to, children, isActive }) => (
  <NavLink
    to={to}
    className={({ isActive: active }) =>
      `relative flex flex-col items-center gap-1 hover:text-black transition-colors duration-300 ${active ? "text-black" : "text-gray-700"
      }`
    }
  >
    <p className="text-sm font-medium tracking-wide">{children}</p>
    <motion.div
      className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
      initial={false}
      animate={{ scaleX: isActive ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  </NavLink>
);

const DropdownItem = ({ onClick, color = "gray", children }) => (
  <motion.div
    whileHover={{ backgroundColor: color === "red" ? "#fee2e2" : "#f3f4f6" }}
    onClick={onClick}
    className={`px-4 py-3 text-sm ${color === "red" ? "text-red-600" : "text-gray-700"
      } cursor-pointer transition-colors duration-200`}
    style={{ fontFamily: "Doto" }}
  >
    {children}
  </motion.div>
);

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    token,
    setToken,
    setCartItems,
    backendUrl,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "HOME" },
    { path: "/collection", label: "COLLECTION" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
  ];

  const dropdownOptions = [
    { label: "My Profile", path: "/profile" },
    { label: "Orders", path: "/order" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setCartItems([]);
    setShowDropdown(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (token) {
      setShowDropdown(!showDropdown);
    } else {
      navigate("/login");
    }
  };

  const fetchUserDetails = async (authToken) => {
    if (!authToken) return;
    try {
      const response = await fetch(`${backendUrl}/api/user/user`, {
        headers: { token: authToken },
      });
      const result = await response.json();
      if (result.success) {
        setUser(result.user);
      } else {
        console.error("Error fetching user details:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserDetails(token);
    } else {
      setUser(null);
      setShowDropdown(false);
    }
  }, [token]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-icon")) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

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
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-300 ${scrolled ? "shadow-md" : ""
        }`}
      initial={false}
      animate={{ y: scrolled ? -10 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between py-3 font-medium max-w-7xl mx-auto px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <motion.img
            src={assets.logo}
            alt="Logo"
            className="w-6 h-6 sm:w-12 sm:h-10 p-1 bg-neutral-800 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wide">ZERO</span>
            <span className="text-xl font-extrabold uppercase tracking-wider leading-[0.9rem]">
              FASHION
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-8 text-sm">
          {navLinks.map(({ path, label }) => (
            <NavbarLink key={path} to={path}>
              {label}
            </NavbarLink>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-8">
          {/* Search Icon */}
          <motion.img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            alt="Search"
            className="w-5 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />

          {/* Profile Icon */}
          <div className="relative profile-icon">
            <motion.img
              onClick={handleProfileClick}
              src={assets.profile_icon}
              alt="Profile"
              className="w-5 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  variants={animationVariants.dropdown}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-4 w-56 bg-white shadow-xl rounded-lg overflow-hidden"
                >
                  {dropdownOptions.map(({ label, path }) => (
                    <DropdownItem
                      key={path}
                      onClick={() => {
                        navigate(path);
                        setShowDropdown(false);
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

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <motion.img
              src={assets.cart_icon}
              alt="Cart"
              className="w-5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.span
              className="absolute -right-2 -bottom-2 bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {getCartCount()}
            </motion.span>
          </Link>

          {/* Mobile Menu Icon */}
          <motion.img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="Menu"
            className="w-5 cursor-pointer sm:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {visible && (
            <motion.div
              variants={animationVariants.mobileMenu}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 bg-white w-full z-50 shadow-2xl"
            >
              <div className="p-6 flex flex-col h-full">
                <button
                  onClick={() => setVisible(false)}
                  className="self-end mb-8 text-2xl"
                >
                  &times;
                </button>
                {navLinks.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className="py-4 text-xl text-gray-800 border-b border-gray-200 last:border-b-0"
                    onClick={() => setVisible(false)}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Navbar;
