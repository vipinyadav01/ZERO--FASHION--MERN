import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { Truck, Package, Calendar, CreditCard, User, MapPin, Phone } from "lucide-react";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchAllOrders = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return null;
        }

        try {
            setLoading(true);
            const response = await fetch(backendUrl + "/api/order/list", {
                method: "POST",
                headers: { token },
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.post(
                backendUrl + "/api/order/status",
                { orderId, status: event.target.value },
                { headers: { token } }
            );
            if (response.data.success) {
                await fetchAllOrders();
            }
        } catch (error) {
            console.error(error);
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
            case "Order Placed":
                return "bg-blue-100 text-blue-800";
            case "Packing":
                return "bg-yellow-100 text-yellow-800";
            case "Shipped":
                return "bg-indigo-100 text-indigo-800";
            case "Out for Delivery":
                return "bg-purple-100 text-purple-800";
            case "Delivered":
                return "bg-green-100 text-green-800";
            case "Cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Order Management
            </h3>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 bg-white rounded-lg shadow-sm">
                    <Package size={48} className="text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No orders found.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                        >
                            <div
                                className="p-6 cursor-pointer"
                                onClick={() => toggleOrderExpansion(index)}
                            >
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    {/* Order summary - always visible */}
                                    <div className="flex items-center gap-4 flex-grow">
                                        <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-1">
                                                Order to {order.address.firstName} {order.address.lastName}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(order.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Package className="w-4 h-4" />
                                                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 mt-4 lg:mt-0">
                                        <p className="text-2xl font-bold text-gray-900">₹ {order.amount.toFixed(2)}</p>
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleOrderExpansion(index);
                                            }}
                                        >
                                            {expandedOrder === index ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded details */}
                            {expandedOrder === index && (
                                <div className="px-6 pb-6 pt-2 border-t border-gray-100 mt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left column - Order items */}
                                        <div>
                                            <h5 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                                                <Package className="w-5 h-5" />
                                                Order Items
                                            </h5>
                                            <div className="space-y-4">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <div className="bg-white rounded-md p-2 border border-gray-200">
                                                            <Package className="w-6 h-6 text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{item.name}</p>
                                                            <div className="text-sm text-gray-600 mt-1">
                                                                <span className="mr-3">Quantity: {item.quantity}</span>
                                                                <span>Size: {item.size}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right column - Delivery & payment info */}
                                        <div className="space-y-6">
                                            {/* Delivery address */}
                                            <div>
                                                <h5 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                                                    <MapPin className="w-5 h-5" />
                                                    Delivery Address
                                                </h5>
                                                <div className="p-4 bg-gray-50 rounded-lg">
                                                    <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                                                    <p className="text-gray-600 mt-1">{order.address.street}</p>
                                                    <p className="text-gray-600">
                                                        {order.address.city}, {order.address.state}, {order.address.zipcode}
                                                    </p>
                                                    <p className="text-gray-600">{order.address.country}</p>
                                                    <p className="flex items-center gap-2 mt-2 text-gray-700">
                                                        <Phone className="w-4 h-4" />
                                                        {order.address.phone}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Payment info */}
                                            <div>
                                                <h5 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                                                    <CreditCard className="w-5 h-5" />
                                                    Payment Information
                                                </h5>
                                                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Method:</span>
                                                        <span className="font-medium">{order.paymentMethod}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Status:</span>
                                                        <span className={`font-medium ${order.payment ? "text-green-600" : "text-red-600"}`}>
                                                            {order.payment ? "Completed" : "Pending"}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Amount:</span>
                                                        <span className="font-medium">₹ {order.amount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status control */}
                                            <div>
                                                <h5 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                                                    <Truck className="w-5 h-5" />
                                                    Order Status
                                                </h5>
                                                <select
                                                    onChange={(event) => statusHandler(event, order._id)}
                                                    value={order.status}
                                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
    );
};

export default Order;
