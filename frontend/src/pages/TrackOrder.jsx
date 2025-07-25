import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    MapPin,
    CheckCircle,
    Calendar,
    CreditCard,
    Box,
    Share2,
    ChevronDown,
    Info
} from "lucide-react";
import Title from "../components/Title"; // Assuming this path is correct

const StatusBadge = ({ status }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-50 text-green-800 border-green-200 shadow-green-100";
            case "Cancelled":
                return "bg-red-50 text-red-800 border-red-200 shadow-red-100";
            case "Shipped":
                return "bg-black text-white border-black shadow-gray-200";
            case "Out for Delivery":
                return "bg-gray-100 text-gray-800 border-gray-300 shadow-gray-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100";
        }
    };

    return (
        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300 shadow-lg ${getStatusStyles(status)}`}>
            {status}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.string.isRequired,
};

const Timeline = ({ events }) => {
    const completedCount = events.filter(event => event.completed).length;
    const progress = (completedCount / events.length) * 100;

    return (
        <div className="space-y-6 py-6">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div
                    className="bg-gradient-to-r from-gray-800 to-black h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {events.map((event, index) => (
                <div key={index} className="flex items-start group">
                    <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                            event.completed
                                ? 'bg-black border-4 border-gray-300'
                                : 'bg-white border-4 border-gray-300'
                        }`}>
                            {event.completed ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-gray-400" />
                            )}
                        </div>
                        {index < events.length - 1 && (
                            <div className={`w-0.5 h-20 ${
                                event.completed ? 'bg-black' : 'bg-gray-300'
                            } transition-colors duration-300`} />
                        )}
                    </div>
                    <div className="ml-6 flex-1 bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
                            <div className="relative group/tooltip">
                                <Info className="w-5 h-5 text-gray-400 cursor-help hover:text-black transition-colors duration-200" />
                                <span className="absolute hidden group-hover/tooltip:block -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-20 shadow-lg">
                                    {event.description}
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{event.time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

Timeline.propTypes = {
    events: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired,
        })
    ).isRequired,
};

const DeliveryMap = ({ address }) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-black rounded-full">
                    <MapPin className="text-white w-6 h-6 flex-shrink-0" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-900">Delivery Address</h4>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed break-words">{address}</p>
                </div>
            </div>
        </div>
    );
};

DeliveryMap.propTypes = {
    address: PropTypes.string.isRequired
};

const OrderInfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 text-sm group">
        <div className="p-1 bg-black rounded-full mt-0.5">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <span className="text-gray-600 font-medium block">{label}:</span>
            <span className="font-semibold text-gray-900 group-hover:text-black transition-colors duration-200 break-words">{value}</span>
        </div>
    </div>
);

OrderInfoItem.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
};

