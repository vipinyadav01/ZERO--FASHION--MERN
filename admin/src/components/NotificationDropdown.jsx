import React, { useState, useRef, useEffect } from "react";
import { Bell, Package, Users, Plus, Clock, X } from "lucide-react";

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // Custom notification logic - only 3 types: orders, users, new products
    const generateNotifications = () => {
        const currentTime = new Date();
        const notificationTypes = [
            {
                type: 'order',
                title: 'New Order Received',
                desc: 'Order #1247 from customer John D.',
                time: '5 min ago',
                icon: Package,
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/20',
                read: false
            },
            {
                type: 'user',
                title: 'New User Registered',
                desc: 'Welcome new customer Sarah M.',
                time: '2 hours ago',
                icon: Users,
                color: 'text-green-400',
                bgColor: 'bg-green-500/20',
                read: false
            },
            {
                type: 'product',
                title: 'New Product Added',
                desc: 'Winter Jacket has been added to inventory',
                time: '1 day ago',
                icon: Plus,
                color: 'text-purple-400',
                bgColor: 'bg-purple-500/20',
                read: true
            }
        ];

        // Add some random variations to make it more realistic
        const variations = [
            { order: 'Order #1248 from customer Mike R.', user: 'Welcome new customer Emma L.', product: 'Summer Dress has been added to inventory' },
            { order: 'Order #1249 from customer Lisa K.', user: 'Welcome new customer David P.', product: 'Leather Bag has been added to inventory' },
            { order: 'Order #1250 from customer Alex M.', user: 'Welcome new customer Rachel S.', product: 'Sneakers have been added to inventory' }
        ];

        const randomVariation = variations[Math.floor(Math.random() * variations.length)];
        
        return notificationTypes.map((notification, index) => ({
            id: index + 1,
            ...notification,
            desc: randomVariation[notification.type] || notification.desc,
            timestamp: new Date(currentTime.getTime() - (index * 2 * 60 * 60 * 1000)) // 2 hours apart
        }));
    };

    // Initialize notifications
    useEffect(() => {
        const initialNotifications = generateNotifications();
        setNotifications(initialNotifications);
        setUnreadCount(initialNotifications.filter(n => !n.read).length);
    }, []);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Toggle dropdown
    const toggleDropdown = () => setIsOpen(prev => !prev);

    // Mark notification as read
    const markAsRead = (notificationId) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, read: true }
                    : notification
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        setUnreadCount(0);
    };

    // Format time
    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hours ago`;
        return `${days} days ago`;
    };

    // Get notification icon component
    const getNotificationIcon = (notification) => {
        const IconComponent = notification.icon;
        return (
            <div className={`p-2 rounded-lg ${notification.bgColor}`}>
                <IconComponent size={16} className={notification.color} />
            </div>
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={toggleDropdown}
                className="relative p-2.5 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full ring-2 ring-slate-900 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-3 w-80 lg:w-96 xl:w-[400px] rounded-2xl shadow-2xl bg-slate-800/98 backdrop-blur-2xl border border-slate-700/60 focus:outline-none overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <span className="text-xs px-3 py-1 rounded-full bg-slate-700/60 text-slate-300 font-medium border border-slate-600/40">
                                        {unreadCount} new
                                    </span>
                                )}
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`px-6 py-4 hover:bg-slate-700/30 cursor-pointer border-l-3 transition-all duration-200 ${
                                        notification.read ? "border-transparent" : "border-indigo-500"
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        {getNotificationIcon(notification)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-medium truncate ${
                                                    notification.read ? "text-slate-300" : "text-white"
                                                }`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5"></div>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                                {notification.desc}
                                            </p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <Clock className="w-3 h-3 text-slate-500" />
                                                <p className="text-xs text-slate-500">
                                                    {formatTime(notification.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-700/50 flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-sm text-slate-400">No notifications yet</p>
                                <p className="text-xs text-slate-500 mt-1">We'll notify you when something happens</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-6 py-3 border-t border-slate-700/50">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full text-xs text-slate-400 hover:text-white font-medium transition-colors"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
