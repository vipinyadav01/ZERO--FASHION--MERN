import { useState, useEffect } from "react";
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
        return window.innerWidth < 768 ? true : JSON.parse(localStorage.getItem("sidebarCollapsed") || "false");
    });
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
        onWidthChange(isCollapsed ? 80 : 280);
    }, [isCollapsed, onWidthChange]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoadingUser(true);
                const token = sessionStorage.getItem("token");
                if (token) {
                    const response = await axios.get(`${backendUrl}/api/user/user`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data?.success && response.data?.user) {
                        setUser(response.data.user);
                    }
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                
                setUser({
                    name: "Admin",
                    email: "admin@zerofashion.com",
                    role: "Administrator"
                });
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        // Clear all storage comprehensively
        sessionStorage.clear();
        localStorage.clear();
        
        // Call parent logout function if provided
        if (onLogout) {
            onLogout();
        }
        
        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
    };

    const navigationItems = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/add", icon: PlusCircle, label: "Add Product" },
        { path: "/list", icon: ListTodo, label: "Product List" },
        { path: "/orders", icon: ShoppingCart, label: "Orders" },
        { path: "/order-charts", icon: BarChart3, label: "Order Charts" },
        { path: "/users", icon: User, label: "User Profile" },
        { path: "/admin-create", icon: Users, label: "Create Admin" },
    ];

    return (
        <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 shadow-2xl backdrop-blur-xl transition-all duration-300 z-50 ${
            isCollapsed ? "w-20" : "w-70"
        }`}>
            {/* Header with Logo */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <div className="flex items-center space-x-3">
                    <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg" />
                    {!isCollapsed && (
                        <div>
                            <h1 className="text-white font-bold text-lg">Zero Fashion</h1>
                            <p className="text-slate-400 text-xs">Admin Panel</p>
                        </div>
                    )}
                </div>
               
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                                isActive
                                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-white shadow-lg"
                                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-slate-700/50">
                {isLoadingUser ? (
                    <div className="mb-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="h-12 w-12 rounded-full bg-slate-700 animate-pulse"></div>
                            {!isCollapsed && (
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-3 bg-slate-700 rounded animate-pulse w-3/4"></div>
                                    <div className="h-3 bg-slate-700 rounded animate-pulse w-1/2"></div>
                                </div>
                            )}
                        </div>
                        <div className="h-10 bg-slate-700 rounded-lg animate-pulse"></div>
                    </div>
                ) : user ? (
                    <div className="mb-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center overflow-hidden shadow-lg">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage}
                                        alt={user.name || "User"}
                                        className="h-12 w-12 object-cover rounded-full"
                                        onError={(e) => {
                                            
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <span 
                                    className={`text-white font-bold text-lg ${user.profileImage ? 'hidden' : 'flex'} items-center justify-center`}
                                    style={{ display: user.profileImage ? 'none' : 'flex' }}
                                >
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </span>
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{user.name || "User"}</p>
                                    <p className="text-slate-400 text-xs truncate">{user.email || "user@example.com"}</p>
                                    <p className="text-indigo-400 text-xs font-medium">{user.role || "User"}</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 text-red-400 hover:text-red-300 border border-red-500/30 transition-all duration-200 group shadow-lg"
                        >
                            <LogOut className="h-4 w-4" />
                            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                        </button>
                    </div>
                ) : null}
            </div>

            <button
                type="button"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors shadow-lg"
                style={{ zIndex: 60 }}
            >
                <ChevronLeft
                    className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                />
            </button>
        </div>
    );
};

Sidebar.propTypes = {
    onWidthChange: PropTypes.func.isRequired,
    onLogout: PropTypes.func,
};

export default Sidebar;