import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../constants';
import { toast } from 'react-toastify';
import {
    Truck, Package, Phone, ChevronDown, ShoppingBag,
    Clock, CheckCircle, Search, XCircle, CreditCard,
    MapPin, RefreshCcw
} from 'lucide-react';
import PageShell from '../components/PageShell';

const STATUSES = ['Order Placed', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const STATUS_MAP = {
    'Order Placed':    { cls: 'bg-amber-50 border-amber-100 text-amber-700',  dot: 'bg-amber-500',   Icon: Clock },
    'Packing':         { cls: 'bg-blue-50 border-blue-100 text-blue-700',     dot: 'bg-blue-500',    Icon: Package },
    'Shipped':         { cls: 'bg-indigo-50 border-indigo-100 text-indigo-700', dot: 'bg-indigo-500', Icon: Truck },
    'Out for Delivery':{ cls: 'bg-violet-50 border-violet-100 text-violet-700', dot: 'bg-violet-500', Icon: Truck },
    'Delivered':       { cls: 'bg-emerald-50 border-emerald-100 text-emerald-700', dot: 'bg-emerald-500', Icon: CheckCircle },
    'Cancelled':       { cls: 'bg-red-50 border-red-100 text-red-700',        dot: 'bg-red-500',     Icon: XCircle },
};

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const StatusBadge = ({ status }) => {
    const s = STATUS_MAP[status] || { cls: 'bg-brand-surface border-brand-border text-brand-text-secondary', dot: 'bg-brand-text-secondary' };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border ${s.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
            {status}
        </span>
    );
};

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/api/order/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setOrders(res.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, status) => {
        const token = sessionStorage.getItem('token');
        try {
            const res = await axios.put(`${backendUrl}/api/order/status/${orderId}`, { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
                toast.success('Status updated');
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to update status');
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filtered = orders.filter(o => {
        const name = `${o.address?.firstName || ''} ${o.address?.lastName || ''}`.toLowerCase();
        const matchSearch = !search || name.includes(search.toLowerCase()) || o._id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || o.status === statusFilter;
        const validPayment = o.payment === true || o.paymentMethod === 'COD' || o.method === 'cod';
        return matchSearch && matchStatus && validPayment;
    });

    // Tab counts
    const counts = STATUSES.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length;
        return acc;
    }, {});

    if (loading && orders.length === 0) {
        return (
            <PageShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-8 h-8 border-[3px] border-black border-t-transparent animate-spin" />
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            {/* Header */}
            <div className="bg-white border border-brand-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-0.5">Admin Panel</p>
                    <h1 className="text-xl font-black text-brand-text-primary uppercase tracking-tight">Orders</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#F8F8F6] border border-brand-border text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length} Active
                    </div>
                    <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 border border-brand-border hover:bg-[#F8F8F6] text-[10px] font-black uppercase tracking-widest transition-colors">
                        <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Status tabs */}
            <div className="bg-white border border-brand-border p-3 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                    <button
                        onClick={() => setStatusFilter('')}
                        className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-colors ${!statusFilter ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'text-brand-text-secondary border-brand-border hover:border-black hover:text-black'}`}
                    >
                        All ({orders.length})
                    </button>
                    {STATUSES.map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
                            className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border transition-colors flex items-center gap-1.5 ${statusFilter === s ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'text-brand-text-secondary border-brand-border hover:border-black hover:text-black'}`}
                        >
                            <span>{s}</span>
                            {counts[s] > 0 && <span className={`px-1.5 py-0.5 text-[8px] font-black rounded-full ${statusFilter === s ? 'bg-white/20' : 'bg-[#F8F8F6]'}`}>{counts[s]}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                <input
                    type="text"
                    placeholder="Search by customer name or order ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border border-brand-border pl-11 pr-4 py-3 text-sm text-brand-text-primary placeholder:text-brand-text-secondary/50 focus:outline-none focus:border-black transition-colors"
                />
            </div>

            {/* Orders list */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-white border border-brand-border p-16 text-center">
                        <ShoppingBag className="w-8 h-8 text-brand-text-secondary mx-auto mb-3" />
                        <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">No orders match your filters</p>
                    </div>
                ) : filtered.map(order => {
                    const isOpen = expanded === order._id;
                    const sm = STATUS_MAP[order.status] || {};
                    return (
                        <div key={order._id} className={`bg-white border transition-all ${isOpen ? 'border-black' : 'border-brand-border hover:border-gray-400'}`}>
                            {/* Summary row */}
                            <div
                                className="p-4 cursor-pointer"
                                onClick={() => setExpanded(isOpen ? null : order._id)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Left: ID + Customer */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-9 h-9 bg-[#F8F8F6] border border-brand-border flex items-center justify-center shrink-0 text-xs font-black text-brand-text-primary">
                                            {(order.address?.firstName || 'O').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-black text-brand-text-primary uppercase tracking-tight">
                                                    {order.address?.firstName} {order.address?.lastName}
                                                </span>
                                                <span className="text-[9px] font-bold text-brand-text-secondary border border-brand-border px-1.5 py-0.5 bg-[#F8F8F6]">
                                                    #{order._id.slice(-6).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5 text-[9px] font-bold text-brand-text-secondary uppercase tracking-widest flex-wrap">
                                                <span>{new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                <span>·</span>
                                                <span>{order.items?.length || 0} items</span>
                                                <span>·</span>
                                                <span className="text-brand-text-primary font-black">{fmt(order.amount)}</span>
                                                <span>·</span>
                                                <span>{order.paymentMethod}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: status + chevron */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <StatusBadge status={order.status} />
                                        <ChevronDown className={`w-4 h-4 text-brand-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded details */}
                            {isOpen && (
                                <div className="border-t border-brand-border bg-[#F8F8F6] p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Items */}
                                        <div>
                                            <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-3">Order Items</p>
                                            <div className="space-y-2">
                                                {order.items?.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 bg-white border border-brand-border p-3">
                                                        <div className="w-10 h-10 bg-[#F8F8F6] border border-brand-border flex items-center justify-center shrink-0">
                                                            <ShoppingBag className="w-4 h-4 text-brand-text-secondary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-brand-text-primary uppercase tracking-tight truncate">{item.name}</p>
                                                            <p className="text-[9px] text-brand-text-secondary font-bold uppercase">Size: {item.size} · Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-xs font-black text-brand-text-primary shrink-0">{fmt(item.price)}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Payment */}
                                            <div className="flex items-center gap-2 mt-3 bg-white border border-brand-border px-3 py-2 w-fit text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">
                                                <CreditCard className="w-3.5 h-3.5" />
                                                {order.paymentMethod} ·{' '}
                                                <span className={order.payment ? 'text-emerald-600' : 'text-amber-600'}>
                                                    {order.payment ? 'Paid' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Shipping + Status update */}
                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-3">Shipping Address</p>
                                                <div className="bg-white border border-brand-border p-4 space-y-1">
                                                    <p className="text-sm font-bold text-brand-text-primary">{order.address?.firstName} {order.address?.lastName}</p>
                                                    <p className="text-[10px] text-brand-text-secondary font-bold uppercase">{order.address?.street}</p>
                                                    <p className="text-[10px] text-brand-text-secondary font-bold uppercase">{order.address?.city}, {order.address?.state} {order.address?.zipcode}</p>
                                                    <p className="text-[10px] text-brand-text-secondary font-bold uppercase">{order.address?.country}</p>
                                                    {order.address?.phone && (
                                                        <div className="flex items-center gap-1.5 pt-2 text-[10px] font-black text-brand-text-primary uppercase">
                                                            <Phone className="w-3 h-3" />
                                                            {order.address.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest mb-2">Update Status</p>
                                                <div className="relative">
                                                    <select
                                                        value={order.status}
                                                        onChange={e => updateStatus(order._id, e.target.value)}
                                                        className="w-full appearance-none bg-white border border-brand-border text-sm font-bold text-brand-text-primary px-4 py-3 pr-10 focus:outline-none focus:border-black transition-colors cursor-pointer"
                                                    >
                                                        {STATUSES.map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary pointer-events-none" />
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

            {filtered.length > 0 && (
                <p className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest text-center">
                    Showing {filtered.length} of {orders.length} orders
                </p>
            )}
        </PageShell>
    );
};

export default Order;
