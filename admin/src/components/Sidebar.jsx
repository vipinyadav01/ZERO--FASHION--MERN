import { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { backendUrl } from "../constants";
import Notification from "./Notification";
import {
    BarChart3,
    PlusCircle,
    ListTodo,
    ShoppingCart,
    ChevronLeft,
    LayoutDashboard,
    Users,
    LogOut
} from "lucide-react";

const Sidebar = ({ onWidthChange, handleLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return window.innerWidth < 768 ? true : JSON.parse(localStorage.getItem("sidebar-collapsed")) ?? false;
    });
    const [isHovered, setIsHovered] = useState(false);

    const [user, setUser] = useState({
        name: "",
        email: "",
        role: ""
    });

    const computeWidth = useCallback(() => {
        const isMobile = window.innerWidth < 768;
        const isExpanded = !isCollapsed || isHovered;
        return isMobile ? 64 : isExpanded ? 256 : 64; 
    }, [isCollapsed, isHovered]);
    useEffect(() => {
        if (typeof onWidthChange === "function") {
            onWidthChange(computeWidth());
        }
    }, [isCollapsed, isHovered, onWidthChange, computeWidth]);

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
                        role: u.role || "",
                        profileImage: u.profileImage || "" 
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
                    role: "Administrator",
                    profileImage: "" 
                });
            }
        };
        fetchUser();
        return () => controller.abort();
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
                    fixed inset-y-0 left-0
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
                {/* Header with Logo and Notifications */}
                <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                Z
                            </div>
                            {isExpanded && (
                                <span className="ml-3 text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    Zero Fashion
                                </span>
                            )}
                        </div>
                        
                        {/* Notifications */}
                        {isExpanded && (
                            <div className="flex items-center gap-2">
                                <Notification />
                                {!isMobile && (
                                    <button
                                        onClick={toggleSidebar}
                                        className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                                    >
                                        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
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
                    
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full group/nav relative flex items-center gap-3 px-3 py-3
                            text-slate-300 hover:text-white hover:bg-red-600/20
                            rounded-xl transition-all duration-200 ease-in-out
                            border border-transparent hover:border-red-500/30
                            shadow-sm hover:shadow-md"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0 text-red-400" />
                        <span
                            className={`
                                font-medium text-sm transition-all duration-300 ease-in-out
                                ${isExpanded ? "opacity-100 max-w-full"
                                    : "opacity-0 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:max-w-full"}
                            `}
                        >
                            Logout
                        </span>
                        {!isMobile && isCollapsed && (
                            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800
                                rounded-lg opacity-0 invisible group-hover/nav:visible group-hover/nav:opacity-100 
                                transition-all duration-250 ease-out
                                shadow-lg text-xs whitespace-nowrap z-50 border border-slate-700">
                                Logout
                            </div>
                        )}
                    </button>
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
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name || "Admin"}
                                        className="w-10 h-10 rounded-xl object-cover bg-slate-700
                                            transform group-hover/profile:scale-105 transition-all duration-300
                                            shadow-lg shadow-indigo-500/20"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
                                        flex items-center justify-center
                                        transform group-hover/profile:scale-105 transition-all duration-300
                                        shadow-lg shadow-indigo-500/20">
                                        <span className="text-base font-bold text-white">
                                            {(user.name || "Admin").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                        </span>
                                    </div>
                                )}
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
            </aside>
        </>
    );
};

Sidebar.propTypes = {
    onWidthChange: PropTypes.func,
    handleLogout: PropTypes.func.isRequired,
};

export default Sidebar;