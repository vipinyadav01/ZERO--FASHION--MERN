import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";
import {
    Truck,
    Package,
    Calendar,
    CreditCard,
    MapPin,
    Phone,
    ChevronDown,
    ChevronUp,
    ShoppingBag,
    Clock,
    AlertCircle,
    CheckCircle,
    Search,
    X
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
            setError("Please log in to view orders.");
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
                setOrders(response.data.orders);
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
                toast.success("Order status updated successfully");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            if (error.response?.status === 401) {
                toast.error("Authentication failed. Please log in again.");
            } else if (error.response?.status === 403) {
                toast.error("Admin access required");
            } else {
                toast.error(error.response?.data?.message || "Failed to update order status");
            }
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
            case "Order Placed": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
            case "Packing": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "Shipped": return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
            case "Out for Delivery": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
            case "Delivered": return "bg-green-500/20 text-green-400 border-green-500/30";
            case "Cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
            default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Order Placed": return Clock;
            case "Packing": return Package;
            case "Shipped": return Truck;
            case "Out for Delivery": return Truck;
            case "Delivered": return CheckCircle;
            case "Cancelled": return AlertCircle;
            default: return Package;
        }
    };

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order => {
        const matchesSearch = !searchQuery ||
            order.address.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.address.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order._id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Get unique statuses for filter
    const statuses = [...new Set(orders.map(order => order.status))];


    return (
        <div className="min-h-screen">

            <div className="px-3 pt-8 pb-6 sm:px-4 sm:pt-10 lg:px-6 lg:pt-12">
                <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">


                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-4 sm:p-6">
                        <div className="space-y-4">

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-indigo-500/20">
                                        <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Order Management</h1>
                                        <p className="text-xs sm:text-sm text-slate-400">{filteredOrders.length} orders</p>
                                    </div>
                                </div>


                                <div className="text-right">
                                    <p className="text-xs text-slate-500">Total Orders</p>
                                    <p className="text-lg sm:text-xl font-bold text-indigo-400">{orders.length}</p>
                                </div>
                            </div>


                            <div className="space-y-3">
                                {/* Search Bar */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                                        placeholder="Search by customer name or order ID..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            <X className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
                                        </button>
                                    )}
                                </div>

                                {/* Status Filter */}
                                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                                    <div className="relative flex-shrink-0">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="appearance-none pl-4 pr-10 py-3 bg-gradient-to-r from-slate-700/60 to-slate-600/60 backdrop-blur-sm border border-slate-500/30 text-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all duration-300 hover:bg-slate-600/70 cursor-pointer shadow-lg"
                                        >
                                            <option value="" className="bg-slate-800 text-white">All Statuses</option>
                                            {statuses.map(status => (
                                                <option key={status} value={status} className="bg-slate-800 text-white">{status}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <ChevronDown className="h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>

                                    {/* Active Filters Display */}
                                    <div className="flex items-center gap-2 overflow-x-auto">
                                        {statusFilter && (
                                            <div className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs rounded-full whitespace-nowrap">
                                                <span>Status: {statusFilter}</span>
                                                <button
                                                    onClick={() => setStatusFilter('')}
                                                    className="ml-1 hover:bg-indigo-500/30 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}

                                        {searchQuery && (
                                            <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs rounded-full whitespace-nowrap">
                                                <span>Search: &quot;{searchQuery.slice(0, 15)}{searchQuery.length > 15 ? '...' : ''}&quot;</span>
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="ml-1 hover:bg-purple-500/30 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {(searchQuery || statusFilter) && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                setStatusFilter('');
                                            }}
                                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-300 text-sm rounded-xl hover:from-red-500/30 hover:to-red-600/30 hover:border-red-400/50 transition-all duration-300 active:scale-95 shadow-lg"
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="hidden sm:inline">Clear All</span>
                                            <span className="sm:hidden">Clear</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Section */}
                    {error ? (
                        /* Error State */
                        <div className="relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-6 text-center">
                            <div className="space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-red-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">Error Loading Orders</h3>
                                    <p className="text-sm text-slate-400">{error}</p>
                                </div>
                                <button
                                    onClick={fetchAllOrders}
                                    className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 active:scale-95"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        /* Empty State */
                        <div className="relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-6 text-center">
                            <div className="space-y-4">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-600/20 flex items-center justify-center">
                                    <Package className="w-8 h-8 text-slate-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">No Orders Found</h3>
                                    <p className="text-sm text-slate-400">
                                        {searchQuery || statusFilter ? 'Try adjusting your search or filters' : 'No orders have been placed yet'}
                                    </p>
                                </div>
                                {(searchQuery || statusFilter) && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('');
                                        }}
                                        className="mt-4 px-4 py-2 bg-slate-600/50 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Orders List */
                        <div className="space-y-3 sm:space-y-4">
                            {filteredOrders.map((order, index) => {
                                const StatusIcon = getStatusIcon(order.status);
                                const isExpanded = expandedOrder === index;

                                return (
                                    <div
                                        key={order._id || index}
                                        className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-700/60 transition-all duration-300"
                                    >
                                        {/* Order Header - Mobile optimized */}
                                        <div
                                            className="p-4 sm:p-6 cursor-pointer"
                                            onClick={() => toggleOrderExpansion(index)}
                                        >
                                            <div className="space-y-3 sm:space-y-4">
                                                {/* Mobile-first header layout */}
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <div className={`p-2 sm:p-3 rounded-xl border ${getStatusColor(order.status)}`}>
                                                            <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-white text-sm sm:text-base truncate">
                                                                Order #{order._id.slice(-8)}
                                                            </h4>
                                                            <p className="text-xs sm:text-sm text-slate-400 truncate">
                                                                {order.address.firstName} {order.address.lastName}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right flex-shrink-0">
                                                        <p className="font-bold text-indigo-400 text-sm sm:text-base">
                                                            ₹{order.amount.toFixed(0)}
                                                        </p>
                                                        <button className="text-xs text-slate-400 hover:text-white transition-colors mt-1">
                                                            {isExpanded ? 'Hide' : 'View'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Mobile-first order meta */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            {new Date(order.date).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            {order.items.length} items
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-4 h-4 text-slate-400" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 text-slate-400" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Details - Mobile optimized */}
                                        {isExpanded && (
                                            <div className="border-t border-slate-700/50 p-4 sm:p-6 space-y-4 sm:space-y-6">
                                                <div className="grid gap-4 sm:gap-6">

                                                    {/* Order Items - Mobile-first */}
                                                    <div className="space-y-3">
                                                        <h5 className="font-medium text-slate-300 flex items-center gap-2">
                                                            <Package className="w-4 h-4 text-indigo-400" />
                                                            Order Items
                                                        </h5>
                                                        <div className="space-y-2">
                                                            {order.items.map((item, idx) => (
                                                                <div
                                                                    key={item._id || idx}
                                                                    className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-xl"
                                                                >
                                                                    <div className="w-8 h-8 bg-slate-600/50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        <Package className="w-4 h-4 text-indigo-400" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-white text-sm truncate">{item.name}</p>
                                                                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                                                            <span>Qty: {item.quantity}</span>
                                                                            <span>Size: {item.size}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Two column layout on larger screens */}
                                                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">

                                                        {/* Delivery Address */}
                                                        <div className="space-y-3">
                                                            <h5 className="font-medium text-slate-300 flex items-center gap-2">
                                                                <MapPin className="w-4 h-4 text-indigo-400" />
                                                                Delivery Address
                                                            </h5>
                                                            <div className="p-4 bg-slate-700/40 rounded-xl space-y-2">
                                                                <p className="font-medium text-white">
                                                                    {order.address.firstName} {order.address.lastName}
                                                                </p>
                                                                <p className="text-sm text-slate-300">{order.address.street}</p>
                                                                <p className="text-sm text-slate-300">
                                                                    {order.address.city}, {order.address.state} {order.address.zipcode}
                                                                </p>
                                                                <p className="text-sm text-slate-300">{order.address.country}</p>
                                                                <div className="flex items-center gap-2 pt-2 border-t border-slate-600/50">
                                                                    <Phone className="w-3 h-3 text-indigo-400" />
                                                                    <span className="text-xs text-slate-400">{order.address.phone}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Payment & Status */}
                                                        <div className="space-y-4">
                                                            {/* Payment Information */}
                                                            <div className="space-y-3">
                                                                <h5 className="font-medium text-slate-300 flex items-center gap-2">
                                                                    <CreditCard className="w-4 h-4 text-indigo-400" />
                                                                    Payment
                                                                </h5>
                                                                <div className="p-4 bg-slate-700/40 rounded-xl space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-slate-400">Method:</span>
                                                                        <span className="font-medium text-white text-sm">{order.paymentMethod}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm text-slate-400">Status:</span>
                                                                        <span className={`font-medium text-sm ${order.payment ? "text-green-400" : "text-amber-400"}`}>
                                                                            {order.payment ? "Completed" : "Pending"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center pt-2 border-t border-slate-600/50">
                                                                        <span className="text-sm text-slate-400">Amount:</span>
                                                                        <span className="font-bold text-white">₹{order.amount.toFixed(2)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Order Status Update */}
                                                            <div className="space-y-3">
                                                                <h5 className="font-medium text-slate-300 flex items-center gap-2">
                                                                    <Truck className="w-4 h-4 text-indigo-400" />
                                                                    Update Status
                                                                </h5>
                                                                <select
                                                                    onChange={(event) => statusHandler(event, order._id)}
                                                                    value={order.status}
                                                                    className="w-full p-3 bg-slate-700/50 border border-slate-600/50 text-white text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
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
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Order;