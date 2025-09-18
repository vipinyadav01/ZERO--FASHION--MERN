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

const getStatusStyles = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-black text-white border-black";
        case "Cancelled":
            return "bg-white text-black border-black";
        case "Shipped":
            return "bg-gray-100 text-gray-800 border-gray-300";
        case "Out for Delivery":
            return "bg-gray-100 text-gray-800 border-gray-300";
        default:
            return "bg-gray-100 text-gray-800 border-gray-300";
    }
};


const Timeline = ({ events }) => {
    const completedCount = events.filter(event => event.completed).length;
    const progress = (completedCount / events.length) * 100;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-4 sm:mb-6">
                <div
                    className="bg-black h-2 sm:h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {events.map((event, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                            event.completed
                                ? 'bg-black border-black'
                                : 'bg-white border-gray-300'
                        }`}>
                            {event.completed ? (
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400" />
                            )}
                        </div>
                        {index < events.length - 1 && (
                            <div className={`w-0.5 h-12 sm:h-16 ${
                                event.completed ? 'bg-black' : 'bg-gray-300'
                            } transition-colors duration-300`} />
                        )}
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 p-3 sm:p-4 hover:border-gray-300 transition-all duration-300">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h3 className="font-medium text-sm sm:text-base text-gray-900">{event.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">{event.time}</p>
                            </div>
                            <div className="relative group/tooltip">
                                <Info className="w-4 h-4 text-gray-400 cursor-help hover:text-black transition-colors duration-200" />
                                <span className="absolute hidden group-hover/tooltip:block -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-20">
                                    {event.description}
                                </span>
                            </div>
                        </div>
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
        <div className="bg-white border border-gray-200 p-4 sm:p-6 hover:border-gray-300 transition-all duration-300">
            <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-black rounded-full flex-shrink-0">
                    <MapPin className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-base sm:text-lg text-gray-900">Delivery Address</h4>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed break-words">{address}</p>
                </div>
            </div>
        </div>
    );
};

DeliveryMap.propTypes = {
    address: PropTypes.string.isRequired
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

    if (!orderDetails) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
                <div className="max-w-md mx-auto bg-white border border-black p-8 text-center space-y-6">
                    <div className="w-16 h-16 flex items-center justify-center mx-auto">
                        <Package className="w-12 h-12 text-black" />
                    </div>
                    <h2 className="text-2xl font-bold text-black">Order Not Found</h2>
                    <p className="text-gray-600">
                        We couldn&apos;t locate the order details you&apos;re looking for.
                    </p>
                    <button
                        onClick={() => navigate("/order")}
                        className="w-full px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
                    >
                        View All Orders
                    </button>
                </div>
            </div>
        );
    }

    // Normalize image (handles string or array)
    const productImage = Array.isArray(orderDetails?.image)
        ? (orderDetails.image.find((u) => typeof u === "string" && u.trim() !== "") || "")
        : (typeof orderDetails?.image === "string" ? orderDetails.image : "");

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
        <div className="min-h-screen bg-transparent py-6 sm:py-10 md:py-20 px-2 sm:px-4 md:px-8 max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto">
            {/* Title and Back Button */}
            <div className="mb-8 sm:mb-12">
                <div className="flex items-center space-x-4 mb-4">
                    <button
                        onClick={() => navigate("/order")}
                        className="p-2 sm:p-3 border border-gray-300 text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
                    >
                        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <Title text1="TRACK" text2="ORDER" />
                </div>
                <div className="h-px bg-black w-20"></div>
            </div>

            {/* Main Content */}
            <main className="space-y-6 sm:space-y-8">
                <div className="border border-gray-200 hover:border-black transition-colors duration-300">
                    {/* Window bar */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                        </div>
                        <div className="text-[11px] font-mono text-gray-500">track/{orderDetails?.orderId?.slice(-8)}.log</div>
                        <div className="w-6" />
                    </div>

                    {/* Order Summary */}
                    <section className="p-4 sm:p-6 lg:p-8">
                        <div className="flex flex-col gap-6 sm:gap-8">
                            {/* Code-like info block */}
                            <div className="border border-gray-200 p-3 sm:p-4 bg-white">
                                <div className="font-mono text-xs sm:text-sm leading-5 sm:leading-6">
                                    <div className="break-all"><span className="text-gray-500">orderId:</span> <span className="text-black">{orderDetails?.orderId}</span></div>
                                    <div><span className="text-gray-500">date:</span> <span className="text-black">{formatDate(orderDetails?.date)}</span></div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-gray-500">status:</span>
                                        <span className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 border text-xs font-medium ${getStatusStyles(orderDetails?.status)}`}>
                                            {orderDetails?.status}
                                        </span>
                                    </div>
                                    <div><span className="text-gray-500">payment:</span> <span className="text-black">{orderDetails?.paymentMethod}</span></div>
                                </div>
                            </div>

                            {/* Product details */}
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                <div className="bg-gray-50 border border-gray-200 w-full sm:w-32 lg:w-40 mx-auto sm:mx-0">
                                    <img
                                        className="w-full h-32 sm:h-36 lg:h-40 object-cover object-center"
                                        src={productImage || "/placeholder.svg"}
                                        alt={orderDetails?.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/placeholder.svg";
                                        }}
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="mb-3 sm:mb-4">
                                        <h3 className="text-base sm:text-lg font-medium text-black line-clamp-2">{orderDetails?.name}</h3>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <span className="px-2 sm:px-2.5 py-1 text-xs border border-gray-300 text-gray-700">Size: {orderDetails?.size}</span>
                                            <span className="px-2 sm:px-2.5 py-1 text-xs border border-gray-300 text-gray-700">Qty: {orderDetails?.quantity}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4">
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Unit Price</div>
                                            <div className="font-medium text-sm sm:text-base">₹{orderDetails?.price}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</div>
                                            <div className="font-medium text-black text-sm sm:text-base">₹{orderDetails?.price * orderDetails?.quantity}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Tracking Timeline */}
                <div className="border border-gray-200 hover:border-black transition-colors duration-300">
                    {/* Window bar */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                        </div>
                        <div className="text-[11px] font-mono text-gray-500">timeline.log</div>
                        <div className="w-6" />
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8">
                        <Timeline events={events} />
                    </div>
                </div>

                {/* Delivery Information */}
                <div className="border border-gray-200 hover:border-black transition-colors duration-300">
                    {/* Window bar */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                        </div>
                        <div className="text-[11px] font-mono text-gray-500">delivery.log</div>
                        <div className="w-6" />
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8">
                        <DeliveryMap address={orderDetails?.address || "123 Delivery St, City, Country"} />
                    </div>
                </div>

                {/* Actions */}
                <div className="border border-gray-200 hover:border-black transition-colors duration-300">
                    <div className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: `Order #${orderDetails?.orderId}`,
                                        text: `Track my order from Zero Fashion`,
                                        url: window.location.href
                                    }).catch(() => {
                                        navigator.clipboard?.writeText(window.location.href);
                                    });
                                } else {
                                    navigator.clipboard?.writeText(window.location.href);
                                }
                            }}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 bg-white hover:bg-gray-50 hover:border-black transition-all duration-300 text-sm sm:text-base"
                        >
                            <Share2 size={16} className="sm:w-5 sm:h-5" />
                            <span>Share</span>
                        </button>
                        <button
                            onClick={() => navigate("/support")}
                            className="flex-1 sm:flex-none px-4 sm:px-8 py-2.5 sm:py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base font-medium"
                        >
                            Need Help?
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TrackOrder;