import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { backendUrl } from '../constants';
import { toast } from 'react-toastify';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { TrendingUp, ShoppingBag, Users, Package, RefreshCcw, BarChart3, PieChart, Calendar } from 'lucide-react';
import PageShell from '../components/PageShell';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const Card = ({ children, className = '' }) => (
    <div className={`bg-white border border-brand-border ${className}`}>{children}</div>
);

const SectionHead = ({ icon: Icon, title, sub }) => (
    <div className="flex items-center gap-3 p-5 border-b border-brand-border">
        <div className="p-2 bg-[#F8F8F6] border border-brand-border">
            <Icon className="w-4 h-4 text-brand-text-primary" />
        </div>
        <div>
            <p className="text-xs font-black text-brand-text-primary uppercase tracking-tight">{title}</p>
            {sub && <p className="text-[10px] text-brand-text-secondary font-bold uppercase tracking-widest">{sub}</p>}
        </div>
    </div>
);

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CHART_COLORS = ['#1A1A1A', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

const tooltipBase = {
    backgroundColor: '#fff', titleColor: '#1A1A1A', bodyColor: '#1A1A1A',
    borderColor: '#E5E5E0', borderWidth: 1, cornerRadius: 0,
    titleFont: { family: 'Inter', size: 11, weight: '900' },
    bodyFont: { family: 'Inter', size: 10, weight: '700' }, padding: 12, displayColors: false,
};

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const token = sessionStorage.getItem('token');
            const [ordersRes, productsRes] = await Promise.all([
                axios.get(`${backendUrl}/api/order/list`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { success: false, orders: [] } })),
                axios.get(`${backendUrl}/api/product/list`).catch(() => ({ data: { success: false, products: [] } })),
            ]);

            const orders   = ordersRes?.data?.success  ? ordersRes.data.orders   : [];
            const products = productsRes?.data?.success ? productsRes.data.products : [];

            // ── Revenue by category ──────────────────────────────────────────
            const revByCategory = {};
            orders.forEach(o => {
                (o.items || []).forEach(item => {
                    const cat = item.category || 'Other';
                    revByCategory[cat] = (revByCategory[cat] || 0) + (item.price || 0) * (item.quantity || 1);
                });
            });

            // ── Revenue & orders by month (last 12 months) ───────────────────
            const now = new Date();
            const monthLabels = [];
            const monthRevenue = [];
            const monthOrders = [];
            for (let i = 11; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                monthLabels.push(MONTHS[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2));
                const mo = orders.filter(o => {
                    const od = new Date(o.date);
                    return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
                });
                monthRevenue.push(mo.reduce((s, o) => s + (o.amount || 0), 0));
                monthOrders.push(mo.length);
            }

            // ── Orders by day of week ────────────────────────────────────────
            const byDay = Array(7).fill(0);
            orders.forEach(o => { byDay[new Date(o.date).getDay()]++; });

            // ── Orders by hour of day ────────────────────────────────────────
            const byHour = Array(24).fill(0);
            orders.forEach(o => { byHour[new Date(o.date).getHours()]++; });

            // ── Payment method split ─────────────────────────────────────────
            const paymentSplit = orders.reduce((acc, o) => {
                const m = o.paymentMethod || 'COD';
                acc[m] = (acc[m] || 0) + 1;
                return acc;
            }, {});

            // ── Category product count ───────────────────────────────────────
            const productsByCategory = products.reduce((acc, p) => {
                acc[p.category || 'Other'] = (acc[p.category || 'Other'] || 0) + 1;
                return acc;
            }, {});

            // ── New vs Returning customers ───────────────────────────────────
            const customerOrders = {};
            orders.forEach(o => {
                const uid = o.userId?._id || o.userId || 'anon';
                customerOrders[uid] = (customerOrders[uid] || 0) + 1;
            });
            const newCustomers      = Object.values(customerOrders).filter(c => c === 1).length;
            const returningCustomers = Object.values(customerOrders).filter(c => c > 1).length;

            // ── Avg order value trend (last 6 months) ────────────────────────
            const aovLabels = [];
            const aovData   = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                aovLabels.push(MONTHS[d.getMonth()]);
                const mo = orders.filter(o => {
                    const od = new Date(o.date);
                    return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
                });
                aovData.push(mo.length > 0 ? mo.reduce((s, o) => s + (o.amount || 0), 0) / mo.length : 0);
            }

            // ── Top 5 categories by revenue ──────────────────────────────────
            const topCats = Object.entries(revByCategory).sort((a, b) => b[1] - a[1]).slice(0, 5);

            setData({
                orders, products,
                revByCategory, topCats,
                monthLabels, monthRevenue, monthOrders,
                byDay, byHour,
                paymentSplit, productsByCategory,
                newCustomers, returningCustomers,
                aovLabels, aovData,
                totalRevenue: orders.reduce((s, o) => s + (o.amount || 0), 0),
                totalOrders: orders.length,
                totalProducts: products.length,
                totalCustomers: new Set(orders.map(o => o.userId?._id || o.userId).filter(Boolean)).size,
            });
        } catch (err) {
            toast.error('Failed to load analytics');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    if (loading || !data) {
        return (
            <PageShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-8 h-8 border-[3px] border-black border-t-transparent animate-spin" />
                </div>
            </PageShell>
        );
    }

    // ── Chart data ─────────────────────────────────────────────────────────────

    const monthBarData = {
        labels: data.monthLabels,
        datasets: [
            {
                label: 'Revenue (₹)',
                data: data.monthRevenue,
                backgroundColor: '#1A1A1A',
                borderRadius: 2,
                yAxisID: 'y',
            },
            {
                label: 'Orders',
                data: data.monthOrders,
                backgroundColor: '#D1D1D1',
                borderRadius: 2,
                yAxisID: 'y1',
            },
        ],
    };

    const monthBarOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom', labels: { color: '#6B6B6B', font: { family: 'Inter', size: 9, weight: '900' }, usePointStyle: true, padding: 16, boxWidth: 6, boxHeight: 6 } },
            tooltip: { ...tooltipBase, callbacks: { label: ctx => ctx.dataset.yAxisID === 'y' ? fmt(ctx.raw) : ctx.raw + ' orders' } },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 8, weight: '700' }, maxRotation: 45 } },
            y:  { position: 'left',  grid: { color: '#F0F0EC', borderDash: [2, 3] }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' }, callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v) } },
            y1: { position: 'right', grid: { display: false }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' } } },
        },
    };

    const dayBarData = {
        labels: DAYS,
        datasets: [{
            label: 'Orders',
            data: data.byDay,
            backgroundColor: data.byDay.map((_, i) => i === new Date().getDay() ? '#1A1A1A' : '#E5E5E0'),
            borderRadius: 2,
        }],
    };

    const dayBarOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { ...tooltipBase, callbacks: { label: ctx => ctx.raw + ' orders' } },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' } } },
            y: { grid: { color: '#F0F0EC', borderDash: [2, 3] }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' } } },
        },
    };

    const paymentDoughnut = {
        labels: Object.keys(data.paymentSplit),
        datasets: [{
            data: Object.values(data.paymentSplit),
            backgroundColor: CHART_COLORS,
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 6,
        }],
    };

    const categoryDoughnut = {
        labels: Object.keys(data.revByCategory),
        datasets: [{
            data: Object.values(data.revByCategory),
            backgroundColor: CHART_COLORS,
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 6,
        }],
    };

    const doughnutOptions = {
        responsive: true, maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            tooltip: { ...tooltipBase },
        },
    };

    const aovLine = {
        labels: data.aovLabels,
        datasets: [{
            label: 'Avg Order Value',
            data: data.aovData,
            borderColor: '#1A1A1A',
            backgroundColor: 'rgba(26,26,26,0.04)',
            borderWidth: 1.5,
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#1A1A1A',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
        }],
    };

    const aovLineOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { ...tooltipBase, callbacks: { label: ctx => fmt(ctx.raw) } },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' } } },
            y: { grid: { color: '#F0F0EC', borderDash: [2, 3] }, ticks: { color: '#9A9A9A', font: { family: 'Inter', size: 9, weight: '700' }, callback: v => '₹' + (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v) } },
        },
    };

    const totalCatRev = Object.values(data.revByCategory).reduce((s, v) => s + v, 0);

    return (
        <PageShell>
            {/* Header */}
            <div className="bg-white border border-brand-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-0.5">Admin Panel</p>
                    <h1 className="text-xl font-black text-brand-text-primary uppercase tracking-tight">Analytics</h1>
                </div>
                <button onClick={load} className="flex items-center gap-2 px-4 py-2 border border-brand-border bg-white hover:bg-[#F8F8F6] text-[10px] font-black uppercase tracking-widest transition-colors">
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: fmt(data.totalRevenue), icon: TrendingUp },
                    { label: 'Total Orders',   value: data.totalOrders.toLocaleString(), icon: ShoppingBag },
                    { label: 'Customers',      value: data.totalCustomers.toLocaleString(), icon: Users },
                    { label: 'Products',       value: data.totalProducts.toLocaleString(), icon: Package },
                ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white border border-brand-border p-5 flex items-center gap-4">
                        <div className="p-3 bg-[#F8F8F6] border border-brand-border shrink-0">
                            <Icon className="w-5 h-5 text-brand-text-primary" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">{label}</p>
                            <p className="text-xl font-black text-brand-text-primary tracking-tight">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 12-month revenue & orders chart */}
            <Card>
                <SectionHead icon={BarChart3} title="Revenue & Orders — Last 12 Months" sub="Monthly comparison" />
                <div className="p-5 h-[280px]">
                    <Bar data={monthBarData} options={monthBarOptions} />
                </div>
            </Card>

            {/* Row 2: AOV trend + Day of week */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card>
                    <SectionHead icon={TrendingUp} title="Avg Order Value Trend" sub="Last 6 months" />
                    <div className="p-5 h-[220px]">
                        <Line data={aovLine} options={aovLineOptions} />
                    </div>
                </Card>
                <Card>
                    <SectionHead icon={Calendar} title="Orders by Day of Week" sub="All-time distribution" />
                    <div className="p-5 h-[220px]">
                        <Bar data={dayBarData} options={dayBarOptions} />
                    </div>
                </Card>
            </div>

            {/* Row 3: Category revenue + Payment split + Customer type */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Revenue by Category */}
                <Card>
                    <SectionHead icon={PieChart} title="Revenue by Category" />
                    <div className="p-5">
                        <div className="h-[160px] flex items-center justify-center">
                            <Doughnut data={categoryDoughnut} options={doughnutOptions} />
                        </div>
                        <div className="mt-4 space-y-2 border-t border-brand-border pt-4">
                            {data.topCats.map(([cat, rev], i) => (
                                <div key={cat} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                        <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">{cat}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-brand-text-primary">{fmt(rev)}</span>
                                        <span className="text-[9px] text-brand-text-secondary ml-1">({totalCatRev > 0 ? ((rev/totalCatRev)*100).toFixed(1) : 0}%)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Payment Split */}
                <Card>
                    <SectionHead icon={ShoppingBag} title="Payment Methods" />
                    <div className="p-5">
                        <div className="h-[160px] flex items-center justify-center">
                            <Doughnut data={paymentDoughnut} options={doughnutOptions} />
                        </div>
                        <div className="mt-4 space-y-2 border-t border-brand-border pt-4">
                            {Object.entries(data.paymentSplit).map(([method, count], i) => {
                                const pct = data.totalOrders > 0 ? ((count / data.totalOrders) * 100).toFixed(1) : 0;
                                return (
                                    <div key={method} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                            <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">{method}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-brand-text-primary">{count} ({pct}%)</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                {/* Customer Type */}
                <Card>
                    <SectionHead icon={Users} title="Customer Retention" />
                    <div className="p-5 space-y-4">
                        <div className="h-[160px] flex items-center justify-center">
                            <Doughnut
                                data={{
                                    labels: ['New Customers', 'Returning'],
                                    datasets: [{ data: [data.newCustomers, data.returningCustomers], backgroundColor: ['#1A1A1A', '#D1D1D1'], borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }],
                                }}
                                options={doughnutOptions}
                            />
                        </div>
                        <div className="mt-4 space-y-3 border-t border-brand-border pt-4">
                            {[
                                { label: 'New Customers',      count: data.newCustomers,       color: '#1A1A1A' },
                                { label: 'Returning Customers', count: data.returningCustomers, color: '#D1D1D1' },
                            ].map(({ label, count, color }) => {
                                const total = data.newCustomers + data.returningCustomers;
                                const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                                return (
                                    <div key={label} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">{label}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-brand-text-primary">{count} ({pct}%)</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Top categories table */}
            <Card>
                <SectionHead icon={BarChart3} title="Category Performance" sub="Revenue contribution breakdown" />
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-border text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">
                                <th className="px-5 py-3">Category</th>
                                <th className="px-5 py-3">Revenue</th>
                                <th className="px-5 py-3">Share</th>
                                <th className="px-5 py-3">Progress</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/40">
                            {Object.entries(data.revByCategory).sort((a, b) => b[1] - a[1]).map(([cat, rev], i) => {
                                const share = totalCatRev > 0 ? (rev / totalCatRev * 100) : 0;
                                return (
                                    <tr key={cat} className="hover:bg-[#F8F8F6] transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                                <span className="text-sm font-bold text-brand-text-primary uppercase tracking-tight">{cat}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 font-black text-brand-text-primary text-sm">{fmt(rev)}</td>
                                        <td className="px-5 py-3 text-[10px] font-black text-brand-text-secondary">{share.toFixed(1)}%</td>
                                        <td className="px-5 py-3 w-40">
                                            <div className="w-full bg-brand-surface border border-brand-border h-1.5">
                                                <div className="h-full bg-[#1A1A1A]" style={{ width: `${share}%` }} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </PageShell>
    );
};

export default Analytics;
