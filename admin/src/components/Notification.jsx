import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import {
    Bell,
    ShoppingCart,
    Package,
    User,
    RefreshCcw,
    Trash2,
    AlertCircle
} from "lucide-react";

/**
 * Notification Component
 * Displays system alerts and activity updates.
 */
const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const notificationRef = useRef(null);

    const formatTime = useCallback((timestamp) => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "N/A";
        
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }, []);

    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem("token");
            if (!token) return;

            // 1. Primary Sync: Fetch real system notifications
            let realNotifications = [];
            try {
                const response = await axios.get(`${backendUrl}/api/notification/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data?.success) {
                    realNotifications = response.data.notifications.map(n => ({
                        ...n,
                        isReal: true
                    }));
                }
            } catch (authErr) {
                console.warn("Notification sync failed", authErr.message);
            }

            // 2. Auxiliary Insights: Sync recent activity
            const processedActivity = [];
            try {
                const [ordersRes, usersRes, stockRes] = await Promise.all([
                    axios.get(`${backendUrl}/api/order/recent`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
                    axios.get(`${backendUrl}/api/user/recent`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
                    axios.get(`${backendUrl}/api/product/low-stock`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
                ]);

                if (ordersRes?.data?.success && ordersRes.data.orders) {
                    ordersRes.data.orders.slice(0, 3).forEach(order => {
                        processedActivity.push({
                            id: `order-${order._id}`,
                            title: 'New Order',
                            message: `Order #${order._id.slice(-6)} received`,
                            time: order.date,
                            read: false,
                            type: "order",
                            isReal: false
                        });
                    });
                }

                if (usersRes?.data?.success && usersRes.data.users) {
                    usersRes.data.users.slice(0, 2).forEach(user => {
                        processedActivity.push({
                            id: `user-${user._id}`,
                            title: 'New User',
                            message: `${user.name || user.email} joined`,
                            time: user.createdAt,
                            read: false,
                            type: "user",
                            isReal: false
                        });
                    });
                }

                if (stockRes?.data?.success && stockRes.data.products) {
                    stockRes.data.products.slice(0, 2).forEach(p => {
                        processedActivity.push({
                            id: `stock-${p._id}`,
                            title: 'Low Stock Alert',
                            message: `${p.name}: ${p.stock || 0} units left`,
                            time: new Date(),
                            read: false,
                            type: "stock",
                            isReal: false
                        });
                    });
                }
            } catch (activityErr) {
                console.warn("Activity sync failed", activityErr.message);
            }

            // Merge and prioritize
            const unified = [...realNotifications, ...processedActivity];
            unified.sort((a, b) => new Date(b.createdAt || b.time) - new Date(a.createdAt || a.time));
            
            setNotifications(unified);
            setUnreadCount(unified.filter(n => !n.read).length);

        } catch (error) {
            console.error('Notification error', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Handle logout cleanup
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token' && !e.newValue) {
                setNotifications([]);
                setUnreadCount(0);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Outside click management
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications]);

    const markAsRead = async (notification) => {
        const { id, _id, isReal } = notification;
        const targetId = isReal ? _id : id;

        // Local State Update
        setNotifications(prev => prev.map(n => (n._id === targetId || n.id === targetId) ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        if (isReal) {
            try {
                const token = sessionStorage.getItem("token");
                await axios.patch(`${backendUrl}/api/notification/${targetId}/read`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.warn("Read status update failed", err.message);
            }
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);

        try {
            const token = sessionStorage.getItem("token");
            await axios.patch(`${backendUrl}/api/notification/mark-all-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.warn("Mark all read failed", err.message);
        }
    };

    const deleteItem = async (notification, e) => {
        e.stopPropagation();
        const { id, _id, isReal } = notification;
        const targetId = isReal ? _id : id;

        setNotifications(prev => prev.filter(n => n._id !== targetId && n.id !== targetId));
        if (!notification.read) setUnreadCount(prev => Math.max(0, prev - 1));

        if (isReal) {
            try {
                const token = sessionStorage.getItem("token");
                await axios.delete(`${backendUrl}/api/notification/${targetId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.warn("Delete failed", err.message);
            }
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <ShoppingCart className="h-4 w-4 text-indigo-400" />;
            case 'stock': return <Package className="h-4 w-4 text-amber-500" />;
            case 'user': return <User className="h-4 w-4 text-emerald-400" />;
            default: return <AlertCircle className="h-4 w-4 text-slate-400" />;
        }
    };

    return (
        <div className="fixed top-6 right-6 z-[100]" ref={notificationRef}>
            <div className="relative group">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-3 rounded-xl bg-[#0f111a] border transition-all duration-200 shadow-lg hover:bg-slate-800 ${showNotifications ? "border-indigo-500 text-white" : "border-slate-800 text-slate-400"}`}
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-indigo-600 rounded-full border-2 border-[#0f111a] flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        </div>
                    )}
                </button>

                {/* Dropdown */}
                {showNotifications && (
                    <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-[#0f111a] border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        
                        {/* Header */}
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                            <h3 className="text-white font-semibold text-sm">Notifications</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={fetchNotifications} disabled={isLoading} className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">
                                    <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                                </button>
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead} className="px-2 py-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                                        Mark all read
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="max-h-[24rem] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell className="h-6 w-6 text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 text-sm">No new notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800">
                                    {notifications.map((n) => (
                                        <div
                                            key={n._id || n.id}
                                            onClick={() => markAsRead(n)}
                                            className={`group relative p-4 transition-colors cursor-pointer hover:bg-slate-900/50 ${
                                                n.read ? 'opacity-70' : 'bg-indigo-900/10'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-0.5 p-2 rounded-lg ${n.read ? "bg-slate-800" : "bg-slate-800/80"} shrink-0`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                                        <p className={`text-sm font-medium truncate ${n.read ? 'text-slate-400' : 'text-slate-200'}`}>
                                                            {n.title}
                                                        </p>
                                                        <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                                            {formatTime(n.createdAt || n.time)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                        {n.message}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={(e) => deleteItem(n, e)}
                                                    className="p-1.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded opacity-0 group-hover:opacity-100 transition-all self-center"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            {!n.read && (
                                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;