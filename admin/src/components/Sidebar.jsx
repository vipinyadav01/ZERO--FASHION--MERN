import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const navItems = [
    { to: "/add", icon: assets.add_icon, text: "Add Items" },
    { to: "/list", icon: assets.order_icon, text: "List Items" },
    { to: "/orders", icon: assets.order_icon, text: "Orders" },
  ];

  return (
    <aside className="w-16 sm:w-64 min-h-screen bg-white shadow-lg transition-all duration-300 ease-in-out">
      <nav className="flex flex-col h-full py-6">
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 hidden sm:block border-b-2 border-cyan-500">
            Dashboard
          </h2>
        </div>
        <ul className="space-y-2 flex-grow">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-l-full transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? "bg-gray-500 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <img className="w-6 h-6" src={item.icon} alt="" />
                <span className="hidden sm:inline">{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
