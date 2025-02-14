import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    BarChart3,
    PlusCircle,
    ListTodo,
    ShoppingCart,
    ChevronLeft,
    LayoutDashboard
} from "lucide-react";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const navItems = [
        {
            to: "/dashboard",
            icon: <LayoutDashboard className="w-5 h-5" />,
            text: "Dashboard",
            color: "from-purple-400 to-purple-600"
        },
        {
            to: "/order-charts",
            icon: <BarChart3 className="w-5 h-5" />,
            text: "Analytics",
            color: "from-blue-400 to-blue-600"
        },
        {
            to: "/add",
            icon: <PlusCircle className="w-5 h-5" />,
            text: "Add Items",
            color: "from-green-400 to-green-600"
        },
        {
            to: "/list",
            icon: <ListTodo className="w-5 h-5" />,
            text: "Inventory",
            color: "from-yellow-400 to-yellow-600"
        },
        {
            to: "/orders",
            icon: <ShoppingCart className="w-5 h-5" />,
            text: "Orders",
            color: "from-red-400 to-red-600"
        },
    ];

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <aside
            className={`
        ${isCollapsed ? "w-20" : "w-72"}
        min-h-screen bg-gray-900 text-white relative
        transition-all duration-300 ease-in-out flex flex-col
        border-r border-gray-800
      `}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 bg-gray-900 text-gray-300
          hover:text-white rounded-full p-1.5
          flex items-center justify-center shadow-lg
          border border-gray-700 hover:border-gray-600
          transition-all duration-200 hover:scale-110"
            >
                <ChevronLeft
                    className={`w-4 h-4 transition-transform duration-300
            ${isCollapsed ? "rotate-180" : "rotate-0"}`}
                />
            </button>

            {/* Logo Area */}
            <div className="p-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600
          rounded-xl flex items-center justify-center shadow-lg">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <h1 className={`ml-3 font-bold text-xl transition-opacity duration-300
          ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                    Admin Panel
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
                <div className="space-y-2">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            className={({ isActive }) => `
                relative flex items-center px-3 py-3 rounded-xl
                transition-all duration-200 group
                ${isActive
                                    ? `bg-gradient-to-r ${item.color} shadow-lg`
                                    : 'hover:bg-gray-800'
                                }
              `}
                            onMouseEnter={() => setActiveItem(index)}
                            onMouseLeave={() => setActiveItem(null)}
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Icon */}
                                    <span className={`
                    flex items-center justify-center
                    transition-transform duration-200
                    ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                                        {item.icon}
                                    </span>

                                    {/* Text */}
                                    <span className={`
                    ml-3 font-medium whitespace-nowrap
                    transition-all duration-300
                    ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}
                  `}>
                                        {item.text}
                                    </span>

                                    {/* Tooltip */}
                                    {isCollapsed && (
                                        <div className={`
                      absolute left-full ml-3 px-3 py-2
                      bg-gray-800 text-white text-sm rounded-lg
                      shadow-xl whitespace-nowrap z-50
                      transition-all duration-200
                      ${activeItem === index ? 'opacity-100 visible' : 'opacity-0 invisible'}
                    `}>
                                            {item.text}
                                        </div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <div className={`
        p-4 mt-auto border-t border-gray-800
        transition-opacity duration-300
        ${isCollapsed ? 'opacity-0' : 'opacity-100'}
      `}>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Admin User</p>
                        <p className="text-xs text-gray-400 truncate">admin@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
