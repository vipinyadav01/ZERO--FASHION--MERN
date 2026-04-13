import { useState, useEffect, useCallback } from 'react';
import { backendUrl } from "../constants";
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    Users,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    AlertCircle,
    RefreshCcw,
    BarChart3,
    CheckCircle2,
    XCircle,
    Clock,
    Truck,
    Wallet,
    Star,
    ChevronRight
} from 'lucide-react';
import { Pie, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmt = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const pct = (val) => (val > 0 ? '+' : '') + val.toFixed(1) + '%';

const STATUS_COLORS = {
    Delivered:  { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', dot: '#10b981' },
    Cancelled:  { bg: 'bg-red-50',     border: 'border-red-100',     text: 'text-red-700',     dot: '#ef4444' },
    Pending:    { bg: 'bg-amber-50',   border: 'border-amber-100',   text: 'text-amber-700',   dot: '#f59e0b' },
    Packing:    { bg: 'bg-blue-50',    border: 'border-blue-100',    text: 'text-blue-700',    dot: '#3b82f6' },
    Shipped:    { bg: 'bg-violet-50',  border: 'border-violet-100',  text: 'text-violet-700',  dot: '#8b5cf6' },
    'Out for Delivery': { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-700',  dot: '#06b6d4' },
};

const statusStyle = (status) =>
    STATUS_COLORS[status] || { bg: 'bg-brand-surface', border: 'border-brand-border', text: 'text-brand-text-secondary', dot: '#6B6B6B' };

// ─── StatCard ─────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, growth, Icon, accent = false }) => {
    const up = growth >= 0;
    return (
        <div className={`group relative flex flex-col gap-4 p-6 border border-brand-border transition-all duration-200 hover:shadow-md ${accent ? 'bg-[#1A1A1A] text-white' : 'bg-white'}`}>
            <div className="flex items-start justify-between">
                <div className={`p-3 border ${accent ? 'border-white/20 bg-white/10 text-white' : 'border-brand-border bg-brand-surface text-brand-text-primary group-hover:bg-[#1A1A1A] group-hover:text-white group-hover:border-[#1A1A1A]'} transition-all`}>
                    <Icon className="w-5 h-5" />
                </div>
                {growth !== undefined && (
                    <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-1 border ${
                        up
                          ? accent ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                          : accent ? 'bg-red-500/20 border-red-400/30 text-red-300'           : 'bg-red-50 border-red-100 text-red-600'
                    }`}>
                        {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(growth).toFixed(1)}%
                    </span>
                )}
            </div>
            <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${accent ? 'text-white/60' : 'text-brand-text-secondary'}`}>{label}</p>
                <p className={`text-2xl font-black tracking-tight ${accent ? 'text-white' : 'text-brand-text-primary'}`}>{value}</p>
                {sub && <p className={`text-[10px] font-bold uppercase tracking-wide mt-1 ${accent ? 'text-white/50' : 'text-brand-text-secondary'}`}>{sub}</p>}
            </div>
        </div>
    );
};

// ─── SectionHeader ────────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-brand-border">
        <div className="p-2 bg-brand-surface border border-brand-border">
            <Icon className="w-4 h-4 text-brand-text-primary" />
        </div>
        <div>
            <h3 className="text-sm font-black text-brand-text-primary uppercase tracking-tight">{title}</h3>
            {subtitle && <p className="text-[10px] text-brand-text-secondary font-bold uppercase tracking-widest">{subtitle}</p>}
        </div>
    </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);
    const [greeting, setGreeting] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [dash, setDash] = useState(null);
    const [dataError, setDataError] = useState(null);

    const getGreeting = useCallback(() => {
        const h = new Date().getHours();
        if (h >= 5 && h < 12) return 'Good Morning';
        if (h >= 12 && h < 18) return 'Good Afternoon';
        return 'Good Evening';
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setDataError(null);
            const token = sessionStorage.getItem('token');
            if (!token) throw new Error('Authentication required');

            const [userRes, ordersRes, productsRes] = await Promise.all([
                axios.get(`${backendUrl}/api/user/user`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
                axios.get(`${backendUrl}/api/order/list`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { success: false, orders: [] } })),
                axios.get(`${backendUrl}/api/product/list`).catch(() => ({ data: { success: false, products: [] } })),
            ]);

            if (userRes?.data?.success) setCurrentUser(userRes.data.user.name);

            const orders   = ordersRes?.data?.success  ? ordersRes.data.orders   : [];
            const products = productsRes?.data?.success ? productsRes.data.products : [];

            // ── date helpers ──────────────────────────────────────────────────
            const now       = new Date();
            const CM        = now.getMonth();
            const CY        = now.getFullYear();
            const LM        = CM === 0 ? 11 : CM - 1;
            const LY        = CM === 0 ? CY - 1 : CY;

            const inMonth = (o, m, y) => { const d = new Date(o.date); return d.getMonth() === m && d.getFullYear() === y; };

            const curOrders  = orders.filter(o => inMonth(o, CM, CY));
            const prevOrders = orders.filter(o => inMonth(o, LM, LY));

            const sumAmt = (arr) => arr.reduce((s, o) => s + (o.amount || 0), 0);

            const totalRevenue   = sumAmt(orders);
            const curRevenue     = sumAmt(curOrders);
            const prevRevenue    = sumAmt(prevOrders);
            const revenueGrowth  = prevRevenue > 0 ? ((curRevenue - prevRevenue) / prevRevenue * 100) : (curRevenue > 0 ? 100 : 0);
            const orderGrowth    = prevOrders.length > 0 ? ((curOrders.length - prevOrders.length) / prevOrders.length * 100) : (curOrders.length > 0 ? 100 : 0);

            const uniqueCustomers = new Set(orders.map(o => o.userId?.email || o.userId?._id).filter(Boolean));
            const curCustomers    = new Set(curOrders.map(o => o.userId?.email || o.userId?._id).filter(Boolean));
            const prevCustomers   = new Set(prevOrders.map(o => o.userId?.email || o.userId?._id).filter(Boolean));
            const custGrowth      = prevCustomers.size > 0 ? ((curCustomers.size - prevCustomers.size) / prevCustomers.size * 100) : (curCustomers.size > 0 ? 100 : 0);

            const avgOrderValue  = orders.length > 0 ? totalRevenue / orders.length : 0;
            const curAOV         = curOrders.length > 0 ? curRevenue / curOrders.length : 0;
            const prevAOV        = prevOrders.length > 0 ? prevRevenue / prevOrders.length : 0;
            const aovGrowth      = prevAOV > 0 ? ((curAOV - prevAOV) / prevAOV * 100) : 0;

            const lowStockCount  = products.filter(p => (p.stock || 0) < 10).length;
            const inStockCount   = products.filter(p => (p.stock || 0) >= 10).length;

            // ── order status breakdown ────────────────────────────────────────
            const statusCounts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
            const deliveredPct = orders.length > 0 ? ((statusCounts['Delivered'] || 0) / orders.length * 100) : 0;
            const cancelledPct = orders.length > 0 ? ((statusCounts['Cancelled'] || 0) / orders.length * 100) : 0;

            // ── payment method breakdown ──────────────────────────────────────
            const paymentMethods = orders.reduce((acc, o) => {
                const m = o.paymentMethod || 'Unknown';
                acc[m] = (acc[m] || 0) + 1;
                return acc;
            }, {});

            // ── top products ──────────────────────────────────────────────────
            const productSales = {};
            orders.forEach(order => {
                (order.items || []).forEach(item => {
                    const key = item.name;
                    if (!productSales[key]) productSales[key] = { name: item.name, image: item.image, qty: 0, revenue: 0 };
                    productSales[key].qty     += item.quantity || 0;
                    productSales[key].revenue += (item.quantity || 0) * (item.price || 0);
                });
            });
            const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

            // ── revenue chart: last 30 days ───────────────────────────────────
            const days30 = Array.from({ length: 30 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (29 - i)); return d;
            });
            const revenueByDay = days30.map(d => {
                const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const total = orders
                    .filter(o => {
                        const od = new Date(o.date);
                        return od.getDate() === d.getDate() && od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
                    })
                    .reduce((s, o) => s + (o.amount || 0), 0);
                return { label, total };
            });

            // ── monthly comparison: last 6 months ────────────────────────────
            const months6 = Array.from({ length: 6 }, (_, i) => {
                const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); return d;
            });
            const monthlyData = months6.map(d => {
                const label = d.toLocaleDateString('en-US', { month: 'short' });
                const rev   = orders.filter(o => inMonth(o, d.getMonth(), d.getFullYear())).reduce((s, o) => s + (o.amount || 0), 0);
                const cnt   = orders.filter(o => inMonth(o, d.getMonth(), d.getFullYear())).length;
                return { label, revenue: rev, orders: cnt };
            });

            setDash({
                totalRevenue, curRevenue, prevRevenue, revenueGrowth,
                totalOrders: orders.length, curOrders: curOrders.length, orderGrowth,
                avgOrderValue, curAOV, aovGrowth,
                totalCustomers: uniqueCustomers.size, custGrowth,
                totalProducts: products.length, lowStockCount, inStockCount,
                deliveredPct, cancelledPct,
                statusCounts, paymentMethods,
                topProducts,
                recentOrders: [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8),
                revenueByDay, monthlyData,
            });

            setLastRefresh(new Date());
        } catch (err) {
            setDataError(err.message);
            toast.error('Dashboard error: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setGreeting(getGreeting());
        fetchData();
        const t = setInterval(fetchData, 30000);
        return () => clearInterval(t);
    }, [getGreeting, fetchData]);

    // ── chart configs ─────────────────────────────────────────────────────────

    const baseTooltip = {
        backgroundColor: '#fff',
        titleColor: '#1A1A1A',
        bodyColor: '#1A1A1A',
        borderColor: '#E5E5E0',
        borderWidth: 1,
        titleFont: { family: 'Inter', size: 11, weight: '900' },
        bodyFont: { family: 'Inter', size: 10, weight: '700' },
        padding: 12,
        cornerRadius: 0,
        displayColors: false,
    };

    const lineChartData = dash ? {
        labels: dash.revenueByDay.map(d => d.label),
        datasets: [{
            label: 'Revenue (₹)',
            data: dash.revenueByDay.map(d => d.total),
            borderColor: '#1A1A1A',
            backgroundColor: 'rgba(26,26,26,0.04)',
            borderWidth: 1.5,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointBackgroundColor: '#1A1A1A',
        }],
    } : { labels: [], datasets: [] };

    const lineOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { ...baseTooltip, callbacks: { label: ctx => fmt(ctx.raw) } },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' }, maxTicksLimit: 8 } },
            y: { grid: { color: '#F0F0EC', borderDash: [2, 3] }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' }, callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v) } },
        },
    };

    const barChartData = dash ? {
        labels: dash.monthlyData.map(d => d.label),
        datasets: [
            {
                label: 'Revenue (₹)',
                data: dash.monthlyData.map(d => d.revenue),
                backgroundColor: '#1A1A1A',
                borderWidth: 0,
                borderRadius: 2,
                yAxisID: 'y',
            },
            {
                label: 'Orders',
                data: dash.monthlyData.map(d => d.orders),
                backgroundColor: '#D1D1D1',
                borderWidth: 0,
                borderRadius: 2,
                yAxisID: 'y1',
            },
        ],
    } : { labels: [], datasets: [] };

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true, position: 'bottom',
                labels: { color: '#6B6B6B', font: { family: 'Inter', size: 9, weight: '900' }, usePointStyle: true, padding: 16, boxWidth: 6, boxHeight: 6 },
            },
            tooltip: { ...baseTooltip, callbacks: { label: ctx => ctx.dataset.yAxisID === 'y' ? fmt(ctx.raw) : ctx.raw + ' orders' } },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' } } },
            y:  { grid: { color: '#F0F0EC', borderDash: [2, 3] }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' }, callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v) }, position: 'left' },
            y1: { grid: { display: false }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' } }, position: 'right' },
        },
    };

    const pieColors = ['#1A1A1A', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#06b6d4'];
    const pieData = dash ? {
        labels: Object.keys(dash.statusCounts).map(s => s),
        datasets: [{
            data: Object.values(dash.statusCounts),
            backgroundColor: Object.keys(dash.statusCounts).map((s, i) => STATUS_COLORS[s]?.dot || pieColors[i % pieColors.length]),
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 8,
        }],
    } : { labels: [], datasets: [] };

    const pieOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                ...baseTooltip,
                callbacks: { label: ctx => `${ctx.label}: ${ctx.raw} (${((ctx.raw / (dash?.totalOrders || 1)) * 100).toFixed(1)}%)` },
            },
        },
    };

    // ── render ────────────────────────────────────────────────────────────────

    if (isLoading && !dash) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-bg">
                <div className="w-8 h-8 border-[3px] border-black border-t-transparent animate-spin" />
            </div>
        );
    }

    if (dataError && !dash) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-10">
                <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                <h2 className="text-lg font-black text-brand-text-primary mb-2 uppercase tracking-tight">Failed to Load Dashboard</h2>
                <p className="text-brand-text-secondary text-xs font-bold uppercase tracking-widest mb-6">{dataError}</p>
                <button onClick={fetchData} className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-colors">
                    Retry
                </button>
            </div>
        );
    }

    const d = dash || {};

    return (
        <div className="min-h-screen bg-[#F8F8F6] font-sans">
            <div className="max-w-[1600px] mx-auto p-6 lg:p-8 space-y-8">

                {/* ── Header ─────────────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white border border-brand-border p-6">
                    <div>
                        <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-1">Admin Dashboard</p>
                        <h1 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight">
                            {greeting}, <span className="text-brand-text-secondary">{currentUser || 'Admin'}</span>
                        </h1>
                        <p className="text-[10px] text-brand-text-secondary font-bold uppercase tracking-widest mt-1">
                            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {lastRefresh && (
                            <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest hidden sm:block">
                                Updated {lastRefresh.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={fetchData}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 border border-brand-border bg-white hover:bg-brand-surface text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <div className="flex items-center gap-2 px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Live
                        </div>
                    </div>
                </div>

                {/* ── Primary KPIs ─────────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Revenue"
                        value={fmt(d.totalRevenue || 0)}
                        sub={`This month: ${fmt(d.curRevenue || 0)}`}
                        growth={d.revenueGrowth}
                        Icon={CreditCard}
                        accent
                    />
                    <StatCard
                        label="Total Orders"
                        value={(d.totalOrders || 0).toLocaleString()}
                        sub={`This month: ${d.curOrders || 0} orders`}
                        growth={d.orderGrowth}
                        Icon={ShoppingBag}
                    />
                    <StatCard
                        label="Avg Order Value"
                        value={fmt(d.avgOrderValue || 0)}
                        sub={`This month: ${fmt(d.curAOV || 0)}`}
                        growth={d.aovGrowth}
                        Icon={TrendingUp}
                    />
                    <StatCard
                        label="Total Customers"
                        value={(d.totalCustomers || 0).toLocaleString()}
                        sub={`This month: ${(d.curOrders || 0) > 0 ? 'Active' : 'None'}`}
                        growth={d.custGrowth}
                        Icon={Users}
                    />
                </div>

                {/* ── Secondary KPIs ──────────────────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: 'Total Products',  value: d.totalProducts || 0,           Icon: Package,      color: '' },
                        { label: 'In Stock',         value: d.inStockCount || 0,             Icon: CheckCircle2, color: 'text-emerald-600' },
                        { label: 'Low Stock',        value: d.lowStockCount || 0,            Icon: AlertCircle,  color: 'text-amber-600' },
                        { label: 'Delivered',        value: `${(d.deliveredPct || 0).toFixed(1)}%`, Icon: CheckCircle2, color: 'text-emerald-600' },
                        { label: 'Cancelled',        value: `${(d.cancelledPct || 0).toFixed(1)}%`, Icon: XCircle,     color: 'text-red-600' },
                        { label: 'Pending',          value: d.statusCounts?.Pending || 0,   Icon: Clock,        color: 'text-amber-600' },
                    ].map(({ label, value, Icon, color }) => (
                        <div key={label} className="bg-white border border-brand-border p-4 flex flex-col gap-3">
                            <Icon className={`w-4 h-4 ${color || 'text-brand-text-secondary'}`} />
                            <div>
                                <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">{label}</p>
                                <p className={`text-xl font-black tracking-tight ${color || 'text-brand-text-primary'}`}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Charts Row ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Revenue — 30-day line */}
                    <div className="lg:col-span-2 bg-white border border-brand-border p-6">
                        <SectionHeader icon={BarChart3} title="Revenue — Last 30 Days" subtitle="Daily revenue trend" />
                        <div className="h-[260px]">
                            <Line data={lineChartData} options={lineOptions} />
                        </div>
                    </div>

                    {/* Order Status Pie */}
                    <div className="bg-white border border-brand-border p-6 flex flex-col">
                        <SectionHeader icon={ShoppingBag} title="Order Status" subtitle="All-time distribution" />
                        <div className="flex-1 flex items-center justify-center min-h-[180px]">
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                        <div className="mt-4 space-y-2 border-t border-brand-border pt-4">
                            {Object.entries(d.statusCounts || {}).map(([status, count], i) => {
                                const col = STATUS_COLORS[status]?.dot || pieColors[i % pieColors.length];
                                const pctVal = d.totalOrders > 0 ? ((count / d.totalOrders) * 100).toFixed(1) : '0.0';
                                return (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: col }} />
                                            <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">{status}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-brand-text-primary">{count}</span>
                                            <span className="text-[9px] font-bold text-brand-text-secondary">({pctVal}%)</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── Monthly Comparison Bar Chart ─────────────────────────── */}
                <div className="bg-white border border-brand-border p-6">
                    <SectionHeader icon={BarChart3} title="Monthly Overview — Last 6 Months" subtitle="Revenue vs order volume" />
                    <div className="h-[220px]">
                        <Bar data={barChartData} options={barOptions} />
                    </div>
                </div>

                {/* ── Bottom Row ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white border border-brand-border p-6">
                        <SectionHeader icon={ShoppingBag} title="Recent Orders" subtitle="Latest 8 transactions" />
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest border-b border-brand-border">
                                        <th className="pb-3 pl-1">Order</th>
                                        <th className="pb-3">Customer</th>
                                        <th className="pb-3 hidden sm:table-cell">Date</th>
                                        <th className="pb-3 hidden sm:table-cell">Payment</th>
                                        <th className="pb-3">Amount</th>
                                        <th className="pb-3 text-right pr-1">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-border/40">
                                    {(d.recentOrders || []).map((order) => {
                                        const s = statusStyle(order.status);
                                        return (
                                            <tr key={order._id} className="hover:bg-brand-surface transition-colors">
                                                <td className="py-3 pl-1">
                                                    <p className="text-xs font-black text-brand-text-primary tracking-tighter">#{order._id?.slice(-6).toUpperCase()}</p>
                                                    <p className="text-[9px] text-brand-text-secondary font-bold uppercase">{order.items?.length || 0} items</p>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 bg-brand-surface border border-brand-border flex items-center justify-center text-[9px] font-black shrink-0">
                                                            {(order.address?.firstName || 'C').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-brand-text-primary whitespace-nowrap">
                                                                {order.address?.firstName || 'Customer'} {order.address?.lastName || ''}
                                                            </p>
                                                            <p className="text-[9px] text-brand-text-secondary font-bold uppercase hidden sm:block">
                                                                {order.address?.city || '—'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-xs text-brand-text-secondary font-medium hidden sm:table-cell whitespace-nowrap">
                                                    {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                </td>
                                                <td className="py-3 hidden sm:table-cell">
                                                    <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest flex items-center gap-1">
                                                        <Wallet className="w-3 h-3" />
                                                        {order.paymentMethod || 'COD'}
                                                    </span>
                                                </td>
                                                <td className="py-3 font-black text-sm text-brand-text-primary whitespace-nowrap">
                                                    {fmt(order.amount)}
                                                </td>
                                                <td className="py-3 text-right pr-1">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${s.bg} ${s.border} ${s.text}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.dot }} />
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {!(d.recentOrders?.length) && (
                                        <tr>
                                            <td colSpan={6} className="py-10 text-center text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">
                                                No orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Side panel */}
                    <div className="space-y-6">

                        {/* Top Products */}
                        <div className="bg-white border border-brand-border p-6">
                            <SectionHeader icon={Star} title="Top Products" subtitle="By units sold" />
                            <div className="space-y-3">
                                {(d.topProducts || []).map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-brand-surface border border-brand-border hover:bg-white transition-all">
                                        <span className="text-[10px] font-black text-brand-text-secondary w-4 shrink-0">#{i + 1}</span>
                                        <div className="w-10 h-10 bg-white border border-brand-border overflow-hidden shrink-0">
                                            {p.image ? (
                                                <img src={Array.isArray(p.image) ? p.image[0] : p.image} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-4 h-4 text-brand-text-secondary" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-brand-text-primary truncate uppercase tracking-tight">{p.name}</p>
                                            <p className="text-[9px] text-brand-text-secondary font-bold uppercase">{p.qty} sold · {fmt(p.revenue)}</p>
                                        </div>
                                    </div>
                                ))}
                                {!(d.topProducts?.length) && (
                                    <p className="text-center text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest py-4">No sales data</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Method Breakdown */}
                        <div className="bg-white border border-brand-border p-6">
                            <SectionHeader icon={Wallet} title="Payment Methods" subtitle="Order count by type" />
                            <div className="space-y-3">
                                {Object.entries(d.paymentMethods || {}).map(([method, count]) => {
                                    const pctVal = d.totalOrders > 0 ? (count / d.totalOrders * 100) : 0;
                                    return (
                                        <div key={method}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-black text-brand-text-primary uppercase tracking-widest">{method}</span>
                                                <span className="text-[10px] font-black text-brand-text-secondary">{count} ({pctVal.toFixed(1)}%)</span>
                                            </div>
                                            <div className="w-full bg-brand-surface border border-brand-border h-1.5">
                                                <div className="h-full bg-[#1A1A1A] transition-all duration-500" style={{ width: `${pctVal}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {!Object.keys(d.paymentMethods || {}).length && (
                                    <p className="text-center text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest py-4">No data</p>
                                )}
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        {(d.lowStockCount || 0) > 0 && (
                            <div className="bg-amber-50 border border-amber-200 p-5">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-amber-800 font-black text-xs uppercase tracking-tight mb-1">Inventory Alert</p>
                                        <p className="text-amber-700 text-[10px] font-bold uppercase tracking-wide leading-relaxed mb-3">
                                            {d.lowStockCount} product{d.lowStockCount > 1 ? 's' : ''} below 10 units.
                                        </p>
                                        <button className="flex items-center gap-1 text-[10px] font-black text-amber-800 uppercase tracking-widest hover:underline">
                                            Review Inventory <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
