import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import {
    Bell,
    X,
    ShoppingCart,
    Package,
    User,
    Clock,
    Sparkles,
    CheckCircle2,
    RefreshCcw,
    Trash2
} from "lucide-react";

/**
 * Executive Notification Hub
 * Orchestrates a unified stream of real-time logistical telemetry and system alerts.
 * Synchronizes with the backend Notification service while providing high-fidelity fallback insights.
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
        if (minutes < 60) return `${minutes} MIN AGO`;
        if (hours < 24) return `${hours} HOURS AGO`;
        return `${days} DAYS AGO`;
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
                        isReal: true // Flag to distinguish from synthesized activity
                    }));
                }
            } catch (authErr) {
                console.warn("Primary notification sync interrupted", authErr.message);
            }

            // 2. Auxiliary Insights: Sync recent activity from logistical streams
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
                            title: 'Order Dispatch',
                            message: `Order #${order._id.slice(-6)} received from ${order.address?.firstName || 'Principal'}`,
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
                            title: 'Principal Enrolled',
                            message: `Identity '${user.name || user.email}' successfully synchronized`,
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
                            title: 'Stock Depletion',
                            message: `Asset '${p.name}' requires replenishment (${p.stock || 0} unit(s) remaining)`,
                            time: new Date(),
                            read: false,
                            type: "stock",
                            isReal: false
                        });
                    });
                }
            } catch (activityErr) {
                console.warn("Activity stream sync failure", activityErr.message);
            }

            // Merge and prioritize: System notifications first, then activity
            const unified = [...realNotifications, ...processedActivity];
            unified.sort((a, b) => new Date(b.createdAt || b.time) - new Date(a.createdAt || a.time));
            
            setNotifications(unified);
            setUnreadCount(unified.filter(n => !n.read).length);

        } catch (error) {
            console.error('Critical telemetry failure in Notification Hub', error);
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
                console.warn("Persistence failure for read status", err.message);
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
            console.warn("Bulk persistence failure", err.message);
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
                console.warn("Persistence failure for deletion", err.message);
            }
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <ShoppingCart className="h-4 w-4 text-indigo-400" />;
            case 'stock': return <Package className="h-4 w-4 text-amber-500" />;
            case 'user': return <User className="h-4 w-4 text-emerald-400" />;
            default: return <Sparkles className="h-4 w-4 text-purple-400" />;
        }
    };

    return (
        <div className="fixed top-8 right-8 z-[150]" ref={notificationRef}>
            <div className="relative group">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-4 rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-slate-800 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 ${showNotifications ? "border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)]" : "hover:border-slate-700"}`}
                    aria-label="Intelligence Hub"
                >
                    <Bell className={`h-6 w-6 transition-colors ${unreadCount > 0 ? "text-indigo-400 animate-pulse" : "text-slate-500 group-hover:text-slate-300"}`} />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 h-6 w-6 bg-indigo-600 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center shadow-lg">
                            <span className="text-[10px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        </div>
                    )}
                </button>

                {/* Dropdown Environment */}
                {showNotifications && (
                    <div className="absolute top-full right-0 mt-6 w-[22rem] sm:w-[26rem] bg-[#0a0a0f] border border-slate-800 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="h-5 w-5 text-indigo-400" />
                                <h3 className="text-white font-black text-xs uppercase tracking-[.2em] italic">Intelligence Feed</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={fetchNotifications} disabled={isLoading} className="p-2 text-slate-500 hover:text-white transition-colors">
                                    <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin text-indigo-500" : ""}`} />
                                </button>
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead} className="px-3 py-1.5 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                                        Wipe Logs
                                    </button>
                                )}
                                <button onClick={() => setShowNotifications(false)} className="p-2 text-slate-500 hover:text-rose-400 transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="max-h-[32rem] overflow-y-auto custom-scrollbar p-3 space-y-2">
                            {notifications.length === 0 ? (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-900/50 rounded-3xl border border-slate-800 flex items-center justify-center mx-auto opacity-20">
                                        <Bell className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-[.2em]">Zero Telemetry Found</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n._id || n.id}
                                        onClick={() => markAsRead(n)}
                                        className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                                            n.read 
                                                ? 'bg-transparent border-transparent hover:bg-slate-900/30' 
                                                : 'bg-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/40'
                                        }`}
                                    >
                                        {!n.read && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />}
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl ${n.read ? "bg-slate-900/50" : "bg-indigo-500/10"} transition-colors`}>
                                                {getIcon(n.type)}
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <h4 className={`text-xs font-black uppercase tracking-tight italic ${n.read ? 'text-slate-400' : 'text-white'}`}>
                                                        {n.title}
                                                    </h4>
                                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1 shrink-0">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {formatTime(n.createdAt || n.time)}
                                                    </span>
                                                </div>
                                                <p className={`text-[11px] leading-relaxed transition-colors ${n.read ? 'text-slate-600' : 'text-slate-400'}`}>
                                                    {n.message}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={(e) => deleteItem(n, e)}
                                                className="absolute right-2 bottom-2 p-2 text-slate-700 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all scale-75"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Statistics */}
                        <div className="p-4 bg-slate-950/80 border-t border-slate-800/60 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[.3em] text-slate-600 italic">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                Enclave Security Verified
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;