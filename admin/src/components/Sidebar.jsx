import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
        return JSON.parse(localStorage.getItem("sidebar-collapsed")) ?? false;
    });
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const user = {
        name: "Vipin Yadav",
        email: import.meta.env.ADMIN_EMAIL || "admin@zerofashion.com",
        role: "Administrator",
    };

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    const toggleSidebar = () => setIsCollapsed(prev => !prev);


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

    return (
        <>
            <aside
                className={`
                    fixed inset-y-0 left-0
                    ${isExpanded ? "w-64 md:w-72" : "w-16 md:w-20"}
                    bg-gradient-to-b from-[#1a1a1a] to-[#131313]
                    text-white shadow-2xl
                    transition-all duration-300 ease-in-out
                    z-50 flex flex-col
                    md:hover:w-72 group
                `}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Logo Area */}
                <div className="p-4 md:p-6 flex items-center">
                    <div className="flex items-center w-full pt-12 md:pt-14">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ff6200]
                            rounded-xl flex items-center justify-center shadow-lg
                            border-2 border-white/20 flex-shrink-0
                            transform hover:rotate-6 transition-all duration-300">
                            <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <h1 className={`ml-3 font-bold text-xl md:text-2xl transition-all duration-300
                            ${isExpanded ? "opacity-100" : "opacity-0 w-0 hidden md:group-hover:block"}`}>
                            Admin Portal
                        </h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 md:px-4 py-6 space-y-2">
                    {navItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.to}
                            className={({ isActive }) => `
                                flex items-center px-3 py-3 rounded-xl
                                transition-all duration-300 group relative
                                ${isActive
                                    ? "bg-[#ff6200] text-white shadow-md"
                                    : "text-[#939393] hover:bg-white/5 hover:text-white"}
                            `}
                        >
                            <div className="w-8 flex-shrink-0">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className={`ml-3 font-medium text-sm md:text-base
                                ${isExpanded ? "opacity-100" : "opacity-0 w-0 hidden md:group-hover:block"}`}>
                                {item.text}
                            </span>
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#1a1a1a]
                                    rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200
                                    shadow-lg text-sm hidden md:block">
                                    {item.text}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Section */}
                                <div className={`p-4 mt-auto border-t border-white/10 backdrop-blur-sm
                                    ${isExpanded ? "block" : "hidden md:group-hover:block"}
                                    transition-all duration-300 ease-in-out`}>
                                    <div className="flex items-center gap-4 group/profile">
                                        <div className="relative">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff6200] to-[#ff8534]
                                                flex items-center justify-center
                                                transform hover:scale-105 transition-all duration-300
                                                shadow-lg shadow-[#ff6200]/20">
                                                <span className="text-lg font-bold text-white">
                                                    {user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                                </span>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 
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

                                {/* Toggle Button - Hidden on desktop */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-24 bg-[#131313]
                        text-[#939393] hover:text-[#ff6200] rounded-full p-2
                        border border-white/20 hover:border-[#ff6200]/50
                        transition-all duration-300 md:hidden"
                >
                    <ChevronLeft className={`w-5 h-5 ${isCollapsed ? "rotate-180" : ""}`} />
                </button>
            </aside>

            {/* Main Content Padding */}
            <div className={`${isExpanded ? "md:ml-72" : "md:ml-20"} ml-16 transition-all duration-300`}></div>
        </>
    );
};

export default Sidebar;