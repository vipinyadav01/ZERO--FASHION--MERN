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

            // Primary Sync: Fetch real system notifications
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

            // Order by most recent
            realNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            setNotifications(realNotifications);
            setUnreadCount(realNotifications.filter(n => !n.read).length);

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
            case 'order': return <ShoppingCart className="h-4 w-4 text-black" />;
            case 'stock': return <Package className="h-4 w-4 text-black" />;
            case 'user': return <User className="h-4 w-4 text-black" />;
            default: return <AlertCircle className="h-4 w-4 text-brand-text-secondary" />;
        }
    };

    return (
        <div className="fixed top-8 right-8 z-[100]" ref={notificationRef}>
            <div className="relative group">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`relative p-3.5 rounded-none bg-white border transition-all duration-300 shadow-none hover:border-black ${showNotifications ? "border-black text-black" : "border-brand-border text-brand-text-secondary"}`}
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-black rounded-none border-2 border-white flex items-center justify-center">
                            <span className="text-[10px] font-black text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        </div>
                    )}
                </button>

                {/* Dropdown */}
                {showNotifications && (
                    <div className="absolute top-full right-0 mt-6 w-80 sm:w-96 bg-white border border-brand-border rounded-none shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        
                        {/* Header */}
                        <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-surface">
                            <h3 className="text-brand-text-primary font-black text-[10px] uppercase tracking-widest">Protocol Alerts</h3>
                            <div className="flex items-center gap-4">
                                <button onClick={fetchNotifications} disabled={isLoading} className="p-2 text-brand-text-secondary hover:text-black transition-colors rounded-none hover:bg-white border hover:border-brand-border">
                                    <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                                </button>
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead} className="text-[9px] font-black uppercase tracking-widest text-brand-text-secondary hover:text-black transition-colors underline underline-offset-4">
                                        Clear Archive
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="py-16 text-center">
                                    <div className="w-16 h-16 bg-brand-surface border border-brand-border rounded-none flex items-center justify-center mx-auto mb-6">
                                        <Bell className="h-8 w-8 text-brand-text-secondary/30" />
                                    </div>
                                    <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">No Active Transmissions</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-brand-border">
                                    {notifications.map((n) => (
                                        <div
                                            key={n._id || n.id}
                                            onClick={() => markAsRead(n)}
                                            className={`group relative p-5 transition-all cursor-pointer hover:bg-brand-surface ${
                                                n.read ? 'opacity-40' : 'bg-white'
                                            }`}
                                        >
                                            <div className="flex items-start gap-5">
                                                <div className={`mt-0.5 p-2.5 rounded-none border ${n.read ? "bg-brand-surface border-brand-border" : "bg-white border-black"} shrink-0 transition-colors`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-3 mb-1.5">
                                                        <p className={`text-[10px] font-black uppercase tracking-tight truncate ${n.read ? 'text-brand-text-secondary' : 'text-brand-text-primary'}`}>
                                                            {n.title}
                                                        </p>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-text-secondary whitespace-nowrap">
                                                            {formatTime(n.createdAt || n.time)}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-text-secondary/70 line-clamp-2 leading-relaxed">
                                                        {n.message}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={(e) => deleteItem(n, e)}
                                                    className="p-2 text-brand-text-secondary hover:text-red-600 border border-transparent hover:border-red-100 rounded-none opacity-0 group-hover:opacity-100 transition-all self-center"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            {!n.read && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-black"></div>
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