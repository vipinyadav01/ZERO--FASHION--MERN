import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";
import {
    Truck,
    Package,
    MapPin,
    Phone,
    ChevronDown,
    ShoppingBag,
    Clock,
    AlertCircle,
    CheckCircle,
    Search,
    Filter,
    ArrowUpDown,
    Check
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
                toast.success("Order status updated successfully");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update order status");
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
            case "Cancelled": return AlertCircle;
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
        return matchesSearch && matchesStatus;
    });

    const uniqueStatuses = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-medium animate-pulse">Loading execution queue...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Executive Header */}
                <header className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-slate-800/60 p-8 sm:p-12 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] -mr-48 -mt-48 rounded-full animate-pulse"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <ShoppingBag className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">
                                    Order <span className="text-indigo-500">Hub</span>
                                </h1>
                            </div>
                            <p className="text-slate-400 text-lg font-medium max-w-md">
                                Dispatching excellence. Track and manage your global fulfillment operations in real-time.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Queue Depth</p>
                                <p className="text-3xl font-black text-white">{orders.length}</p>
                            </div>
                            <div className="px-6 py-4 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl backdrop-blur-md">
                                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">In Process</p>
                                <p className="text-3xl font-black text-indigo-300">
                                    {orders.filter(o => !["Delivered", "Cancelled"].includes(o.status)).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="relative z-10 mt-12 flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by Order ID or Customer Name..."
                                className="w-full bg-slate-900/80 border border-slate-800 text-white rounded-[2rem] pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium placeholder-slate-600"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                                <select
                                    className="appearance-none bg-slate-900/80 border border-slate-800 text-white rounded-[2rem] pl-14 pr-12 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-bold tracking-tight cursor-pointer min-w-[200px]"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">Status Filter</option>
                                    {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none group-hover:text-white transition-colors" />
                            </div>
                            <button
                                onClick={fetchAllOrders}
                                className="p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
                            >
                                <ArrowUpDown className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </header>

                {error ? (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-[2rem] p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">System Interruption</h2>
                        <p className="text-slate-400 mb-8">{error}</p>
                        <button onClick={fetchAllOrders} className="px-8 py-3 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all">
                            Refresh Connection
                        </button>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-20 text-center">
                        <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-800 shadow-inner">
                            <Package className="w-12 h-12 text-slate-700" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4">No Entries Detected</h3>
                        <p className="text-slate-400 max-w-sm mx-auto text-lg">
                            The requested parameters returned zero results. Broaden your search or check alternative statuses.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredOrders.map((order) => {
                            const StatusIcon = getStatusIcon(order.status);
                            const isExpanded = expandedOrder === order._id;

                            return (
                                <div
                                    key={order._id}
                                    className={`group relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-slate-800/60 transition-all duration-500 ${isExpanded ? "ring-2 ring-indigo-500/40 shadow-2xl py-2" : "hover:border-slate-600 hover:bg-slate-900/40"}`}
                                >
                                    {/* Summary Bar */}
                                    <div 
                                        className="p-8 cursor-pointer flex flex-col lg:flex-row lg:items-center gap-8"
                                        onClick={() => toggleOrderExpansion(order._id)}
                                    >
                                        <div className="flex items-center gap-6 min-w-0 flex-1">
                                            <div className={`p-4 rounded-3xl border ${getStatusStyles(order.status)} shrink-0`}>
                                                <StatusIcon className="w-7 h-7" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-slate-500 font-mono text-xs uppercase tracking-tighter">ID: {order._id.slice(-12)}</span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black text-white truncate leading-none">
                                                    {order.address.firstName} {order.address.lastName}
                                                </h3>
                                                <p className="text-slate-400 text-sm mt-1 font-medium italic">
                                                    {order.address.city}, {order.address.country}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-8 shrink-0">
                                            <div className="text-left lg:text-right">
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Transaction</p>
                                                <p className="text-2xl font-black text-white">₹{order.amount.toLocaleString()}</p>
                                            </div>
                                            <div className="text-left lg:text-right">
                                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Inventory</p>
                                                <p className="text-2xl font-black text-indigo-400">{order.items.length} Units</p>
                                            </div>
                                            <div className="h-10 w-px bg-slate-800 hidden lg:block"></div>
                                            <button 
                                                className={`p-4 rounded-2xl transition-all duration-300 ${isExpanded ? "bg-indigo-600 text-white rotate-180" : "bg-slate-900 text-slate-400 group-hover:text-white"}`}
                                            >
                                                <ChevronDown className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Panel */}
                                    {isExpanded && (
                                        <div className="px-8 pb-10 border-t border-slate-800/60 mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
                                                
                                                {/* Dispatch Details */}
                                                <div className="space-y-8">
                                                    <div>
                                                        <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                            <MapPin className="w-4 h-4" /> Logistics Node
                                                        </h4>
                                                        <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-6 space-y-4">
                                                            <div className="space-y-1">
                                                                <p className="text-white font-bold text-lg">{order.address.firstName} {order.address.lastName}</p>
                                                                <p className="text-slate-400 font-medium leading-relaxed">
                                                                    {order.address.street}<br />
                                                                    {order.address.city}, {order.address.state} {order.address.zipcode}<br />
                                                                    {order.address.country}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                                                                <Phone className="w-4 h-4 text-indigo-500" />
                                                                <p className="text-white font-mono text-sm">{order.address.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                            <Truck className="w-4 h-4" /> Operational Command
                                                        </h4>
                                                        <div className="relative group">
                                                            <select
                                                                onChange={(e) => statusHandler(e, order._id)}
                                                                value={order.status}
                                                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl p-5 appearance-none focus:outline-none transition-colors shadow-lg shadow-indigo-600/10"
                                                            >
                                                                {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                            </select>
                                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white pointer-events-none" />
                                                        </div>
                                                        <p className="text-slate-500 text-[10px] mt-4 font-bold uppercase tracking-widest text-center">Update Fulfillment Status</p>
                                                    </div>
                                                </div>

                                                {/* Manifest */}
                                                <div className="lg:col-span-2 space-y-8">
                                                    <div>
                                                        <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                            <Package className="w-4 h-4" /> Cargo Manifest
                                                        </h4>
                                                        <div className="grid gap-4">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex items-center gap-6 p-4 bg-slate-900/40 border border-slate-800/60 rounded-3xl hover:bg-slate-800/40 transition-colors">
                                                                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700/50">
                                                                        <Package className="w-8 h-8 text-indigo-500/40" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h5 className="text-white font-bold text-lg truncate uppercase tracking-tight">{item.name}</h5>
                                                                        <div className="flex items-center gap-4 mt-1">
                                                                            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-lg">Size: {item.size}</span>
                                                                            <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-lg">Qty: {item.quantity}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-white font-black text-xl">₹{(item.price || 0).toLocaleString()}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="bg-[#0f0f1a] border border-slate-800/80 rounded-3xl p-8">
                                                            <h5 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">Verification</h5>
                                                            <div className="space-y-4">
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-slate-400 font-bold text-xs uppercase">Method</p>
                                                                    <p className="text-white font-black font-mono tracking-tighter">{order.paymentMethod}</p>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-slate-400 font-bold text-xs uppercase">Status</p>
                                                                    <div className={`flex items-center gap-2 font-black ${order.payment ? "text-emerald-500" : "text-amber-500"}`}>
                                                                        {order.payment && <Check className="w-4 h-4" />}
                                                                        {order.payment ? "CLEAR" : "HOLD"}
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-slate-400 font-bold text-xs uppercase">Timestamp</p>
                                                                    <p className="text-white font-mono text-xs">{new Date(order.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-xl shadow-indigo-600/10 relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
                                                            <h5 className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Final Value</h5>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="text-indigo-200 text-lg font-bold">₹</span>
                                                                <span className="text-5xl font-black text-white leading-none tracking-tighter italic">
                                                                    {order.amount.toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-indigo-200/60 text-xs font-bold mt-4 uppercase tracking-[0.2em]">Fulfillment Value</p>
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