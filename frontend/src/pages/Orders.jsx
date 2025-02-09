import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPackage, FiTruck, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";

const Orders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const navigate = useNavigate();

    const statusColors = {
        "Processing": "bg-yellow-500",
        "Shipped": "bg-blue-500",
        "Delivered": "bg-green-500",
        "Cancelled": "bg-red-500"
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

    const filteredOrders = filterStatus === "all"
        ? orderData
        : orderData.filter(order => order.status.toLowerCase() === filterStatus);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Login Required</h2>
                    <p className="text-gray-600">Please log in to view your orders.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-24">
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mb-4 p-4 rounded-lg shadow-md ${error.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                            } border flex items-center justify-between`}
                    >
                        <div className="flex items-center">
                            {error.type === 'success' ? (
                                <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                            ) : (
                                <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
                            )}
                            <span className={error.type === 'success' ? 'text-green-700' : 'text-red-700'}>
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

            <div className="mb-6 flex flex-wrap gap-2">
                {["all", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterStatus === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin">
                            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full animate-ping"></div>
                        </div>
                    </div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Orders Found</h3>
                    <p className="text-gray-500">Start shopping to create your first order!</p>
                </motion.div>
            ) : (
                <div className="grid gap-6">
                    {filteredOrders.map((item, index) => (
                        <motion.div
                            key={`${item.orderId}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    <div className="flex items-start gap-6">
                                        <div className="relative group">
                                            <img
                                                className="w-32 h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                                                src={item.image?.[0] || "/placeholder.svg"}
                                                alt={item.name}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg"></div>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
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
                                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Order ID:</span>
                                                    <span className="font-mono">{item.orderId.slice(-8)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-4">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColors[item.status] || 'bg-gray-500'} bg-opacity-10`}>
                                            {statusIcons[item.status] || <FiPackage className="w-5 h-5" />}
                                            <span className={`text-sm font-medium ${item.status === "Cancelled"
                                                    ? "text-red-600"
                                                    : `text-${(statusColors[item.status] || 'bg-gray-500').replace('bg-', '')}`
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <button
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                                                onClick={() => handleTrackOrder(item)}
                                            >
                                                <FiTruck className="w-4 h-4" />
                                                Track Order
                                            </button>

                                            {item.status !== "Delivered" && item.status !== "Cancelled" && (
                                                <button
                                                    className={`px-6 py-2 rounded-lg flex items-center justify-center gap-2 ${cancellingOrder === item.orderId
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-red-600 hover:bg-red-700 text-white'
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
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
