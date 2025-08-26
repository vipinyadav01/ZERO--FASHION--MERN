import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
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

const Sidebar = ({ onWidthChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return window.innerWidth < 768 ? true : JSON.parse(localStorage.getItem("sidebar-collapsed")) ?? false;
    });
    const [isHovered, setIsHovered] = useState(false);

    const [user, setUser] = useState({
        name: "",
        email: "",
        role: ""
    });

    const computeWidth = () => {
        const isMobile = window.innerWidth < 768;
        const isExpanded = !isCollapsed || isHovered;
        return isMobile ? 64 : isExpanded ? 256 : 64; 
    };
    useEffect(() => {
        if (typeof onWidthChange === "function") {
            onWidthChange(computeWidth());
        }
    }, [isCollapsed, isHovered]);

    useEffect(() => {
        const controller = new AbortController();
        const fetchUser = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) return;
                const res = await axios.get(`${backendUrl}/api/user/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal
                });
                if (res.data?.success && res.data?.user) {
                    const u = res.data.user;
                    setUser({
                        name: u.name || "",
                        email: u.email || "",
                        role: u.role || ""
                    });
                } else {
                    throw new Error(res.data?.message || "Failed to load user");
                }
            } catch (err) {
                const message = err.response?.data?.message || err.message || "Failed to load user";
                toast.error(message);
                setUser({
                    name: "Admin",
                    email: "admin@zerofashion.com",
                    role: "Administrator"
                });
            }
        };
        fetchUser();
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", JSON.stringify(isCollapsed));
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
            if (typeof onWidthChange === "function") {
                onWidthChange(computeWidth());
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCollapsed, isHovered]);

    const toggleSidebar = () => {
        setIsHovered(false);
        setIsCollapsed(prev => !prev);
        if (typeof onWidthChange === "function") {
            // width will also update via effect; call immediately for snappier UI
            onWidthChange(isCollapsed ? 256 : 64);
        }
    };

    const handleMouseEnter = () => {
        if (window.innerWidth >= 768 && isCollapsed) {
            setIsHovered(true);
        }
    };
    
    const handleMouseLeave = () => {
        if (window.innerWidth >= 768 && isCollapsed) {
            setIsHovered(false);
        }
    };

    const navItems = [
        { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
        { to: "/order-charts", icon: BarChart3, text: "Analytics" },
        { to: "/add", icon: PlusCircle, text: "Add Items" },
        { to: "/list", icon: ListTodo, text: "Inventory" },
        { to: "/orders", icon: ShoppingCart, text: "Orders" },
        { to: "/userprofile", icon: Users, text: "Users" },
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
                                        {(user.name || "Admin").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
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
                                    {user.name || "Admin"}
                                </h4>
                                <p className="text-xs font-medium text-slate-400 truncate">
                                    {user.role || "Administrator"}
                                </p>
                                <p className="text-xs text-slate-500 truncate hover:text-indigo-400 
                                    transition-colors duration-300">
                                    {user.email || "admin@zerofashion.com"}
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
        </>
    );
};

export default Sidebar;