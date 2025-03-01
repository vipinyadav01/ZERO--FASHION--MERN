import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    BarChart3,
    PlusCircle,
    ListTodo,
    ShoppingCart,
    ChevronLeft,
    LayoutDashboard,
    Settings,
    Users,
    Bell
} from "lucide-react";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return JSON.parse(localStorage.getItem("sidebar-collapsed")) ?? false;
    });

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    const toggleSidebar = () => {
        setIsCollapsed((prevState) => !prevState);
    };

    const navItems = [
        { to: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, text: "Dashboard", color: "from-purple-400 to-purple-600" },
        { to: "/order-charts", icon: <BarChart3 className="w-4 h-4" />, text: "Analytics", color: "from-blue-400 to-blue-600" },
        { to: "/add", icon: <PlusCircle className="w-4 h-4" />, text: "Add Items", color: "from-green-400 to-green-600" },
        { to: "/list", icon: <ListTodo className="w-4 h-4" />, text: "Inventory", color: "from-yellow-400 to-yellow-600" },
        { to: "/orders", icon: <ShoppingCart className="w-4 h-4" />, text: "Orders", color: "from-red-400 to-red-600" },
        { to: "/UserProfile", icon: <Users className="w-4 h-4" />, text: "Users", color: "from-indigo-400 to-indigo-600" },
        { to: "/setting", icon: <Settings className="w-4 h-4" />, text: "Settings", color: "from-gray-400 to-gray-600" },
    ];

    return (
        <>
            <aside
                className={`
          ${isCollapsed ? "w-20" : "w-72"}
          fixed left-0 top-16 bottom-0
          bg-gray-900 text-white
          transition-all duration-300 ease-in-out
          border-r border-gray-800 shadow-xl z-40
          overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900
        `}
            >
                <div className="p-6 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600
            rounded-xl flex items-center justify-center shadow-lg">
                        <LayoutDashboard className="w-4 h-4 text-white" />
                    </div>
                    <h1 className={`ml-3 font-bold text-xl transition-opacity duration-300
            ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                        Admin Portal
                    </h1>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-2">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            className={({ isActive }) => `
                relative flex items-center px-3 py-3 rounded-xl
                transition-all duration-300 group
                ${isActive
                                    ? `bg-gradient-to-r ${item.color} shadow-lg`
                                    : 'hover:bg-gray-800 hover:scale-105'}
              `}
                        >
                            <div className={`
                flex items-center justify-center
                transition-transform duration-200
                ${isCollapsed ? "w-full" : ""}
              `}>
                                {item.icon}
                            </div>
                            <span className={`ml-3 font-medium whitespace-nowrap transition-all duration-300
                ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                                {item.text}
                            </span>

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-xs rounded-md
                  opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {item.text}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Collapse Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-6 bg-gray-800 text-gray-300
            hover:text-white rounded-full p-2 flex items-center justify-center
            border border-gray-700 hover:border-gray-600
            transition-all duration-300 hover:scale-110
            shadow-lg hover:shadow-blue-500/20"
                    aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <ChevronLeft
                        className={`w-5 h-5 transition-transform duration-300
              ${isCollapsed ? "rotate-180" : "rotate-0"}`}
                    />
                </button>
            </aside>

            {/* Main Content Padding */}
            <div className={`${isCollapsed ? "ml-20" : "ml-72"} transition-all duration-300 ease-in-out overflow-x-hidden`}></div>
        </>
    );
};

export default Sidebar;
