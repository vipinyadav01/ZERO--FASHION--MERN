import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import {
    Bell,
    X,
    ShoppingCart,
    Package,
    User,
    Clock
} from "lucide-react";

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        const count = notifications.filter(n => !n.read).length;
        setUnreadCount(count);
    }, [notifications]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showNotifications]);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const token = sessionStorage.getItem("token");
            if (!token) return;

            // Fetch recent orders
            const ordersResponse = await axios.get(`${backendUrl}/api/order/recent`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch recent users
            const usersResponse = await axios.get(`${backendUrl}/api/user/recent`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch low stock products
            const productsResponse = await axios.get(`${backendUrl}/api/product/low-stock`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Process and combine notifications
            const processedNotifications = [];

            // Process orders
            if (ordersResponse.data?.success && ordersResponse.data?.orders) {
                ordersResponse.data.orders.slice(0, 3).forEach((order, index) => {
                    processedNotifications.push({
                        id: `order-${order._id || index}`,
                        title: 'New Order Received',
                        message: `Order #${order.orderNumber || order._id?.slice(-6) || 'N/A'} from ${order.customerName || order.customer?.name || 'Customer'}`,
                        time: formatTime(new Date(order.createdAt || Date.now() - (index * 30 * 60 * 1000))),
                        read: false,
                        type: "order",
                        data: order
                    });
                });
            }

            // Process users
            if (usersResponse.data?.success && usersResponse.data?.users) {
                usersResponse.data.users.slice(0, 2).forEach((user, index) => {
                    processedNotifications.push({
                        id: `user-${user._id || index}`,
                        title: 'New User Registration',
                        message: `User '${user.name || user.email}' has registered`,
                        time: formatTime(new Date(user.createdAt || Date.now() - (2 * 60 * 60 * 1000))),
                        read: false,
                        type: "user",
                        data: user
                    });
                });
            }

            // Process low stock products
            if (productsResponse.data?.success && productsResponse.data?.products) {
                productsResponse.data.products.slice(0, 2).forEach((product, index) => {
                    processedNotifications.push({
                        id: `stock-${product._id || index}`,
                        title: 'Product Low Stock',
                        message: `Product '${product.name}' is running low (${product.stock || 0} remaining)`,
                        time: formatTime(new Date(Date.now() - (4 * 60 * 60 * 1000))),
                        read: false,
                        type: "stock",
                        data: product
                    });
                });
            }

            // Sort by timestamp (newest first)
            processedNotifications.sort((a, b) => {
                const timeA = new Date(a.time);
                const timeB = new Date(b.time);
                return timeB - timeA;
            });

            setNotifications(processedNotifications);

        } catch (error) {
            console.error('Error fetching notifications:', error);
            
            // Fallback to mock data if API fails
            const fallbackNotifications = generateFallbackNotifications();
            setNotifications(fallbackNotifications);
        } finally {
            setIsLoading(false);
        }
    };

    // Fallback notifications when API is not available
    const generateFallbackNotifications = () => {
        const currentTime = new Date();
        return [
            {
                id: 'order-1',
                title: 'New Order Received',
                message: 'Order #1247 from customer John D.',
                time: formatTime(new Date(currentTime.getTime() - 5 * 60 * 1000)),
                read: false,
                type: "order"
            },
            {
                id: 'user-1',
                title: 'New User Registration',
                message: 'User Sarah M. has registered',
                time: formatTime(new Date(currentTime.getTime() - 2 * 60 * 60 * 1000)),
                read: false,
                type: "user"
            },
            {
                id: 'stock-1',
                title: 'Product Low Stock',
                message: 'Winter Jacket is running low (5 remaining)',
                time: formatTime(new Date(currentTime.getTime() - 4 * 60 * 60 * 1000)),
                read: true,
                type: "stock"
            }
        ];
    };

    const markAsRead = async (notificationId) => {
        try {
            // Update local state immediately for better UX
            setNotifications(prev => 
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );

            // Try to mark as read on backend (optional)
            const token = sessionStorage.getItem("token");
            if (token) {
                try {
                    await axios.patch(`${backendUrl}/api/notifications/${notificationId}/read`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (error) {
                    // Silently fail if backend doesn't support this
                    console.log('Backend notification read status not supported');
                }
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            // Update local state immediately
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));

            // Try to mark all as read on backend (optional)
            const token = sessionStorage.getItem("token");
            if (token) {
                try {
                    await axios.patch(`${backendUrl}/api/notifications/mark-all-read`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (error) {
                    // Silently fail if backend doesn't support this
                    console.log('Backend bulk notification read status not supported');
                }
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order': return <ShoppingCart className="h-4 w-4 text-blue-500" />;
            case 'stock': return <Package className="h-4 w-4 text-yellow-500" />;
            case 'user': return <User className="h-4 w-4 text-green-500" />;
            default: return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'order': return 'border-blue-500/30 bg-blue-600/20 hover:bg-blue-600/30';
            case 'stock': return 'border-yellow-500/30 bg-yellow-600/20 hover:bg-yellow-600/30';
            case 'user': return 'border-green-500/30 bg-green-600/20 hover:bg-green-600/30';
            default: return 'border-gray-500/30 bg-gray-600/20 hover:bg-gray-600/30';
        }
    };

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

    return (
        <div className="fixed top-4 right-4 z-50 sm:top-6 sm:right-6" ref={notificationRef}>
            <div className="relative">
                <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 sm:p-3 rounded-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/90 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                    <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 md:w-96 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
                        <div className="p-3 border-b border-slate-600 flex items-center justify-between bg-slate-700/50">
                            <h3 className="text-white font-semibold text-sm flex items-center space-x-2">
                                <Bell className="h-4 w-4 text-blue-400" />
                                <span className="hidden sm:inline">Notifications</span>
                                <span className="sm:hidden">Notifs</span>
                                {unreadCount > 0 && (
                                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </h3>
                            <div className="flex space-x-1 sm:space-x-2">
                                <button
                                    onClick={fetchNotifications}
                                    className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 px-1.5 sm:px-2 py-1 rounded transition-colors"
                                    disabled={isLoading}
                                    title="Refresh notifications"
                                >
                                    {isLoading ? '...' : '🔄'}
                                </button>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 px-1.5 sm:px-2 py-1 rounded transition-colors hidden sm:block"
                                        title="Mark all as read"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 px-1.5 py-1 rounded transition-colors sm:hidden"
                                        title="Mark all as read"
                                    >
                                        All read
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="text-slate-400 hover:text-white hover:bg-slate-600/50 p-1 rounded transition-colors"
                                    title="Close notifications"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-2">
                            {isLoading ? (
                                <div className="text-center py-6 sm:py-8 text-slate-400">
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-xs sm:text-sm">Loading notifications...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="text-center py-6 sm:py-8 text-slate-400">
                                    <Bell className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-xs sm:text-sm">No notifications</p>
                                    <p className="text-xs text-slate-500 hidden sm:block">You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="space-y-1.5 sm:space-y-2">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-2.5 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                                                notification.read 
                                                    ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600/30' 
                                                    : `${getNotificationColor(notification.type)}`
                                            }`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex items-start space-x-2 sm:space-x-3">
                                                <div className="flex-shrink-0">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-xs sm:text-sm font-medium ${
                                                        notification.read ? 'text-slate-300' : 'text-white'
                                                    }`}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1.5 flex items-center space-x-1">
                                                        <Clock className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{notification.time}</span>
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                                                )}
                                            </div>
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