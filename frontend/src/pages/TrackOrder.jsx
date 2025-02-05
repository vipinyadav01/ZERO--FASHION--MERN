import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Package,
    Truck,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    CreditCard,
    Box,
    Share2
} from "lucide-react";
import Title from "../components/Title";

const animations = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    }
};

const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
            case "Shipped":
                return "bg-blue-100 text-blue-800";
            case "Out for Delivery":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

const Timeline = ({ status, events }) => {
    return (
        <div className="space-y-8">
            {events.map((event, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                >
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${event.completed ? 'bg-green-500' : 'bg-gray-200'
                            }`}>
                            {event.completed ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                                <div className="w-3 h-3 rounded-full bg-gray-400" />
                            )}
                        </div>
                        {index < events.length - 1 && (
                            <div className={`w-0.5 h-16 ${event.completed ? 'bg-green-500' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                    <div className="ml-4">
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-gray-500">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{event.time}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const DeliveryMap = ({ address }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
                <MapPin className="text-indigo-600 mt-1" />
                <div>
                    <h4 className="font-medium">Delivery Address</h4>
                    <p className="text-sm text-gray-600 mt-1">{address}</p>
                </div>
            </div>
        </div>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
};

const TrackOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const currentDate = "2025-02-05 18:02:20";
    const currentUser = "vipinyadav01";

    useEffect(() => {
        if (location.state?.orderDetails) {
            setOrderDetails(location.state.orderDetails);
        }
    }, [location.state]);

    if (!location.state?.orderDetails) {
        return (
            <motion.div
                {...animations.slideUp}
                className="container mx-auto px-4 py-8 pt-24"
            >
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center space-y-4">
                        <Package className="w-16 h-16 text-gray-400 mx-auto" />
                        <h2 className="text-2xl font-semibold text-gray-900">No Order Found</h2>
                        <p className="text-gray-600">
                            We couldn't find the order details you're looking for.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/orders")}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            View All Orders
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        );
    }

    const events = [
        {
            title: "Order Placed",
            description: "Your order has been confirmed",
            time: formatDate(orderDetails?.date),
            completed: true
        },
        {
            title: "Processing",
            description: "Your order is being prepared",
            time: "2025-02-05 12:30:00",
            completed: orderDetails?.status !== "Order Placed"
        },
        {
            title: "Shipped",
            description: "Your order has been shipped",
            time: "2025-02-06 09:15:00",
            completed: ["Shipped", "Out for Delivery", "Delivered"].includes(orderDetails?.status)
        },
        {
            title: "Out for Delivery",
            description: "Your order is on its way",
            time: "2025-02-07 14:20:00",
            completed: ["Out for Delivery", "Delivered"].includes(orderDetails?.status)
        },
        {
            title: "Delivered",
            description: "Your order has been delivered",
            time: "2025-02-07 16:45:00",
            completed: orderDetails?.status === "Delivered"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ x: -5 }}
                                onClick={() => navigate("/orders")}
                                className="text-gray-600 hover:text-indigo-600"
                            >
                                <ArrowLeft size={24} />
                            </motion.button>
                            <Title text1="TRACK" text2="ORDER" accent="gradient" />
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock size={16} />
                            <span>{currentDate} UTC</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    {...animations.slideUp}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                    {/* Order Summary */}
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Order Summary</h2>
                            <StatusBadge status={orderDetails?.status} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    src={orderDetails?.image?.[0]}
                                    alt={orderDetails?.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="font-medium">{orderDetails?.name}</h3>
                                    <p className="text-sm text-gray-500">Size: {orderDetails?.size}</p>
                                    <p className="text-sm text-gray-500">Qty: {orderDetails?.quantity}</p>
                                    <p className="font-medium mt-2">₹{orderDetails?.price}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Box className="text-gray-400" size={16} />
                                    <span>Order ID: {orderDetails?.orderId}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="text-gray-400" size={16} />
                                    <span>Order Date: {formatDate(orderDetails?.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CreditCard className="text-gray-400" size={16} />
                                    <span>Payment: {orderDetails?.paymentMethod}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-6">Tracking Timeline</h3>
                        <Timeline status={orderDetails?.status} events={events} />
                    </div>

                    {/* Delivery Information */}
                    <div className="p-6 bg-gray-50">
                        <DeliveryMap address={orderDetails?.address || "123 Delivery St, City, Country"} />
                    </div>

                    {/* Actions */}
                    <div className="p-6 border-t flex justify-end space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                // Add share functionality
                                navigator.share({
                                    title: `Order #${orderDetails?.orderId}`,
                                    text: `Track my order from Zero Fashion`,
                                    url: window.location.href
                                });
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                            <Share2 size={18} />
                            <span>Share</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/support")}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Need Help?
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TrackOrder;
