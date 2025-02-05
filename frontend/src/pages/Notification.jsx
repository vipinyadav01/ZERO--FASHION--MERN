import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    Clock,
    ChevronLeft,
    CheckCircle,
    AlertCircle,
    Package,
    CreditCard,
    Heart,
    ShoppingBag,
    User,
    Settings,
    Trash2,
    Badge,
    Tag
} from "lucide-react";
import { Link } from "react-router-dom";

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

// Demo notifications data
const generateDemoNotifications = (currentDate) => {
    const date = new Date(currentDate);

    return [
        {
            id: 1,
            type: "order",
            title: "Order Delivered",
            message: "Your order #12345 has been delivered successfully",
            icon: Package,
            color: "text-green-600",
            bg: "bg-green-50",
            timestamp: new Date(date.getTime() - 5 * 60000).toISOString(), // 5 minutes ago
            isRead: false
        },
        {
            id: 2,
            type: "payment",
            title: "Payment Successful",
            message: "Payment of $299.99 was processed successfully",
            icon: CreditCard,
            color: "text-blue-600",
            bg: "bg-blue-50",
            timestamp: new Date(date.getTime() - 30 * 60000).toISOString(), // 30 minutes ago
            isRead: true
        },
        {
            id: 3,
            type: "wishlist",
            title: "Item Back in Stock",
            message: "An item from your wishlist is now available",
            icon: Heart,
            color: "text-red-600",
            bg: "bg-red-50",
            timestamp: new Date(date.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
            isRead: false
        },
        {
            id: 4,
            type: "promo",
            title: "Flash Sale!",
            message: "Get 50% off on all summer collection items",
            icon: Tag,
            color: "text-purple-600",
            bg: "bg-purple-50",
            timestamp: new Date(date.getTime() - 12 * 3600000).toISOString(), // 12 hours ago
            isRead: true
        },
        {
            id: 5,
            type: "account",
            title: "Security Alert",
            message: "New login detected from Chrome browser",
            icon: AlertCircle,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            timestamp: new Date(date.getTime() - 24 * 3600000).toISOString(), // 24 hours ago
            isRead: false
        }
    ];
};

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = notification.icon;

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    return (
        <motion.div
            variants={animations.item}
            layout
            className={`
                relative p-4 rounded-lg border transition-all duration-200
                ${notification.isRead ? 'bg-white' : notification.bg}
                ${isHovered ? 'shadow-md' : 'shadow-sm'}
            `}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${notification.bg}`}>
                    <Icon className={notification.color} size={20} />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className={`font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                {notification.title}
                            </h3>
                            <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-600'}`}>
                                {notification.message}
                            </p>
                        </div>
                        <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
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
                                {!notification.isRead && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onMarkAsRead(notification.id)}
                                        className="text-xs text-indigo-600 hover:text-indigo-700"
                                    >
                                        Mark as read
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onDelete(notification.id)}
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
    const currentDate = "2025-02-05 17:40:56";
    const currentUser = "vipinyadav01";

    useEffect(() => {
        setNotifications(generateDemoNotifications(currentDate));
    }, [currentDate]);

    const handleMarkAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        );
    };

    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        );
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === "unread") return !notif.isRead;
        if (filter === "read") return notif.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-gray-50">
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
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock size={16} />
                            <span>{currentDate} UTC</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Controls */}
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

                {/* Notifications List */}
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
                                    key={notification.id}
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
            </div>
        </div>
    );
};

export default Notifications;