const TrackOrder = () => {
    const location = useLocation(); // Correctly initialize useLocation
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [expandedSection, setExpandedSection] = useState("all");

    useEffect(() => {
        if (location.state?.orderDetails) {
            setOrderDetails(location.state.orderDetails);
        }
    }, [location.state]);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? "all" : section);
    };

    if (!orderDetails) { // Check for orderDetails directly
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
                <div className="container mx-auto py-8 pt-20 sm:pt-24">
                    <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-gray-200">
                        <div className="rounded-full bg-gray-100 p-6 w-24 h-24 flex items-center justify-center mx-auto shadow-inner">
                            <Package className="w-12 h-12 text-black" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Not Found</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We couldn&apos;t locate the order details you&apos;re looking for.
                        </p>
                        <button
                            onClick={() => navigate("/orders")}
                            className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-0.5"
                        >
                            View All Orders
                        </button>
                    </div>
                </div>
            </div>
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
            time: "2025-02-05 12:30 PM", // Placeholder, you might want to dynamically set this
            completed: orderDetails?.status !== "Order Placed"
        },
        {
            title: "Shipped",
            description: "Your order has been shipped",
            time: "2025-02-06 09:15 AM", // Placeholder
            completed: ["Shipped", "Out for Delivery", "Delivered"].includes(orderDetails?.status)
        },
        {
            title: "Out for Delivery",
            description: "Your order is on its way",
            time: "2025-02-07 02:20 PM", // Placeholder
            completed: ["Out for Delivery", "Delivered"].includes(orderDetails?.status)
        },
        {
            title: "Delivered",
            description: "Your order has been delivered",
            time: "2025-02-07 04:45 PM", // Placeholder
            completed: orderDetails?.status === "Delivered"
        }
    ];

    return (
        <div className="min-h-screen bg-transparent p-4 sm:p-6">
            {/* Title and Back Button */}
            <div className="max-w-4xl mx-auto pt-6 sm:pt-8 pb-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate("/orders")}
                        className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-all duration-300 shadow-md transform hover:-translate-x-1"
                    >
                        <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                    </button>
                    <Title text1="TRACK" text2="ORDER" accent="gradient" />
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto py-0 sm:py-2">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                    {/* Order Summary */}
                    <section className="p-4 sm:p-6 lg:p-8 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Summary</h2>
                            <StatusBadge status={orderDetails?.status} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="flex gap-4 sm:gap-5 items-center">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex-shrink-0 border border-gray-100">
                                    <img
                                        src={orderDetails?.image?.[0]}
                                        alt={orderDetails?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg sm:text-xl text-gray-900 break-words">{orderDetails?.name}</h3>
                                    <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                                        <span className="text-xs sm:text-sm px-3 py-1 bg-gray-100 rounded-full font-medium shadow-sm">Size: {orderDetails?.size}</span>
                                        <span className="text-xs sm:text-sm px-3 py-1 bg-gray-100 rounded-full font-medium shadow-sm">Qty: {orderDetails?.quantity}</span>
                                    </div>
                                    <p className="font-bold mt-3 sm:mt-4 text-black text-lg sm:text-xl">₹{orderDetails?.price}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl space-y-4 sm:space-y-5 border border-gray-100 shadow-inner">
                                <OrderInfoItem
                                    icon={<Box className="text-white" size={16} />}
                                    label="Order ID"
                                    value={orderDetails?.orderId}
                                />
                                <OrderInfoItem
                                    icon={<Calendar className="text-white" size={16} />}
                                    label="Order Date"
                                    value={formatDate(orderDetails?.date)}
                                />
                                <OrderInfoItem
                                    icon={<CreditCard className="text-white" size={16} />}
                                    label="Payment"
                                    value={orderDetails?.paymentMethod}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Tracking Timeline */}
                    <section className="border-b border-gray-200">
                        <div
                            className="p-4 sm:p-6 lg:p-8 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
                            onClick={() => toggleSection("timeline")}
                        >
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Tracking Timeline</h3>
                            <ChevronDown
                                size={20}
                                className={`text-gray-500 transition-transform duration-300 sm:hidden ${
                                    expandedSection === "timeline" || expandedSection === "all" ? "rotate-180" : ""
                                }`}
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedSection === "timeline" || expandedSection === "all"
                                    ? "max-h-[2000px] opacity-100"
                                    : "max-h-0 opacity-0 sm:max-h-[2000px] sm:opacity-100"
                            }`}
                        >
                            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                                <Timeline events={events} />
                            </div>
                        </div>
                    </section>

                    {/* Delivery Information */}
                    <section className="border-b border-gray-200">
                        <div
                            className="p-4 sm:p-6 lg:p-8 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
                            onClick={() => toggleSection("delivery")}
                        >
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Delivery Information</h3>
                            <ChevronDown
                                size={20}
                                className={`text-gray-500 transition-transform duration-300 sm:hidden ${
                                    expandedSection === "delivery" || expandedSection === "all" ? "rotate-180" : ""
                                }`}
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                expandedSection === "delivery" || expandedSection === "all"
                                    ? "max-h-[2000px] opacity-100"
                                    : "max-h-0 opacity-0 sm:max-h-[2000px] sm:opacity-100"
                            }`}
                        >
                            <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                                <DeliveryMap address={orderDetails?.address || "123 Delivery St, City, Country"} />
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <section className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4">
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: `Order #${orderDetails?.orderId}`,
                                        text: `Track my order from Zero Fashion`,
                                        url: window.location.href
                                    }).catch(() => {
                                        // Fallback for browsers that don't support Web Share API
                                        navigator.clipboard?.writeText(window.location.href);
                                    });
                                } else {
                                    // Fallback for browsers that don't support Web Share API
                                    navigator.clipboard?.writeText(window.location.href);
                                }
                            }}
                            className="flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-300 bg-white rounded-full hover:bg-gray-50 hover:border-black transition-all duration-300 shadow-md font-medium transform hover:-translate-y-0.5"
                        >
                            <Share2 size={18} />
                            <span>Share</span>
                        </button>
                        <button
                            onClick={() => navigate("/support")}
                            className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg font-semibold transform hover:-translate-y-0.5"
                        >
                            Need Help?
                        </button>
                    </section>
                </div>

                {/* Recommended Action */}
                <div className="mt-6 sm:mt-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-300">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Discover More</h3>
                            <p className="text-gray-600 text-sm mt-2 max-w-md leading-relaxed">
                                Browse our latest collections for fresh, stylish additions to your wardrobe.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full sm:w-auto px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TrackOrder;