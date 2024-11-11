import React, { useEffect, useState } from "react";
import { assets } from "./../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);

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

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-500">
      <div className="flex items-center justify-between py-5 font-medium max-w-7xl mx-auto px-4">
        <Link to={"/"}>
          <img src={assets.logo} className="w-36" alt="logoImage" />
        </Link>

        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink
            to="/"
            className="flex flex-col items-center gap-1 hover:text-black"
          >
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink
            to="/collection"
            className="flex flex-col items-center gap-1 hover:text-black"
          >
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink
            to="/about"
            className="flex flex-col items-center gap-1 hover:text-black"
          >
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
          <NavLink
            to="/contact"
            className="flex flex-col items-center gap-1 hover:text-black"
          >
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer hover:opacity-80"
            alt="searchIcon"
          />

          <div className="group relative">
            <img
              onClick={() => (token ? null : navigate("/login"))}
              src={assets.profile_icon}
              className="w-5 cursor-pointer hover:opacity-80"
              alt="profileIcon"
            />
            {/* DropDown Menu */}
            {token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-max py-3 px-5 bg-slate-100 text-gray-500 rounded">
                  <p
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer hover:text-black"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/order")}
                    className="cursor-pointer hover:text-black"
                  >
                    Order
                  </p>
                  <p onClick={logout} className="cursor-pointer hover:text-black">
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* cart icon start */}
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
          {/* cart icon end */}

          {/* mobile responsive menu icon */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="menu_icon"
            className="w-5 cursor-pointer sm:hidden hover:opacity-80"
          />
        </div>

        {/* sidebar menu for small screen basically for mobile */}
        <div
          className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"
            }`}
        >
          <div className="flex flex-col text-gray-600">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-3 cursor-pointer"
            >
              <img
                className="h-4 rotate-180"
                src={assets.dropdown_icon}
                alt="close_icon"
              />
              <p>Back</p>
            </div>

            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border hover:bg-gray-100"
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border hover:bg-gray-100"
              to="/collection"
            >
              Collection
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border hover:bg-gray-100"
              to="/about"
            >
              About
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border hover:bg-gray-100"
              to="/contact"
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;