import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";
import {
    Truck,
    Package,
    Phone,
    ChevronDown,
    ShoppingBag,
    Clock,
    CheckCircle,
    Search,
    Filter,
    XCircle,
    CreditCard
} from "lucide-react";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const fetchAllOrders = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            setError("Authentication required");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${backendUrl}/api/order/list`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                // Sort by newest first
                setOrders(response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date)));
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
            const response = await axios.put(
                `${backendUrl}/api/order/status/${orderId}`,
                { status: event.target.value },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.success) {
                await fetchAllOrders();
                toast.success("Order status updated");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const toggleOrderExpansion = (id) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Order Placed": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
            case "Packing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Shipped": return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
            case "Out for Delivery": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "Delivered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "Cancelled": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Order Placed": return Clock;
            case "Packing": return Package;
            case "Shipped": return Truck;
            case "Out for Delivery": return Truck;
            case "Delivered": return CheckCircle;
            case "Cancelled": return XCircle; // Replaced AlertCircle with XCircle for Cancelled
            default: return Package;
        }
    };

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order => {
        const fullName = `${order.address.firstName} ${order.address.lastName}`.toLowerCase();
        const matchesSearch = !searchQuery ||
            fullName.includes(searchQuery.toLowerCase()) ||
            order._id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || order.status === statusFilter;
        
        // Only show orders that have payment completed or are COD orders
        const isPaymentCompleted = order.payment === true;
        const isCOD = order.paymentMethod === "COD" || order.method === "cod";
        const shouldShowOrder = isPaymentCompleted || isCOD;
        
        return matchesSearch && matchesStatus && shouldShowOrder;
    });

    const uniqueStatuses = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                 <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 lg:p-10 font-sans text-slate-100">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header */}
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Order Management</h1>
                        <p className="text-slate-400 text-sm">Track and process customer orders.</p>
                    </div>
                     <div className="flex gap-4">
                         <div className="bg-[#0f111a] border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-3">
                            <span className="text-slate-400 text-xs uppercase font-medium">Pending Orders</span>
                            <span className="text-white font-bold">{orders.filter(o => !["Delivered", "Cancelled"].includes(o.status)).length}</span>
                         </div>
                     </div>
                </div>

                {/* Filters */}
                <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                     <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by ID or customer name..."
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                     <div className="relative w-full md:w-auto">
                        <select
                            className="w-full appearance-none bg-slate-900 border border-slate-700 text-white text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer min-w-[160px]"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>
                </div>

                {error ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-8 text-center">
                         <h2 className="text-lg font-bold text-white mb-1">Unable to Load Orders</h2>
                         <p className="text-slate-400 text-sm mb-4">{error}</p>
                         <button onClick={fetchAllOrders} className="text-rose-400 hover:text-rose-300 text-sm font-medium underline">Retry Connection</button>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center">
                         <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                             <ShoppingBag className="w-8 h-8 text-slate-600" />
                         </div>
                         <h3 className="text-lg font-medium text-white mb-2">No orders found</h3>
                         <p className="text-slate-500 text-sm">No orders match your current search criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const StatusIcon = getStatusIcon(order.status);
                            const isExpanded = expandedOrder === order._id;

                            return (
                                <div
                                    key={order._id}
                                    className={`bg-[#0f111a] border border-slate-800 rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? "ring-1 ring-slate-700" : "hover:border-slate-700"}`}
                                >
                                    {/* Order Summary Row */}
                                    <div 
                                        className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center gap-6"
                                        onClick={() => toggleOrderExpansion(order._id)}
                                    >
                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                                                <Package className="w-5 h-5 text-slate-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-white font-semibold truncate">
                                                        {order.address.firstName} {order.address.lastName}
                                                    </h3>
                                                    <span className="text-slate-500 text-xs">#{order._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{order.items.length} Items</span>
                                                    <span>•</span>
                                                    <span>₹{order.amount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8">
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusStyles(order.status)}`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {order.status}
                                            </div>
                                            
                                            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-slate-800 p-6 bg-slate-900/30">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                
                                                {/* Left Column: Items & Payment */}
                                                <div className="lg:col-span-2 space-y-6">
                                                    <div>
                                                        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Order Items</h4>
                                                        <div className="space-y-3">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-900 border border-slate-800 rounded-lg">
                                                                     <div className="w-12 h-12 bg-slate-800 rounded-md flex items-center justify-center shrink-0">
                                                                        <ShoppingBag className="w-5 h-5 text-slate-600" />
                                                                     </div>
                                                                     <div className="flex-1 min-w-0">
                                                                         <h5 className="text-slate-200 text-sm font-medium truncate">{item.name}</h5>
                                                                         <p className="text-slate-500 text-xs">Size: {item.size} • Qty: {item.quantity}</p>
                                                                     </div>
                                                                     <div className="text-right">
                                                                         <p className="text-slate-300 text-sm font-medium">₹{(item.price || 0).toLocaleString()}</p>
                                                                     </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50 w-fit">
                                                        <CreditCard className="w-4 h-4" />
                                                        <span>Payment Method: <span className="text-slate-200 font-medium">{order.paymentMethod}</span></span>
                                                        <span className="mx-2">•</span>
                                                        <span className={order.payment ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                                                            {order.payment ? "PAID" : "PENDING"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Right Column: Shipping & Status Update */}
                                                <div className="space-y-6">
                                                     <div>
                                                        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Shipping Details</h4>
                                                        <div className="text-sm text-slate-300 space-y-1">
                                                            <p className="font-medium text-white">{order.address.firstName} {order.address.lastName}</p>
                                                            <p>{order.address.street}</p>
                                                            <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                                                            <p>{order.address.country}</p>
                                                            <div className="flex items-center gap-2 mt-2 text-slate-400">
                                                                <Phone className="w-3.5 h-3.5" />
                                                                {order.address.phone}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Update Status</h4>
                                                        <div className="relative">
                                                            <select
                                                                onChange={(e) => statusHandler(e, order._id)}
                                                                value={order.status}
                                                                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                                                            >
                                                                {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                            </select>
                                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Order;