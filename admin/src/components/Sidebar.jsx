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
    Bell,
    LogOut
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
        { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, text: "Dashboard", color: "from-violet-600 to-purple-700" },
        { to: "/order-charts", icon: <BarChart3 className="w-5 h-5" />, text: "Analytics", color: "from-blue-600 to-cyan-700" },
        { to: "/add", icon: <PlusCircle className="w-5 h-5" />, text: "Add Items", color: "from-emerald-600 to-green-700" },
        { to: "/list", icon: <ListTodo className="w-5 h-5" />, text: "Inventory", color: "from-amber-600 to-yellow-700" },
        { to: "/orders", icon: <ShoppingCart className="w-5 h-5" />, text: "Orders", color: "from-rose-600 to-red-700" },
        { to: "/UserProfile", icon: <Users className="w-5 h-5" />, text: "Users", color: "from-indigo-600 to-blue-700" },
        { to: "/setting", icon: <Settings className="w-5 h-5" />, text: "Settings", color: "from-slate-600 to-gray-700" },
    ];

    return (
        <>
            <aside
                className={`
                    ${isCollapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"}
                    fixed left-0 top-0 bottom-0
                    bg-gray-900 text-white
                    transition-all duration-300 ease-in-out
                    border-r border-gray-800/50 shadow-xl z-40
                    overflow-y-auto overflow-x-hidden
                    backdrop-blur-md bg-opacity-95
                    flex flex-col
                `}
            >
                {/* Logo Area */}
                <div className="p-4 sm:p-6 flex items-center justify-between sm:justify-start">
                    <div className="flex items-center pt-14 sm:pt-18">
                        <div className="w-10 h-10sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-violet-700
                            rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 transform hover:scale-105 transition-all duration-200">
                            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <h1 className={`ml-3 font-bold text-lg sm:text-xl transition-all duration-300
                            ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                            Admin Portal
                        </h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 sm:px-4 py-6 space-y-2">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            className={({ isActive }) => `
                                relative flex items-center px-3 sm:px-4 py-2.5 rounded-xl
                                transition-all duration-300 group hover:scale-105
                                ${isActive
                                    ? `bg-gradient-to-r ${item.color} shadow-md shadow-${item.color.split('-')[1]}-500/20`
                                    : 'hover:bg-gray-800/70 text-gray-200'}
                            `}
                        >
                            <div className="flex items-center justify-center w-8 flex-shrink-0">
                                {item.icon}
                            </div>
                            <span className={`ml-3 font-medium text-sm sm:text-base whitespace-nowrap transition-all duration-300
                                ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                                {item.text}
                            </span>
                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-800 rounded-md
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap
                                    shadow-lg shadow-gray-900/50 border border-gray-700/50 text-xs sm:text-sm z-50">
                                    {item.text}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Section */}
                <div className={`px-3 sm:px-4 py-4 mt-auto border-t border-gray-800/50 ${isCollapsed ? "hidden" : "block"}`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600
                            flex items-center justify-center overflow-hidden shadow-md transform hover:scale-105 transition-all duration-200">
                            <span className="text-base sm:text-lg font-semibold text-white">JD</span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm truncate">John Doe</h4>
                            <p className="text-xs text-gray-400 truncate">Administrator</p>
                        </div>
                        <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-800/70 transition-colors flex-shrink-0">
                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-200" />
                        </button>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-18 sm:top-24 bg-gray-800 text-gray-300
                        hover:text-white rounded-full p-1.5 sm:p-2 flex items-center justify-center
                        border border-gray-700/50 hover:border-blue-500/50
                        transition-all duration-300 hover:scale-110 hover:shadow-blue-500/30 shadow-lg z-50"
                    aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <ChevronLeft
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300
                            ${isCollapsed ? "rotate-180" : "rotate-0"}`}
                    />
                </button>
            </aside>

            {/* Main Content Padding */}
            <div className={`${isCollapsed ? "ml-16 sm:ml-20" : "ml-64 sm:ml-72"} transition-all duration-300 ease-out`}></div>
        </>
    );
};

export default Sidebar;
