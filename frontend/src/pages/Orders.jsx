import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage, FiTruck, FiCheck, FiX, FiAlertCircle, FiSearch, FiFilter } from "react-icons/fi";

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const navigate = useNavigate();

    const statusColors = {
        "Processing": "bg-amber-500",
        "Shipped": "bg-blue-500",
        "Delivered": "bg-emerald-500",
        "Cancelled": "bg-rose-500"
    };

    const statusIcons = {
        "Processing": <FiPackage className="w-5 h-5" />,
        "Shipped": <FiTruck className="w-5 h-5" />,
        "Delivered": <FiCheck className="w-5 h-5" />,
        "Cancelled": <FiX className="w-5 h-5" />
    };

    const handleTrackOrder = (item) => {
        navigate('/TrackOrder', {
            state: {
                orderDetails: {
                    orderId: item.orderId,
                    name: item.name,
                    image: item.image,
                    size: item.size,
                    quantity: item.quantity,
                    date: item.date,
                    status: item.status,
                    price: item.price,
                    paymentMethod: item.paymentMethod
                }
            }
        });
    };

    const handleCancelOrder = async (orderId) => {
        try {
            setCancellingOrder(orderId);
            const response = await fetch(`${backendUrl}/api/order/${orderId}/cancel`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setOrderData(prevOrders =>
                    prevOrders.map(order =>
                        order.orderId === orderId
                            ? { ...order, status: "Cancelled" }
                            : order
                    )
                );
                showNotification("success", "Order cancelled successfully");
            } else {
                showNotification("error", data.message || "Failed to cancel order");
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            showNotification("error", "An unexpected error occurred");
        } finally {
            setCancellingOrder(null);
        }
    };

    const showNotification = (type, message) => {
        setError({ type, message });
        setTimeout(() => setError(null), 5000);
    };

    const loadOrders = async () => {
        setLoading(true);
        try {
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await fetch(`${backendUrl}/api/order/userorders`, {
                method: "POST",
                headers: {
                    token,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (data.success) {
                const allOrders = data.orders.flatMap(order =>
                    order.items.map(item => ({
                        ...item,
                        status: order.status,
                        date: order.date,
                        payment: order.payment,
                        paymentMethod: order.paymentMethod,
                        orderId: order._id
                    }))
                );
                setOrderData(allOrders);
            } else {
                showNotification("error", "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error loading orders:", error);
            showNotification("error", "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            loadOrders();
        } else {
            setLoading(false);
            setOrderData([]);
        }
    }, [token, backendUrl]);

    const filteredOrders = orderData
        .filter(order => filterStatus === "all" || order.status.toLowerCase() === filterStatus)
        .filter(order =>
            searchTerm === "" ||
            order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full"
                >
                    <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Login Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to view your orders.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition duration-300"
                    >
                        Go to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16 md:mt-24 mb-16">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 mb-4 p-4 rounded-xl shadow-lg ${
                            error.type === 'success' ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'
                        } border flex items-center justify-between max-w-md w-full`}
                    >
                        <div className="flex items-center">
                            {error.type === 'success' ? (
                                <FiCheck className="w-5 h-5 text-emerald-500 mr-2" />
                            ) : (
                                <FiAlertCircle className="w-5 h-5 text-rose-500 mr-2" />
                            )}
                            <span className={error.type === 'success' ? 'text-emerald-700' : 'text-rose-700'}>
                                {error.message}
                            </span>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-8">
                <Title text1={"MY"} text2={"ORDERS"} />
            </div>

            {/* Search and filter bar */}
            <div className="mb-6 bg-white rounded-xl shadow-md p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID or product name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Desktop filters */}
                    <div className="hidden md:flex flex-wrap gap-2">
                        {["all", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                                    filterStatus === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Mobile filter toggle */}
                    <button
                        className="md:hidden flex items-center justify-center px-4 py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200"
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                    >
                        <FiFilter className="mr-2" />
                        <span>Filter</span>
                    </button>
                </div>

                {/* Mobile filters */}
                <AnimatePresence>
                    {mobileFiltersOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden mt-4 overflow-hidden"
                        >
                            <div className="grid grid-cols-2 gap-2">
                                {["all", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setFilterStatus(status);
                                            setMobileFiltersOpen(false);
                                        }}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                            filterStatus === status
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-ping opacity-25"></div>
                        </div>
                    </div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-2xl shadow-md"
                >
                    <FiPackage className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">No Orders Found</h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your filters or search term"
                            : "Start shopping to create your first order!"}
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition duration-300"
                    >
                        Browse Products
                    </button>
                </motion.div>
            ) : (
                <div className="grid gap-6">
                    {filteredOrders.map((item, index) => (
                        <motion.div
                            key={`${item.orderId}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col gap-6">
                                    {/* Order header with status */}
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-500">Order ID:</span>
                                            <span className="font-mono font-semibold">{item.orderId.slice(-8)}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColors[item.status] || 'bg-gray-500'} bg-opacity-15`}>
                                            {statusIcons[item.status] || <FiPackage className="w-5 h-5" />}
                                            <span className={`text-sm font-medium ${
                                                item.status === "Cancelled" ? "text-rose-600" :
                                                item.status === "Delivered" ? "text-emerald-600" :
                                                item.status === "Shipped" ? "text-blue-600" :
                                                "text-amber-600"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Product details */}
                                    <div className="flex flex-col sm:flex-row gap-6">
                                        <div className="relative group">
                                            <img
                                                className="w-full sm:w-32 h-32 sm:h-32 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                                                src={item.image?.[0] || "/placeholder.svg"}
                                                alt={item.name}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-xl"></div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{item.name}</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Price:</span>
                                                    <span>{currency}{item.price}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Quantity:</span>
                                                    <span>{item.quantity}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Size:</span>
                                                    <span>{item.size}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Payment:</span>
                                                    <span>{item.paymentMethod}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Date:</span>
                                                    <span>{new Date(item.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                        <button
                                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                                            onClick={() => handleTrackOrder(item)}
                                        >
                                            <FiTruck className="w-4 h-4" />
                                            Track Order
                                        </button>

                                        {item.status !== "Delivered" && item.status !== "Cancelled" && (
                                            <button
                                                className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 ${
                                                    cancellingOrder === item.orderId
                                                        ? 'bg-gray-300 cursor-not-allowed'
                                                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                                                } transition duration-300`}
                                                onClick={() => handleCancelOrder(item.orderId)}
                                                disabled={cancellingOrder === item.orderId}
                                            >
                                                <FiX className="w-4 h-4" />
                                                {cancellingOrder === item.orderId ? 'Cancelling...' : 'Cancel Order'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
