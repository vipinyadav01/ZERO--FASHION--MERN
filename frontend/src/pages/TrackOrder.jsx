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
    Share2,
    ChevronDown
} from "lucide-react";
import Title from "../components/Title";

const animations = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 }
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.4 }
    }
};

const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-800 border border-green-200";
            case "Cancelled":
                return "bg-red-100 text-red-800 border border-red-200";
            case "Shipped":
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case "Out for Delivery":
                return "bg-yellow-100 text-yellow-800 border border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

const Timeline = ({ status, events }) => {
    return (
        <div className="space-y-8 py-2">
            {events.map((event, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-start"
                >
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${event.completed ? 'bg-indigo-600' : 'bg-gray-200'
                            }`}>
                            {event.completed ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                                <div className="w-3 h-3 rounded-full bg-gray-400" />
                            )}
                        </div>
                        {index < events.length - 1 && (
                            <div className={`w-0.5 h-16 ${event.completed ? 'bg-indigo-600' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                    <div className="ml-4">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{event.time}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const DeliveryMap = ({ address }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
                <MapPin className="text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-medium text-gray-900">Delivery Address</h4>
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

const OrderInfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm">
        {icon}
        <span className="text-gray-500">{label}:</span>
        <span className="font-medium text-gray-900">{value}</span>
    </div>
);

const TrackOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [expandedSection, setExpandedSection] = useState("all");

    useEffect(() => {
        if (location.state?.orderDetails) {
            setOrderDetails(location.state.orderDetails);
        }
    }, [location.state]);

    const toggleSection = (section) => {
        if (expandedSection === section) {
            setExpandedSection("all");
        } else {
            setExpandedSection(section);
        }
    };

    if (!location.state?.orderDetails) {
        return (
            <motion.div
                {...animations.slideUp}
                className="container mx-auto px-4 py-8 pt-16 sm:pt-24"
            >
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                    <div className="text-center space-y-4">
                        <div className="rounded-full bg-gray-100 p-4 w-20 h-20 flex items-center justify-center mx-auto">
                            <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900">No Order Found</h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            We couldn't find the order details you're looking for.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/orders")}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
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
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 pt-28">
                            <motion.button
                                whileHover={{ x: -3 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate("/order")}
                                className="p-2 rounded-full bg-gray-50 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </motion.button>
                            <Title text1="TRACK" text2="ORDER" accent="gradient" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <motion.div
                    {...animations.slideUp}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Order Summary */}
                    <div className="p-5 sm:p-6 border-b">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Order Summary</h2>
                            <StatusBadge status={orderDetails?.status} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shadow-md flex-shrink-0"
                                >
                                    <img
                                        src={orderDetails?.image?.[0]}
                                        alt={orderDetails?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{orderDetails?.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Size: {orderDetails?.size}</span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Qty: {orderDetails?.quantity}</span>
                                    </div>
                                    <p className="font-medium mt-2 text-indigo-600">₹{orderDetails?.price}</p>
                                </div>
                            </div>
                            <div className="space-y-3 bg-gray-50 p-3 rounded-xl">
                                <OrderInfoItem
                                    icon={<Box className="text-indigo-500" size={16} />}
                                    label="Order ID"
                                    value={orderDetails?.orderId}
                                />
                                <OrderInfoItem
                                    icon={<Calendar className="text-indigo-500" size={16} />}
                                    label="Order Date"
                                    value={formatDate(orderDetails?.date)}
                                />
                                <OrderInfoItem
                                    icon={<CreditCard className="text-indigo-500" size={16} />}
                                    label="Payment"
                                    value={orderDetails?.paymentMethod}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tracking Timeline - Collapsible on mobile */}
                    <div className="border-b">
                        <div
                            className="p-5 sm:p-6 flex justify-between items-center cursor-pointer sm:cursor-default"
                            onClick={() => toggleSection("timeline")}
                        >
                            <h3 className="text-lg font-semibold text-gray-900">Tracking Timeline</h3>
                            <ChevronDown
                                size={20}
                                className={`text-gray-500 transition-transform duration-300 sm:hidden ${expandedSection === "timeline" || expandedSection === "all" ? "transform rotate-180" : ""
                                    }`}
                            />
                        </div>
                        <AnimatePresence>
                            {(expandedSection === "timeline" || expandedSection === "all") && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden px-5 sm:px-6 pb-6"
                                >
                                    <Timeline status={orderDetails?.status} events={events} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Delivery Information - Collapsible on mobile */}
                    <div className="border-b">
                        <div
                            className="p-5 sm:p-6 flex justify-between items-center cursor-pointer sm:cursor-default"
                            onClick={() => toggleSection("delivery")}
                        >
                            <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
                            <ChevronDown
                                size={20}
                                className={`text-gray-500 transition-transform duration-300 sm:hidden ${expandedSection === "delivery" || expandedSection === "all" ? "transform rotate-180" : ""
                                    }`}
                            />
                        </div>
                        <AnimatePresence>
                            {(expandedSection === "delivery" || expandedSection === "all") && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden px-5 sm:px-6 pb-6"
                                >
                                    <DeliveryMap address={orderDetails?.address || "123 Delivery St, City, Country"} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
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
                            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors"
                        >
                            <Share2 size={18} />
                            <span>Share</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/support")}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            Need Help?
                        </motion.button>
                    </div>
                </motion.div>

                {/* Recommended Action */}
                <motion.div
                    {...animations.fadeIn}
                    className="mt-6 bg-white rounded-2xl shadow-xl p-5 sm:p-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Need something else?</h3>
                            <p className="text-gray-600 text-sm mt-1">Browse our latest collection for more stylish options.</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/")}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            Shop Now
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TrackOrder;
