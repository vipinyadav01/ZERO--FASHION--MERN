import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlertCircle, Package, CreditCard, Heart, Tag } from "lucide-react";
import { Link } from "react-router-dom";

// Helper functions
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

// Notification Item Component
const NotificationItem = ({ notification }) => {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = getIconByType(notification.type);
    const color = getColorByType(notification.type);
    const bg = getBgByType(notification.type);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                notification.read ? 'opacity-75' : 'bg-blue-50'
            }`}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${bg} flex-shrink-0`}>
                    <Icon className={`${color} w-4 h-4`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                            {notification.title}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatTimestamp(notification.timestamp)}
                        </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${notification.read ? 'text-gray-500' : 'text-gray-600'}`}>
                        {notification.message}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

// Notification Dropdown Header Component
export const NotificationHeader = ({ unreadCount }) => {
    return (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            <p className="text-xs text-gray-500">{unreadCount} unread</p>
        </div>
    );
};

// Main Notification Dropdown Component
const NotificationDropdown = ({
    notifications,
    loading,
    unreadCount,
    isOpen,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-40"
                >
                    {/* Header */}
                    <NotificationHeader unreadCount={unreadCount} />

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                <div className="animate-spin inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full"></div>
                                <p className="mt-2">Loading notifications...</p>
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notif) => (
                                <NotificationItem key={notif.id} notification={notif} />
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                No notifications yet
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <Link
                        to="/notification"
                        className="block px-4 py-3 bg-gray-50 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
                    >
                        View All
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
