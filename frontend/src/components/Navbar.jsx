import React, { useEffect, useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

const NavbarLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-1 hover:text-black ${isActive ? 'text-black' : 'text-gray-700'}`
    }
  >
    <p>{children}</p>
  </NavLink>
);

const DropdownItem = ({ onClick, color = 'gray', children }) => (
  <motion.p
    whileHover={{ backgroundColor: color === 'red' ? '#fee2e2' : '#f3f4f6' }}
    onClick={onClick}
    className={`px-4 py-2 text-sm ${color === 'red' ? 'text-red-600' : 'text-gray-700'} cursor-pointer`}
  >
    {children}
  </motion.p>
);

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    token,
    setToken,
    setCartItems,
    backendUrl
  } = useContext(ShopContext);

  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/collection', label: 'COLLECTION' },
    { path: '/about', label: 'ABOUT' },
    { path: '/contact', label: 'CONTACT' }
  ];

  const dropdownOptions = [
    { label: 'My Profile', path: '/profile' },
    { label: 'Orders', path: '/order' }
  ];

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems([]);
    setShowDropdown(false);
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (token) {
      setShowDropdown(!showDropdown);
    } else {
      navigate('/login');
    }
  };

  const fetchUserDetails = async (authToken) => {
    if (!authToken) return;
    try {
      const response = await fetch(`${backendUrl}/api/user/user`, {
        headers: { token: authToken }
      });
      const result = await response.json();
      if (result.success) {
        setUser(result.user);
      } else {
        console.error('Error fetching user details:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
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
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-icon')) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const animationVariants = {
    dropdown: {
      hidden: { opacity: 0, y: -10, scale: 0.95 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.2 }
      },
      exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: { duration: 0.2 }
      }
    },
    mobileMenu: {
      hidden: { x: '100%' },
      visible: {
        x: 0,
        transition: { type: 'tween', duration: 0.3 }
      },
      exit: {
        x: '100%',
        transition: { type: 'tween', duration: 0.3 }
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="flex items-center justify-between py-5 font-medium max-w-7xl mx-auto px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <img src={assets.logo} alt="Logo" className="w-5 h-5 sm:w-12 sm:h-12" />
          <div className="flex flex-col">
            <span className="text-lg font-bold">ZERO</span>
            <span className="text-xl font-extrabold uppercase">FASHION</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex gap-5 text-sm">
          {navLinks.map(({ path, label }) => (
            <NavbarLink key={path} to={path}>
              {label}
            </NavbarLink>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-6">
          {/* Search Icon */}
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            alt="Search"
            className="w-5 cursor-pointer"
          />

          {/* Profile Icon */}
          <div className="relative profile-icon">
            <img
              onClick={handleProfileClick}
              src={assets.profile_icon}
              alt="Profile"
              className="w-5 cursor-pointer"
            />
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  variants={animationVariants.dropdown}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg"
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
                  <hr />
                  <DropdownItem onClick={logout} color="red">
                    Logout
                  </DropdownItem>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} alt="Cart" className="w-5" />
            <span className="absolute right-0 bottom-0 bg-black text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {getCartCount()}
            </span>
          </Link>

          {/* Mobile Menu Icon */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="Menu"
            className="w-5 cursor-pointer sm:hidden"
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
              className="fixed top-0 right-0 bottom-0 bg-white w-full z-50"
            >
              <div className="p-4">
                <button onClick={() => setVisible(false)} className="mb-4">
                  Back
                </button>
                {navLinks.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    className="block py-2 text-gray-600"
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
    </div>
  );
};

export default Navbar;
