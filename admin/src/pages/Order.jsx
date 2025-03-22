import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Truck, Package, Calendar, CreditCard, User, MapPin, Phone } from "lucide-react";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchAllOrders = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            setError("Please log in to view orders.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                `${backendUrl}/api/order/list`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders.reverse());
            } else {
                toast.error(response.data.message);
                setError(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            const message = error.response?.data?.message || "Failed to fetch orders";
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post(
                `${backendUrl}/api/order/status`,
                { orderId, status: event.target.value },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                await fetchAllOrders();
                toast.success("Order status updated successfully");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update order status");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const toggleOrderExpansion = (index) => {
        setExpandedOrder(expandedOrder === index ? null : index);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Order Placed": return "bg-[#ff6200]/10 text-[#ff6200]";
            case "Packing": return "bg-yellow-500/10 text-yellow-500";
            case "Shipped": return "bg-blue-500/10 text-blue-500";
            case "Out for Delivery": return "bg-purple-500/10 text-purple-500";
            case "Delivered": return "bg-green-500/10 text-green-500";
            case "Cancelled": return "bg-red-500/10 text-red-500";
            default: return "bg-[#939393]/10 text-[#939393]";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#131313]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ff6200] border-opacity-75"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#131313] p-6">
            <div className="max-w-7xl mx-auto">
                <h3 className="text-3xl font-bold text-white text-center mb-8">
                    Order Management
                </h3>

                {error ? (
                    <div className="flex flex-col items-center justify-center p-16 bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl border border-[#939393]/20 shadow-lg">
                        <p className="text-xl text-[#ff6200] mb-4">{error}</p>
                        <button
                            onClick={fetchAllOrders}
                            className="px-4 py-2 bg-[#ff6200] text-white rounded-xl hover:bg-[#ff4500] hover:shadow-[#ff6200]/50 transition-all duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl border border-[#939393]/20 shadow-lg">
                        <Package size={48} className="text-[#939393] mb-4" />
                        <p className="text-xl text-[#939393]">No orders found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <div
                                key={order._id || index}
                                className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/20 transition-all duration-300 overflow-hidden"
                            >
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => toggleOrderExpansion(index)}
                                >
                                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                                        <div className="flex items-center gap-4 flex-grow">
                                            <div className={`p-3 rounded-xl ${getStatusColor(order.status)}`}>
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg text-white mb-1">
                                                    Order to {order.address.firstName} {order.address.lastName}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#939393]">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(order.date).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Package className="w-4 h-4" />
                                                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 mt-4 lg:mt-0">
                                            <p className="text-2xl font-bold text-white">₹ {order.amount.toFixed(2)}</p>
                                            <button
                                                className="text-[#ff6200] hover:text-[#ff4500] transition-colors duration-300"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleOrderExpansion(index);
                                                }}
                                            >
                                                {expandedOrder === index ? "Hide Details" : "View Details"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {expandedOrder === index && (
                                    <div className="px-6 pb-6 pt-2 border-t border-[#939393]/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Order Items */}
                                            <div>
                                                <h5 className="font-medium text-[#939393] mb-4 flex items-center gap-2">
                                                    <Package className="w-5 h-5 text-[#ff6200]" />
                                                    Order Items
                                                </h5>
                                                <div className="space-y-4">
                                                    {order.items.map((item, idx) => (
                                                        <div
                                                            key={item._id || idx}
                                                            className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-[#939393]/10"
                                                        >
                                                            <div className="bg-[#131313] rounded-md p-2 border border-[#939393]/20">
                                                                <Package className="w-6 h-6 text-[#ff6200]" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-white">{item.name}</p>
                                                                <div className="text-sm text-[#939393] mt-1">
                                                                    <span className="mr-3">Quantity: {item.quantity}</span>
                                                                    <span>Size: {item.size}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Delivery & Payment Info */}
                                            <div className="space-y-6">
                                                {/* Delivery Address */}
                                                <div>
                                                    <h5 className="font-medium text-[#939393] mb-4 flex items-center gap-2">
                                                        <MapPin className="w-5 h-5 text-[#ff6200]" />
                                                        Delivery Address
                                                    </h5>
                                                    <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#939393]/10">
                                                        <p className="font-medium text-white">{order.address.firstName} {order.address.lastName}</p>
                                                        <p className="text-[#939393] mt-1">{order.address.street}</p>
                                                        <p className="text-[#939393]">
                                                            {order.address.city}, {order.address.state}, {order.address.zipcode}
                                                        </p>
                                                        <p className="text-[#939393]">{order.address.country}</p>
                                                        <p className="flex items-center gap-2 mt-2 text-[#939393]">
                                                            <Phone className="w-4 h-4 text-[#ff6200]" />
                                                            {order.address.phone}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Payment Information */}
                                                <div>
                                                    <h5 className="font-medium text-[#939393] mb-4 flex items-center gap-2">
                                                        <CreditCard className="w-5 h-5 text-[#ff6200]" />
                                                        Payment Information
                                                    </h5>
                                                    <div className="p-4 bg-[#1a1a1a] rounded-xl border border-[#939393]/10 space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-[#939393]">Method:</span>
                                                            <span className="font-medium text-white">{order.paymentMethod}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-[#939393]">Status:</span>
                                                            <span className={`font-medium ${order.payment ? "text-green-500" : "text-red-500"}`}>
                                                                {order.payment ? "Completed" : "Pending"}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-[#939393]">Amount:</span>
                                                            <span className="font-medium text-white">₹ {order.amount.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Order Status */}
                                                <div>
                                                    <h5 className="font-medium text-[#939393] mb-4 flex items-center gap-2">
                                                        <Truck className="w-5 h-5 text-[#ff6200]" />
                                                        Order Status
                                                    </h5>
                                                    <select
                                                        onChange={(event) => statusHandler(event, order._id)}
                                                        value={order.status}
                                                        className="w-full p-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                                    >
                                                        <option value="Order Placed">Order Placed</option>
                                                        <option value="Packing">Packing</option>
                                                        <option value="Shipped">Shipped</option>
                                                        <option value="Out for Delivery">Out for Delivery</option>
                                                        <option value="Delivered">Delivered</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Order;