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
        setIsCollapsed(prev => !prev);
    };

    const handleMouseEnter = () => isCollapsed && setIsHovered(true);
    const handleMouseLeave = () => isCollapsed && setIsHovered(false);

    const navItems = [
        { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
        { to: "/order-charts", icon: BarChart3, text: "Analytics" },
        { to: "/add", icon: PlusCircle, text: "Add Items" },
        { to: "/list", icon: ListTodo, text: "Inventory" },
        { to: "/orders", icon: ShoppingCart, text: "Orders" },
        { to: "/UserProfile", icon: Users, text: "Users" },
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
                    bg-gradient-to-b from-[#1a1a1a] to-[#131313]
                    text-white shadow-2xl
                    transition-all duration-300 ease-in-out
                    z-40 flex flex-col
                    ${isMobile ? "" : "md:hover:w-64 group"}
                `}
                onMouseEnter={isMobile ? undefined : handleMouseEnter}
                onMouseLeave={isMobile ? undefined : handleMouseLeave}
            >
                {/* Navigation */}
                <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto scrollbar-thin 
                    scrollbar-thumb-[#939393]/20 scrollbar-track-transparent">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            className={({ isActive }) => `
                                flex items-center px-3 py-3 rounded-xl
                                transition-all duration-300 group/nav relative
                                ${isActive
                                    ? "bg-[#ff6200] text-white shadow-md"
                                    : "text-[#939393] hover:bg-[#1a1a1a] hover:text-white"}
                            `}
                        >
                            <div className="w-8 flex-shrink-0 flex justify-center">
                                <item.icon className={`${isMobile ? "w-6 h-6" : "w-5 h-5"}`} />
                            </div>
                            {!isMobile && (
                                <span className={`ml-3 font-medium text-sm whitespace-nowrap
                                    ${isExpanded ? "opacity-100" : "opacity-0 w-0 invisible group-hover:visible group-hover:opacity-100 group-hover:w-auto"}`}>
                                    {item.text}
                                </span>
                            )}
                            {!isMobile && isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a]
                                    rounded-md opacity-0 invisible group-hover/nav:visible group-hover/nav:opacity-100 transition-all duration-200
                                    shadow-lg text-xs whitespace-nowrap z-50">
                                    {item.text}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Section (Hidden on Mobile) */}
                {!isMobile && (
                    <div className={`p-3 mb-2 mt-auto border-t border-[#939393]/10 backdrop-blur-sm
                        ${isExpanded ? "block" : "hidden group-hover:block"}
                        transition-all duration-300 ease-in-out`}>
                        <div className="flex items-center gap-3 group/profile">
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6200] to-[#ff8534]
                                    flex items-center justify-center
                                    transform group-hover/profile:scale-105 transition-all duration-300
                                    shadow-lg shadow-[#ff6200]/20">
                                    <span className="text-base font-bold text-white">
                                        {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                    </span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 
                                    rounded-full border-2 border-[#1a1a1a]"></div>
                            </div>
                            <div className="flex-1 min-w-0 group-hover/profile:translate-x-1 transition-transform duration-300">
                                <h4 className="text-sm font-semibold text-white truncate tracking-wide">
                                    {user.name}
                                </h4>
                                <p className="text-xs font-medium text-[#939393] truncate">
                                    {user.role}
                                </p>
                                <p className="text-xs text-[#939393]/80 truncate hover:text-[#ff6200] 
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
                            bg-[#131313] 
                            text-[#939393] hover:text-[#ff6200] rounded-full p-1.5
                            border border-[#939393]/20 hover:border-[#ff6200]/50
                            transition-all duration-300 shadow-md hidden md:block"
                    >
                        <ChevronLeft className={`w-4 h-4 ${isCollapsed ? "rotate-180" : ""}`} />
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