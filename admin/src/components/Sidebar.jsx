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
    Users,
    LogOut,
    User
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
    const computedWidthPx = isEffectivelyExpanded ? 280 : 88;

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
            console.error("Sidebar auth telemetry failure", error);
            setUser({ name: "Executive", email: "admin@zerofashion.com", role: "Super Admin" });
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
        toast.success("Identity session terminated");
        navigate("/login", { replace: true });
    };

    const navigationItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Overview" },
        { path: "/users", icon: User, label: "Registry" },
        { path: "/add", icon: PlusCircle, label: "Propose Asset" },
        { path: "/list", icon: ListTodo, label: "Asset Vault" },
        { path: "/orders", icon: ShoppingCart, label: "Order Hub" },
        { path: "/order-charts", icon: BarChart3, label: "Market Pulse" },
        { path: "/admin-create", icon: Users, label: "Teams" },
    ];

    return (
        <aside
            className={`fixed left-0 top-0 h-full bg-[#0a0a0f] border-r border-slate-800/60 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-[100] ${
                isEffectivelyExpanded ? "w-72" : "w-[88px]"
            }`}
            onMouseEnter={() => window.innerWidth >= 1024 && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="flex flex-col h-full py-8 px-4">
                
                {/* Brand Logo */}
                <div className={`flex items-center gap-4 mb-12 px-2 transition-all duration-300 ${!isEffectivelyExpanded ? "justify-center" : ""}`}>
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <img src={logo} alt="Zero Fashion" className="relative h-10 w-10 rounded-xl object-contain bg-black p-1 border border-slate-700/50" />
                    </div>
                    {isEffectivelyExpanded && (
                        <div className="flex flex-col">
                            <span className="text-white font-black text-xl tracking-tighter uppercase leading-none italic">Zero</span>
                            <span className="text-indigo-500 font-bold text-xs uppercase tracking-widest mt-0.5">Fashion</span>
                        </div>
                    )}
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 space-y-1.5 custom-scrollbar overflow-y-auto overflow-x-hidden">
                    {navigationItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-3 py-3.5 rounded-2xl transition-all duration-300 group outline-none overflow-hidden ${
                                    isActive
                                        ? "bg-indigo-600/10 text-white border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]"
                                        : "text-slate-500 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"
                                }`
                            }
                        >
                            <div className={`transition-transform duration-300 group-active:scale-90 ${!isEffectivelyExpanded ? "mx-auto" : ""}`}>
                                <item.icon className={`h-6 w-6 stroke-[1.5px] transition-colors ${!isEffectivelyExpanded ? "group-hover:text-indigo-400" : ""}`} />
                            </div>
                            {isEffectivelyExpanded && (
                                <span className="font-bold text-sm tracking-tight uppercase whitespace-nowrap italic">{item.label}</span>
                            )}
                            {isEffectivelyExpanded && (
                                <div className="ml-auto w-1 h-3 rounded-full bg-indigo-500 opacity-0 group-[.active]:opacity-100 transition-opacity"></div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Section */}
                <div className="mt-auto pt-8 border-t border-slate-800/50 space-y-4">
                    {user && (
                        <div className={`flex items-center gap-4 p-2 rounded-2xl transition-all duration-300 ${!isEffectivelyExpanded ? "justify-center" : "bg-slate-800/20"}`}>
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                                    {user.name?.charAt(0) || "E"}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0a0a0f] rounded-full shadow-sm"></div>
                            </div>
                            {isEffectivelyExpanded && (
                                <div className="min-w-0 flex-1">
                                    <p className="text-white font-black text-[10px] truncate uppercase tracking-wider italic">{user.name}</p>
                                    <p className="text-slate-500 text-[9px] truncate tracking-tight">{user.email}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-1">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all group duration-300 ${!isEffectivelyExpanded ? "justify-center" : ""}`}
                        >
                            <LogOut className="h-6 w-6 stroke-[1.5px]" />
                            {isEffectivelyExpanded && <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>}
                        </button>
                    </div>

                    {/* Collapse Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex w-full items-center justify-center py-2 text-slate-600 hover:text-white transition-colors"
                    >
                        <ChevronLeft className={`h-5 w-5 transition-transform duration-500 ${!isEffectivelyExpanded ? "rotate-180" : ""}`} />
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