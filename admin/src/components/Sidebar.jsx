import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../constants";
import logo from "../assets/logo.png";
import {
    BarChart3,
    PlusCircle,
    ListTodo,
    ShoppingCart,
    ChevronLeft,
    LayoutDashboard,
    LogOut,
    User,
    ShieldCheck
} from "lucide-react";
import PropTypes from "prop-types";

const Sidebar = ({ onWidthChange, onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return window.innerWidth < 1024 ? true : JSON.parse(localStorage.getItem("sidebarCollapsed") || "false");
    });
    const [user, setUser] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    
    const navigate = useNavigate();

    const isEffectivelyExpanded = !isCollapsed || (isCollapsed && isHovering);
    const computedWidthPx = isEffectivelyExpanded ? 260 : 80;

    const fetchUser = useCallback(async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (token) {
                const response = await axios.get(`${backendUrl}/api/user/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data?.success) setUser(response.data.user);
            }
        } catch (error) {
            console.error("Sidebar auth failure", error);
            setUser({ name: "Admin User", email: "admin@zerofashion.com", role: "Admin" });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    useEffect(() => {
        onWidthChange(computedWidthPx);
    }, [computedWidthPx, onWidthChange]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) setIsCollapsed(true);
        };
        window.addEventListener("resize", handleResize);
        fetchUser();
        return () => window.removeEventListener("resize", handleResize);
    }, [fetchUser]);

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        if (onLogout) onLogout();
        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
    };

    const navigationItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/users", icon: User, label: "Users" },
        { path: "/add", icon: PlusCircle, label: "Add Product" },
        { path: "/list", icon: ListTodo, label: "Products" },
        { path: "/orders", icon: ShoppingCart, label: "Orders" },
        { path: "/order-charts", icon: BarChart3, label: "Analytics" },
        { path: "/admin-create", icon: ShieldCheck, label: "Create Admin" },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-[#0f111a] border-r border-slate-800 shadow-xl transition-all duration-300 z-50 ${
                isEffectivelyExpanded ? "w-[260px]" : "w-[80px]"
            }`}
            onMouseEnter={() => window.innerWidth >= 1024 && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="flex flex-col h-full py-6 px-3">
                
                {/* Brand Logo */}
                <div className={`flex items-center gap-3 mb-10 px-2 transition-all duration-300 ${!isEffectivelyExpanded ? "justify-center" : ""}`}>
                    <img src={logo} alt="Zero Fashion" className="h-9 w-9 rounded-lg object-contain bg-white p-1" />
                    {isEffectivelyExpanded && (
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg leading-none">Zero</span>
                            <span className="text-indigo-500 font-semibold text-xs tracking-wide">Fashion Admin</span>
                        </div>
                    )}
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden">
                    {navigationItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group whitespace-nowrap ${
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-md font-medium"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            <item.icon className={`h-5 w-5 shrink-0 ${!isEffectivelyExpanded ? "mx-auto" : ""}`} />
                            {isEffectivelyExpanded && (
                                <span className="text-sm">{item.label}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="mt-auto pt-6 border-t border-slate-800 space-y-3">
                    {user && (
                        <div className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-300 ${!isEffectivelyExpanded ? "justify-center" : "bg-slate-800/50"}`}>
                            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {user.name?.charAt(0).toUpperCase() || "A"}
                            </div>
                            {isEffectivelyExpanded && (
                                <div className="min-w-0 flex-1 overflow-hidden">
                                    <p className="text-white font-medium text-sm truncate">{user.name}</p>
                                    <p className="text-slate-400 text-xs truncate">{user.email}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors ${!isEffectivelyExpanded ? "justify-center" : ""}`}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {isEffectivelyExpanded && <span className="text-sm font-medium">Logout</span>}
                    </button>

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex w-full items-center justify-center py-2 text-slate-500 hover:text-white transition-colors"
                    >
                        <ChevronLeft className={`h-5 w-5 transition-transform duration-300 ${!isEffectivelyExpanded ? "rotate-180" : ""}`} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

Sidebar.propTypes = {
    onWidthChange: PropTypes.func.isRequired,
    onLogout: PropTypes.func,
};

export default Sidebar;