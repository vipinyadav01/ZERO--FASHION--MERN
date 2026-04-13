import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../constants';
import logo from '../assets/logo.png';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    PlusSquare,
    BarChart3,
    Boxes,
    Settings,
    ShieldCheck,
    LogOut,
    ChevronLeft,
} from 'lucide-react';
import PropTypes from 'prop-types';

const NAV = [
    { path: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/analytics',   icon: BarChart3,        label: 'Analytics' },
    { divider: true, label: 'Catalog' },
    { path: '/list',        icon: Package,          label: 'Products' },
    { path: '/add',         icon: PlusSquare,       label: 'Add Product' },
    { path: '/inventory',   icon: Boxes,            label: 'Inventory' },
    { divider: true, label: 'Operations' },
    { path: '/orders',      icon: ShoppingBag,      label: 'Orders' },
    { path: '/users',       icon: Users,            label: 'Users' },
    { divider: true, label: 'Admin' },
    { path: '/admin-create',icon: ShieldCheck,      label: 'Create Admin' },
    { path: '/settings',    icon: Settings,         label: 'Settings' },
];

const Sidebar = ({ onWidthChange, onLogout }) => {
    const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024);
    const [hovering, setHovering] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const expanded = !collapsed || hovering;
    const width = expanded ? 240 : 64;

    const fetchUser = useCallback(async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                const res = await axios.get(`${backendUrl}/api/user/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data?.success) setUser(res.data.user);
            }
        } catch {
            setUser({ name: 'Admin', email: 'admin@zerofashion.com' });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    }, [collapsed]);

    useEffect(() => {
        onWidthChange(width);
    }, [width, onWidthChange]);

    useEffect(() => {
        const onResize = () => { if (window.innerWidth < 1024) setCollapsed(true); };
        window.addEventListener('resize', onResize);
        fetchUser();
        return () => window.removeEventListener('resize', onResize);
    }, [fetchUser]);

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        if (onLogout) onLogout();
        toast.success('Logged out');
        navigate('/login', { replace: true });
    };

    return (
        <aside
            style={{ width }}
            className="fixed left-0 top-0 h-full bg-white border-r border-brand-border z-50 transition-all duration-300 flex flex-col"
            onMouseEnter={() => window.innerWidth >= 1024 && setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {/* Brand */}
            <div className={`flex items-center gap-3 px-4 py-5 border-b border-brand-border ${!expanded ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                    <img src={logo} alt="Zero" className="w-full h-full object-contain" />
                </div>
                {expanded && (
                    <div>
                        <p className="text-sm font-black text-brand-text-primary leading-none tracking-tight">Zero</p>
                        <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">Fashion Admin</p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2">
                {NAV.map((item, i) => {
                    if (item.divider) {
                        return expanded ? (
                            <div key={i} className="px-3 pt-4 pb-1.5">
                                <p className="text-[8px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">{item.label}</p>
                            </div>
                        ) : (
                            <div key={i} className="my-2 border-t border-brand-border mx-2" />
                        );
                    }
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 transition-all duration-150 border-l-2 mb-0.5 ${
                                    isActive
                                        ? 'bg-[#F8F8F6] border-[#1A1A1A] text-brand-text-primary'
                                        : 'border-transparent text-brand-text-secondary hover:bg-[#F8F8F6] hover:text-brand-text-primary'
                                } ${!expanded ? 'justify-center' : ''}`
                            }
                        >
                            <item.icon className="w-4 h-4 shrink-0" />
                            {expanded && (
                                <span className="text-[11px] font-bold uppercase tracking-wide whitespace-nowrap">{item.label}</span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-brand-border p-2 space-y-1">
                {user && expanded && (
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-[#F8F8F6] mb-1">
                        <div className="w-7 h-7 bg-[#1A1A1A] flex items-center justify-center text-white text-[10px] font-black shrink-0">
                            {user.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-brand-text-primary truncate">{user.name}</p>
                            <p className="text-[9px] text-brand-text-secondary truncate">{user.email}</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 transition-colors ${!expanded ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {expanded && <span className="text-[11px] font-bold uppercase tracking-wide">Logout</span>}
                </button>

                <button
                    onClick={() => setCollapsed(c => !c)}
                    className="hidden lg:flex w-full items-center justify-center py-2 text-brand-text-secondary hover:text-brand-text-primary transition-colors"
                >
                    <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!expanded ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </aside>
    );
};

Sidebar.propTypes = {
    onWidthChange: PropTypes.func.isRequired,
    onLogout: PropTypes.func,
};

export default Sidebar;
