import { useState, useEffect } from "react";
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
        { to: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, text: "Dashboard" },
        { to: "/order-charts", icon: <BarChart3 className="w-5 h-5" />, text: "Analytics" },
        { to: "/add", icon: <PlusCircle className="w-5 h-5" />, text: "Add Items" },
        { to: "/list", icon: <ListTodo className="w-5 h-5" />, text: "Inventory" },
        { to: "/orders", icon: <ShoppingCart className="w-5 h-5" />, text: "Orders" },
        { to: "/UserProfile", icon: <Users className="w-5 h-5" />, text: "Users" },
        { to: "/setting", icon: <Settings className="w-5 h-5" />, text: "Settings" },
    ];

    return (
        <>
            <aside
                className={`
                    ${isCollapsed ? "w-16 sm:w-20" : "w-64 sm:w-72"}
                    fixed left-0 top-0 bottom-0
                    bg-[#131313] text-white
                    transition-all duration-300 ease-in-out
                    border-r border-[#939393]/10 shadow-xl z-40
                    overflow-y-auto overflow-x-hidden
                    flex flex-col
                `}
            >
                {/* Logo Area */}
                <div className="p-4 sm:p-6 flex items-center justify-between sm:justify-start">
                    <div className="flex items-center pt-14 sm:pt-16">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#131313]
                            rounded-xl flex items-center justify-center shadow-lg shadow-[#ff6200]/10 
                            border-2 border-[#ff6200] transform hover:scale-105 transition-all duration-200">
                            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6200]" />
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
                                relative flex items-center px-3 sm:px-4 py-3 rounded-xl
                                transition-all duration-300 group hover:scale-105
                                ${isActive
                                    ? `bg-[#ff6200] text-white shadow-md shadow-[#ff6200]/20`
                                    : 'hover:bg-[#131313]/70 text-[#939393] hover:text-white'}
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
                                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#131313] rounded-md
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap
                                    shadow-lg shadow-[#131313]/50 border border-[#939393]/20 text-xs sm:text-sm z-50">
                                    {item.text}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Section */}
                <div className={`px-3 sm:px-4 py-4 mt-auto border-t border-[#939393]/10 ${isCollapsed ? "hidden" : "block"}`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#ff6200]/70
                            flex items-center justify-center overflow-hidden shadow-md transform hover:scale-105 transition-all duration-200">
                            <span className="text-base sm:text-lg font-semibold text-white">JD</span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm truncate">John Doe</h4>
                            <p className="text-xs text-[#939393] truncate">Administrator</p>
                        </div>
                        <button className="p-1.5 sm:p-2 rounded-lg hover:bg-[#131313]/70 transition-colors flex-shrink-0">
                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-[#939393] hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-24 bg-[#131313] text-[#939393]
                        hover:text-white rounded-full p-1.5 sm:p-2 flex items-center justify-center
                        border border-[#939393]/20 hover:border-[#ff6200]/50
                        transition-all duration-300 hover:scale-110 hover:shadow-[#ff6200]/30 shadow-lg z-50"
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