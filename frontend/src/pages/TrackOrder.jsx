import { useState, useEffect } from "react";
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
import Title from "../components/Title";

const StatusBadge = ({ status }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-800 ring-green-300";
            case "Cancelled":
                return "bg-red-100 text-red-800 ring-red-300";
            case "Shipped":
                return "bg-blue-100 text-blue-800 ring-blue-300";
            case "Out for Delivery":
                return "bg-yellow-100 text-yellow-800 ring-yellow-300";
            default:
                return "bg-gray-100 text-gray-800 ring-gray-300";
        }
    };

    return (
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ring-1 ${getStatusStyles(status)} transition-all duration-200`}>
            {status}
        </span>
    );
};

const Timeline = ({ events }) => {
    const completedCount = events.filter(event => event.completed).length;
    const progress = (completedCount / events.length) * 100;

    return (
        <div className="space-y-6 py-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            {events.map((event, index) => (
                <div key={index} className="flex items-start group">
                    <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${event.completed ? 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-blue-100' : 'bg-gray-200 ring-4 ring-gray-100'
                            }`}>
                            {event.completed ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-gray-400" />
                            )}
                        </div>
                        {index < events.length - 1 && (
                            <div className={`w-1 h-20 ${event.completed ? 'bg-gradient-to-b from-blue-500 to-indigo-600' : 'bg-gray-200'
                                } transition-colors duration-300`} />
                        )}
                    </div>
                    <div className="ml-5 flex-1 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
                            <div className="relative group/tooltip">
                                <Info className="w-5 h-5 text-gray-400 cursor-help hover:text-blue-600 transition-colors duration-200" />
                                <span className="absolute hidden group-hover/tooltip:block -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-20 shadow-lg">
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

const DeliveryMap = ({ address }) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
                <MapPin className="text-blue-600 w-7 h-7 mt-1 flex-shrink-0" />
                <div>
                    <h4 className="font-semibold text-lg text-gray-900">Delivery Address</h4>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{address}</p>
                </div>
            </div>
        </div>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
};

const OrderInfoItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 text-sm group">
        {icon}
        <span className="text-gray-600 font-medium">{label}:</span>
        <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{value}</span>
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
        setExpandedSection(expandedSection === section ? "all" : section);
    };

    if (!location.state?.orderDetails) {
        return (
            <div className="container mx-auto px-4 py-8 pt-16 sm:pt-24 bg-gradient-to-b from-blue-50 to-gray-100">
                <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
                    <div className="rounded-full bg-blue-100 p-6 w-24 h-24 flex items-center justify-center mx-auto">
                        <Package className="w-12 h-12 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Order Not Found</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        We couldn't locate the order details you're looking for.
                    </p>
                    <button
                        onClick={() => navigate("/orders")}
                        className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                    >
                        View All Orders
                    </button>
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
            time: "2025-02-05 12:30 PM",
            completed: orderDetails?.status !== "Order Placed"
        },
        {
            title: "Shipped",
            description: "Your order has been shipped",
            time: "2025-02-06 09:15 AM",
            completed: ["Shipped", "Out for Delivery", "Delivered"].includes(orderDetails?.status)
        },
        {
            title: "Out for Delivery",
            description: "Your order is on its way",
            time: "2025-02-07 02:20 PM",
            completed: ["Out for Delivery", "Delivered"].includes(orderDetails?.status)
        },
        {
            title: "Delivered",
            description: "Your order has been delivered",
            time: "2025-02-07 04:45 PM",
            completed: orderDetails?.status === "Delivered"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-lg sticky top-0 z-20">
                <div className="max-w-full mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 pt-28">
                            <button
                                onClick={() => navigate("/order")}
                                className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <Title text1="TRACK" text2="ORDER" accent="gradient" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Order Summary */}
                    <section className="p-6 sm:p-8 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                            <StatusBadge status={orderDetails?.status} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex gap-5">
                                <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                    <img
                                        src={orderDetails?.image?.[0]}
                                        alt={orderDetails?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-xl text-gray-900">{orderDetails?.name}</h3>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <span className="text-sm px-4 py-1 bg-gray-100 rounded-full font-medium">Size: {orderDetails?.size}</span>
                                        <span className="text-sm px-4 py-1 bg-gray-100 rounded-full font-medium">Qty: {orderDetails?.quantity}</span>
                                    </div>
                                    <p className="font-bold mt-4 text-blue-600 text-xl">₹{orderDetails?.price}</p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-2xl space-y-5">
                                <OrderInfoItem
                                    icon={<Box className="text-blue-600" size={20} />}
                                    label="Order ID"
                                    value={orderDetails?.orderId}
                                />
                                <OrderInfoItem
                                    icon={<Calendar className="text-blue-600" size={20} />}
                                    label="Order Date"
                                    value={formatDate(orderDetails?.date)}
                                />
                                <OrderInfoItem
                                    icon={<CreditCard className="text-blue-600" size={20} />}
                                    label="Payment"
                                    value={orderDetails?.paymentMethod}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Tracking Timeline */}
                    <section className="border-b border-gray-100">
                        <div
                            className="p-6 sm:p-8 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => toggleSection("timeline")}
                        >
                            <h3 className="text-xl font-bold text-gray-900">Tracking Timeline</h3>
                            <ChevronDown
                                size={24}
                                className={`text-gray-500 transition-transform duration-300 sm:hidden ${expandedSection === "timeline" || expandedSection === "all" ? "rotate-180" : ""}`}
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSection === "timeline" || expandedSection === "all" ? "max-h-[2000px]" : "max-h-0"}`}
                        >
                            <div className="px-6 sm:px-8 pb-8">
                                <Timeline events={events} />
                            </div>
                        </div>
                    </section>

                    {/* Delivery Information */}
                    <section className="border-b border-gray-100">
                        <div
                            className="p-6 sm:p-8 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => toggleSection("delivery")}
                        >
                            <h3 className="text-xl font-bold text-gray-900">Delivery Information</h3>
                            <ChevronDown
                                size={24}
                                className={`text-gray-500 transition-transform duration-300 sm:hidden ${expandedSection === "delivery" || expandedSection === "all" ? "rotate-180" : ""}`}
                            />
                        </div>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSection === "delivery" || expandedSection === "all" ? "max-h-[2000px]" : "max-h-0"}`}
                        >
                            <div className="px-6 sm:px-8 pb-8">
                                <DeliveryMap address={orderDetails?.address || "123 Delivery St, City, Country"} />
                            </div>
                        </div>
                    </section>

                    {/* Actions */}
                    <section className="p-6 sm:p-8 flex flex-col sm:flex-row sm:justify-end gap-4">
                        <button
                            onClick={() => {
                                navigator.share({
                                    title: `Order #${orderDetails?.orderId}`,
                                    text: `Track my order from Zero Fashion`,
                                    url: window.location.href
                                });
                            }}
                            className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-200 bg-white rounded-full hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-md"
                        >
                            <Share2 size={20} />
                            <span className="font-semibold">Share</span>
                        </button>
                        <button
                            onClick={() => navigate("/support")}
                            className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                        >
                            Need Help?
                        </button>
                    </section>
                </div>

                {/* Recommended Action */}
                <div className="mt-8 bg-gradient-to-r from-blue-100 to-indigo-200 rounded-3xl shadow-xl p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <h3 className="text-2xl font-bold text-gray-900">Discover More</h3>
                            <p className="text-gray-600 text-sm mt-2 max-w-md">Browse our latest collections for fresh, stylish additions to your wardrobe.</p>
                        </div>
                        <button
                            onClick={() => navigate("/")}
                            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-xl"
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