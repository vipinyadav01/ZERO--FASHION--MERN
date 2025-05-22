import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
    BarChart3,
    PlusCircle,
    ListTodo,
    ShoppingCart,
    ChevronLeft,
    LayoutDashboard,
    Users,
    Settings,
    HelpCircle
} from "lucide-react";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return window.innerWidth < 768 ? true : JSON.parse(localStorage.getItem("sidebar-collapsed")) ?? false;
    });
    const [isHovered, setIsHovered] = useState(false);

    const user = {
        name: "Vipin Yadav",
        email: import.meta.env.ADMIN_EMAIL || "admin@zerofashion.com",
        role: "Administrator",
    };

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isCollapsed]);

    const toggleSidebar = () => {
        // Explicitly set isHovered to false when collapsing to prevent expanded state
        setIsHovered(false);
        setIsCollapsed(prev => !prev);
    };

    const handleMouseEnter = () => {
        if (isCollapsed) {
            setIsHovered(true);
        }
    };
    
    const handleMouseLeave = () => {
        if (isCollapsed) {
            setIsHovered(false);
        }
    };

    const navItems = [
        { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
        { to: "/order-charts", icon: BarChart3, text: "Analytics" },
        { to: "/add", icon: PlusCircle, text: "Add Items" },
        { to: "/list", icon: ListTodo, text: "Inventory" },
        { to: "/orders", icon: ShoppingCart, text: "Orders" },
    ];

    const isExpanded = !isCollapsed || isHovered;
    const isMobile = window.innerWidth < 768;

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 pt-16
                    ${isMobile ? "w-16" : isExpanded ? "w-64" : "w-16"}
                    bg-slate-800 border-r border-slate-700
                    text-white shadow-xl
                    transition-all duration-300 ease-in-out
                    z-40 flex flex-col
                    ${isMobile ? "" : "md:group"}
                `}
                onMouseEnter={isMobile ? undefined : handleMouseEnter}
                onMouseLeave={isMobile ? undefined : handleMouseLeave}
            >
                {/* Navigation */}
                <nav className="flex-1 px-2 py-5 space-y-2 overflow-y-auto scrollbar-thin 
                    scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {navItems.map((item, index) => {
                        return (
                            <NavLink
                                key={index}
                                to={item.to}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-2xl
                                    transition-all duration-300 group/nav relative
                                    hover:bg-slate-700/50
                                    ${isActive
                                        ? "bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-xl"
                                        : "text-slate-300 hover:text-white"}
                                `}
                            >
                                <div className="w-6 flex-shrink-0 flex justify-center opacity-80 group-hover/nav:opacity-100">
                                    <item.icon className={`${isMobile ? "w-6 h-6" : "w-5 h-5"}`} />
                                </div>
                                <span 
                                    className={`
                                        font-medium text-sm whitespace-nowrap
                                        transition-all duration-300
                                        ${isExpanded 
                                            ? "opacity-100 max-w-full" 
                                            : "opacity-0 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:max-w-full"}
                                    `}
                                >
                                    {item.text}
                                </span>
                                {!isMobile && isCollapsed && (
                                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800
                                        rounded-lg opacity-0 invisible group-hover/nav:visible group-hover/nav:opacity-100 
                                        transition-all duration-250 ease-out
                                        shadow-lg text-xs whitespace-nowrap z-50 border border-slate-700">
                                        {item.text}
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User Profile Section (Hidden on Mobile) */}
                {!isMobile && (
                    <div className={`
                        p-3 mb-2 mt-auto border-t border-slate-700
                        transition-all duration-300 ease-in-out
                        ${isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"} 
                    `}>
                        <div className="flex items-center gap-3 group/profile">
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
                                    flex items-center justify-center
                                    transform group-hover/profile:scale-105 transition-all duration-300
                                    shadow-lg shadow-indigo-500/20">
                                    <span className="text-base font-bold text-white">
                                        {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                    </span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 
                                    rounded-full border-2 border-slate-800"></div>
                            </div>
                            <div className={`
                                flex-1 min-w-0 transition-all duration-300
                                ${isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                            `}>
                                <h4 className="text-sm font-semibold text-white truncate tracking-wide">
                                    {user.name}
                                </h4>
                                <p className="text-xs font-medium text-slate-400 truncate">
                                    {user.role}
                                </p>
                                <p className="text-xs text-slate-500 truncate hover:text-indigo-400 
                                    transition-colors duration-300">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Toggle Button (Desktop Only) */}
                {!isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-20
                            bg-slate-700 
                            text-slate-300 hover:text-indigo-400 rounded-full p-1.5
                            border border-slate-600 hover:border-indigo-500
                            transition-all duration-300 shadow-md hidden md:block z-50"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
                    </button>
                )}
            </aside>

            {/* Main Content Padding */}
            <div 
                className={`pt-16 ${isMobile ? "ml-16" : isExpanded ? "ml-64" : "ml-16"} transition-all duration-300`}
            ></div>
        </>
    );
};

export default Sidebar;