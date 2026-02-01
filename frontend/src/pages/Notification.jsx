import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    ChevronLeft,
    AlertCircle,
    Package,
    CreditCard,
    Heart,
    Tag
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const animations = {
    container: {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    },
    item: {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }
};

// Helper functions moved outside component to avoid recreation on every render
const getIconByType = (type) => {
    switch (type) {
        case "order":
            return Package;
        case "payment":
            return CreditCard;
        case "wishlist":
            return Heart;
        case "promo":
            return Tag;
        case "account":
            return AlertCircle;
        default:
            return Bell;
    }
};

const getColorByType = (type) => {
    switch (type) {
        case "order":
            return "text-blue-600";
        case "payment":
            return "text-green-600";
        case "wishlist":
            return "text-red-600";
        case "promo":
            return "text-purple-600";
        case "account":
            return "text-yellow-600";
        default:
            return "text-gray-600";
    }
};

const getBgByType = (type) => {
    switch (type) {
        case "order":
            return "bg-blue-50";
        case "payment":
            return "bg-green-50";
        case "wishlist":
            return "bg-red-50";
        case "promo":
            return "bg-purple-50";
        case "account":
            return "bg-yellow-50";
        default:
            return "bg-gray-50";
    }
};

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const Icon = getIconByType(notification.type);
    const color = getColorByType(notification.type);
    const bg = getBgByType(notification.type);

    return (
        <motion.div
            variants={animations.item}
            layout
            className={`
                relative p-4 rounded-lg border transition-all duration-200
                ${notification.read ? 'bg-white' : bg}
                ${isHovered ? 'shadow-md' : 'shadow-sm'}
            `}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${bg}`}>
                    <Icon className={`${color}`} size={20} />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                {notification.title}
                            </h3>
                            <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                                {notification.message}
                            </p>
                        </div>
                        <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.createdAt)}
                        </span>
                    </div>

                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 mt-2"
                            >
                                {!notification.read && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onMarkAsRead(notification._id)}
                                        className="text-xs text-indigo-600 hover:text-indigo-700"
                                    >
                                        Mark as read
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onDelete(notification._id)}
                                    className="text-xs text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get token from localStorage
    const token = localStorage.getItem("token");

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/notification/user?limit=50`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }

            const data = await response.json();
            if (data.notifications) {
                setNotifications(data.notifications);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/notification/${id}/read`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif._id === id ? { ...notif, read: true } : notif
                    )
                );
            }
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/notification/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setNotifications(prev => prev.filter(notif => notif._id !== id));
            }
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/notification/mark-all-read`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, read: true }))
                );
            }
        } catch (err) {
            console.error("Error marking all as read:", err);
        }
    };

    const handleClearAll = async () => {
        try {
            // Delete all notifications
            await Promise.all(
                notifications.map(notif =>
                    fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/notification/${notif._id}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                )
            );
            setNotifications([]);
        } catch (err) {
            console.error("Error clearing all notifications:", err);
        }
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === "unread") return !notif.read;
        if (filter === "read") return notif.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!token) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Please log in</h2>
                    <p className="text-gray-600 mb-4">You need to be logged in to view notifications</p>
                    <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="text-gray-600 hover:text-indigo-600">
                                <ChevronLeft size={24} />
                            </Link>
                            <h1 className="text-2xl font-semibold">Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="px-2 py-1 bg-indigo-600 text-white text-sm rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Controls */}
                {!loading && notifications.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Notifications</option>
                                <option value="unread">Unread</option>
                                <option value="read">Read</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleMarkAllAsRead}
                                className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md"
                            >
                                Mark all as read
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleClearAll}
                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                            >
                                Clear all
                            </motion.button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="animate-spin inline-block w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full"></div>
                        <p className="text-gray-500 mt-4">Loading notifications...</p>
                    </div>
                )}

                {/* Notifications List */}
                {!loading && (
                    <motion.div
                        variants={animations.container}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        <AnimatePresence>
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map(notification => (
                                    <NotificationItem
                                        key={notification._id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                        onDelete={handleDelete}
                                    />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <Bell size={48} className="mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900">
                                        No notifications
                                    </h3>
                                    <p className="text-gray-500">
                                        You're all caught up! Check back later for new updates.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
