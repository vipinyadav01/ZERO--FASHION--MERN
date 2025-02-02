import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaChartBar, FaPlus, FaList, FaShoppingCart, FaBars } from "react-icons/fa";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { to: "/order-charts", icon: <FaChartBar className="w-6 h-6" />, text: "OrderCharts" },
        { to: "/add", icon: <FaPlus className="w-6 h-6" />, text: "Add Items" },
        { to: "/list", icon: <FaList className="w-6 h-6" />, text: "List Items" },
        { to: "/orders", icon: <FaShoppingCart className="w-6 h-6" />, text: "Orders" },
    ];

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <aside
            className={`${isCollapsed ? "w-16" : "w-64"
                } min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-xl transition-all duration-300 ease-in-out relative`}
        >
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-8 bg-white text-blue-600 hover:text-blue-700 rounded-full p-1 w-6 h-6 flex items-center justify-center shadow-lg transform transition-transform hover:scale-110"
            >
                <FaBars
                    className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-0" : "rotate-180"}`}
                />
            </button>

            <nav className="flex flex-col h-full py-6">
                <div className="px-4 mb-8 flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                        <FaBars className="w-5 h-5 text-white" />
                    </div>
                    <h2
                        className={`text-xl font-bold transition-opacity duration-300 ${isCollapsed ? "opacity-0 hidden" : "opacity-100"
                            }`}
                    >
                        Dashboard
                    </h2>
                </div>

                <ul className="space-y-2 flex-grow">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-l-full transition-all duration-200 ease-in-out relative group
                    ${isActive ? "bg-white bg-opacity-20 text-white shadow-md" : "hover:bg-white hover:bg-opacity-10"}`
                                }
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="transition-transform duration-200 group-hover:scale-110">
                                        {item.icon}
                                    </span>
                                    <span
                                        className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0 hidden" : "opacity-100"
                                            }`}
                                    >
                                        {item.text}
                                    </span>
                                </div>
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-white text-blue-600 text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-md">
                                        {item.text}
                                    </div>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
