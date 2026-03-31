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
        <div className="min-h-screen p-6 lg:p-10 font-sans text-brand-text-primary bg-brand-bg">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Header */}
                 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-10">
                    <div>
                        <h1 className="text-3xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">Order Fulfilment</h1>
                        <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Process and track customer acquisitions</p>
                    </div>
                     <div className="flex gap-4">
                         <div className="bg-white border border-brand-border rounded-none px-6 py-3 flex items-center gap-4">
                            <span className="text-brand-text-secondary text-[10px] uppercase font-black tracking-widest">Active Archives</span>
                            <span className="text-brand-text-primary font-black text-sm">{orders.filter(o => !["Delivered", "Cancelled"].includes(o.status)).length}</span>
                         </div>
                     </div>
                </div>

                {/* Filters */}
                <div className="bg-white border border-brand-border rounded-none p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                     <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                        <input
                            type="text"
                            placeholder="SEARCH REFERENCE OR CUSTOMER..."
                            className="w-full bg-white border border-brand-border text-brand-text-primary rounded-none pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/30"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                     <div className="relative w-full md:w-auto">
                        <select
                            className="w-full appearance-none bg-white border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-none pl-6 pr-12 py-3 focus:outline-none focus:border-brand-accent cursor-pointer min-w-[180px]"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">ALL STATUSES</option>
                            {uniqueStatuses.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                        </select>
                        <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-secondary pointer-events-none" />
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-100 rounded-none p-12 text-center">
                         <h2 className="text-lg font-black text-red-700 mb-2 uppercase tracking-tight">Access Interrupted</h2>
                         <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mb-6">{error}</p>
                         <button onClick={fetchAllOrders} className="text-red-700 hover:underline text-[10px] font-black uppercase tracking-widest decoration-2 underline-offset-4">Retry Archive Connection</button>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white border border-brand-border rounded-none p-20 text-center flex flex-col items-center">
                         <div className="w-20 h-20 bg-brand-surface rounded-none flex items-center justify-center mb-6 border border-brand-border">
                             <ShoppingBag className="w-10 h-10 text-brand-text-secondary" />
                         </div>
                         <h3 className="text-xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">No Results Found</h3>
                         <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Adjust filters to refine your search.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const StatusIcon = getStatusIcon(order.status);
                            const isExpanded = expandedOrder === order._id;

                            return (
                                <div
                                    key={order._id}
                                    className={`bg-white border rounded-none overflow-hidden transition-all duration-500 ${isExpanded ? "border-black shadow-none ring-0" : "border-brand-border hover:border-black"}`}
                                >
                                    {/* Order Summary Row */}
                                    <div 
                                        className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center gap-8"
                                        onClick={() => toggleOrderExpansion(order._id)}
                                    >
                                        <div className="flex items-center gap-6 min-w-0 flex-1">
                                            <div className="w-12 h-12 rounded-none bg-brand-surface border border-brand-border flex items-center justify-center shrink-0">
                                                <Package className="w-6 h-6 text-brand-text-secondary" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-4 mb-2">
                                                    <h3 className="text-brand-text-primary font-black uppercase tracking-tight text-base truncate">
                                                        {order.address.firstName} {order.address.lastName}
                                                    </h3>
                                                    <span className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">#{order._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
                                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 bg-brand-border rounded-none"></span>
                                                    <span>{order.items.length} units</span>
                                                    <span className="w-1 h-1 bg-brand-border rounded-none"></span>
                                                    <span className="text-brand-text-primary">INR {(order.amount || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-10">
                                            <div className={`px-4 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 transition-all ${
                                                order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                order.status === 'Cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                                                'bg-brand-surface border-brand-border text-brand-text-secondary'
                                            }`}>
                                                <StatusIcon className="w-3.5 h-3.5" />
                                                {order.status}
                                            </div>
                                            
                                            <ChevronDown className={`w-5 h-5 text-brand-text-secondary transition-transform duration-500 ${isExpanded ? "rotate-180 text-black" : ""}`} />
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-brand-border p-10 bg-brand-surface">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                                
                                                {/* Left Column: Items & Payment */}
                                                <div className="space-y-10">
                                                    <div>
                                                        <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-6">Archive Composition</h4>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex items-center gap-5 p-5 bg-white border border-brand-border rounded-none hover:border-black transition-all">
                                                                     <div className="w-16 h-16 bg-brand-surface rounded-none border border-brand-border flex items-center justify-center shrink-0 p-1">
                                                                        <ShoppingBag className="w-6 h-6 text-brand-text-secondary" />
                                                                     </div>
                                                                     <div className="flex-1 min-w-0">
                                                                         <h5 className="text-brand-text-primary text-sm font-black uppercase tracking-tight truncate">{item.name}</h5>
                                                                         <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest mt-1">Size: {item.size} • Units: {item.quantity}</p>
                                                                     </div>
                                                                     <div className="text-right">
                                                                         <p className="text-brand-text-primary text-sm font-black tracking-tighter">INR {(item.price || 0).toLocaleString()}</p>
                                                                     </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-[10px] font-black text-brand-text-secondary uppercase tracking-widest bg-white p-5 border border-brand-border w-fit">
                                                        <CreditCard className="w-4 h-4" />
                                                        <span>Processing via <span className="text-brand-text-primary">{order.paymentMethod}</span></span>
                                                        <span className="w-1 h-3 bg-brand-border"></span>
                                                        <span className={order.payment ? "text-emerald-600" : "text-amber-600"}>
                                                            {order.payment ? "Settled" : "Awaiting Clearance"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Right Column: Shipping & Status Update */}
                                                <div className="space-y-10">
                                                     <div>
                                                        <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-6">Dispatch Details</h4>
                                                        <div className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest space-y-2 leading-[1.8]">
                                                            <p className="text-sm font-black text-brand-text-primary tracking-tight">{order.address.firstName} {order.address.lastName}</p>
                                                            <p>{order.address.street}</p>
                                                            <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                                                            <p>{order.address.country}</p>
                                                            <div className="flex items-center gap-3 pt-3 text-brand-text-primary">
                                                                <Phone className="w-4 h-4" />
                                                                {order.address.phone}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-6 border-t border-brand-border">
                                                        <h4 className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-6">Archive Progress Update</h4>
                                                        <div className="relative">
                                                            <select
                                                                onChange={(e) => statusHandler(e, order._id)}
                                                                value={order.status}
                                                                className="w-full bg-white border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-none pl-6 pr-12 py-4 focus:outline-none focus:border-brand-accent transition-all appearance-none cursor-pointer"
                                                            >
                                                                {uniqueStatuses.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                                            </select>
                                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary pointer-events-none" />
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