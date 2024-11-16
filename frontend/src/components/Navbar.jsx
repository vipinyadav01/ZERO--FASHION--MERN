import React, { useEffect, useState, useContext } from "react";
import { assets } from "./../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

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

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems([]);
  };

  const getUserDetails = async (authToken) => {
    if (!authToken) return;
    try {
      const res = await fetch(`${backendUrl}/api/user/user`, {
        headers: {
          token: authToken
        }
      });
      const result = await res.json();
      setUser(result.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserDetails(token);
    }
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".profile-icon")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-500">
      <div className="flex items-center justify-between py-5 font-medium max-w-7xl mx-auto px-4">
        <Link to={"/"} className="flex gap-4 items-center">
          <img src={assets.logo} alt="logoImage" className="w-5 h-5 sm:w-12 sm:h-12" />
        <div className="align-left">
          <div className="text-lg font-bold leading-none">ZERO</div>
          <div className="text-xl font-extrabold uppercase leading-none">FASHION</div>
        </div>
        </Link>


        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1 hover:text-black">
            <p>HOME</p>
          </NavLink>
          <NavLink to="/collection" className="flex flex-col items-center gap-1 hover:text-black">
            <p>COLLECTION</p>
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1 hover:text-black">
            <p>ABOUT</p>
          </NavLink>
          <NavLink to="/contact" className="flex flex-col items-center gap-1 hover:text-black">
            <p>CONTACT</p>
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer hover:opacity-80"
            alt="searchIcon"
          />

          <div className="relative profile-icon">
            <img
              onClick={() => (token ? setShowDropdown(!showDropdown) : navigate("/login"))}
              src={assets.profile_icon}
              className="w-5 cursor-pointer hover:opacity-80"
              alt="profileIcon"
            />
            {token && showDropdown && (
              <div className="absolute dropdown-menu right-0 top-full mt-2 z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="py-1">
                  <p
                    onClick={() => navigate("/profile")}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/order")}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Order
                  </p>
                  <hr className="border-t border-gray-200 my-1" />
                  <p
                    onClick={logout}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              className="w-5 min-w-5 hover:opacity-80"
              alt="cartIcon"
            />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
          </Link>

          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="menu_icon"
            className="w-5 cursor-pointer sm:hidden hover:opacity-80"
          />
        </div>

        <div className={`fixed top-0 right-0 bottom-0 bg-white transition-all ${visible ? "w-full" : "w-0"}`}>
          <div className="flex flex-col text-gray-600">
            <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
              <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="close_icon" />
              <p>Back</p>
            </div>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border hover:bg-gray-100" to="/">
              Home
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border hover:bg-gray-100" to="/collection">
              Collection
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border hover:bg-gray-100" to="/about">
              About
            </NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border hover:bg-gray-100" to="/contact">
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
