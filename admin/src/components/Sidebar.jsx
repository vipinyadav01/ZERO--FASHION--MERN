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
        { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, text: "Dashboard", color: "from-violet-500 to-purple-600" },
        { to: "/order-charts", icon: <BarChart3 className="w-5 h-5" />, text: "Analytics", color: "from-blue-500 to-cyan-600" },
        { to: "/add", icon: <PlusCircle className="w-5 h-5" />, text: "Add Items", color: "from-emerald-500 to-green-600" },
        { to: "/list", icon: <ListTodo className="w-5 h-5" />, text: "Inventory", color: "from-amber-500 to-yellow-600" },
        { to: "/orders", icon: <ShoppingCart className="w-5 h-5" />, text: "Orders", color: "from-rose-500 to-red-600" },
        { to: "/UserProfile", icon: <Users className="w-5 h-5" />, text: "Users", color: "from-indigo-500 to-blue-600" },
        { to: "/setting", icon: <Settings className="w-5 h-5" />, text: "Settings", color: "from-slate-500 to-gray-600" },
    ];

    return (
        <>
            <aside
                className={`
          ${isCollapsed ? "w-20" : "w-72"}
          fixed left-0 top-0 bottom-0
          bg-gray-950 text-white
          transition-all duration-300 ease-out
          border-r border-gray-800/30 shadow-2xl z-40
          overflow-y-auto overflow-x-hidden
          backdrop-blur-sm bg-opacity-90
        `}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center pt-20">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600
            rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <h1 className={`ml-3 font-bold text-xl transition-all duration-300
            ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>
                        Admin Portal
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-3">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            className={({ isActive }) => `
                relative flex items-center px-4 py-3 rounded-2xl
                transition-all duration-300 group hover:scale-102
                ${isActive
                                    ? `bg-gradient-to-r ${item.color} shadow-lg`
                                    : 'hover:bg-gray-800/50'}
              `}
                        >
                            <div className={`
                flex items-center justify-center
                transition-transform duration-200
                ${isCollapsed ? "w-full" : ""}
              `}>
                                {item.icon}
                            </div>
                            <span className={`ml-4 font-medium whitespace-nowrap transition-all duration-300
                ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                                {item.text}
                            </span>

                            {/* Enhanced Tooltip */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 rounded-md
                  opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                  shadow-lg shadow-gray-900/50 border border-gray-700/50 text-sm z-50">
                                    {item.text}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Section */}
                <div className={`px-4 py-4 mt-auto border-t border-gray-800/30 ${isCollapsed ? "hidden" : "block"}`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden shadow-md">
                            <span className="text-lg font-semibold text-white">JD</span>
                        </div>
                        <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                            <h4 className="font-medium text-sm">John Doe</h4>
                            <p className="text-xs text-gray-400">Administrator</p>
                        </div>
                        <button className="ml-auto p-2 rounded-lg hover:bg-gray-800/70 transition-colors">
                            <LogOut className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Toggle Button - Redesigned */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-20 bg-gray-800 text-gray-300
            hover:text-white rounded-full p-2 flex items-center justify-center
            border border-gray-700/50 hover:border-blue-500/50
            transition-all duration-300 hover:scale-110
            shadow-lg hover:shadow-blue-500/20 z-50"
                    aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    <ChevronLeft
                        className={`w-5 h-5 transition-transform duration-300
              ${isCollapsed ? "rotate-180" : "rotate-0"}`}
                    />
                </button>
            </aside>

            {/* Main Content Padding */}
            <div className={`${isCollapsed ? "ml-20" : "ml-72"} transition-all duration-300 ease-out`}></div>
        </>
    );
};

export default Sidebar;
