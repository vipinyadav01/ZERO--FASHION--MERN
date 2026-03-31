import { useState, useEffect, useCallback } from 'react';
import { backendUrl } from "../constants";
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    AlertCircle,
    RefreshCcw,
    BarChart3
} from 'lucide-react';
import { Pie, Line } from "react-chartjs-2";
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

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [greeting, setGreeting] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [dashboardData, setDashboardData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        revenueGrowth: 0,
        orderGrowth: 0,
        lowStockProducts: 0,
        averageOrderValue: 0,
        recentOrders: [],
        topProducts: []
    });

    const [dataError, setDataError] = useState(null);

    const getGreeting = useCallback(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 18) return "Good Afternoon";
        return "Good Evening";
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            setIsLoading(true);
            setDataError(null);
            const token = sessionStorage.getItem("token");
            if (!token) throw new Error("Authentication required");
            
            // Fetch User, Orders, and Products in parallel
            const [userRes, ordersRes, productsRes] = await Promise.all([
                axios.get(`${backendUrl}/api/user/user`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
                axios.get(`${backendUrl}/api/order/list`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { success: false, orders: [] } })),
                axios.get(`${backendUrl}/api/product/list`).catch(() => ({ data: { success: false, products: [] } }))
            ]);

            if (userRes?.data?.success) {
                setCurrentUser(userRes.data.user.name);
            }

            const orders = ordersRes.data.success ? ordersRes.data.orders : [];
            const products = productsRes.data.success ? productsRes.data.products : [];
            
            // Calculate Metrics
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

            const currentMonthOrders = orders.filter(order => {
                const d = new Date(order.date);
                return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
            });

            const lastMonthOrders = orders.filter(order => {
                const d = new Date(order.date);
                return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
            });

            const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
            const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
            const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
            
            const revenueGrowth = lastMonthRevenue > 0 
                ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
                : currentMonthRevenue > 0 ? 100 : 0;
            
            const orderGrowth = lastMonthOrders.length > 0 
                ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100)
                : currentMonthOrders.length > 0 ? 100 : 0;

            const uniqueCustomers = new Set(orders.map(o => o.userId?.email || o.userId?._id).filter(Boolean));
            const lowStockCount = products.filter(p => (p.stock || 0) < 10).length;

            // Calculate Best Selling Products
            const productSales = {};
            orders.forEach(order => {
                if (order.items && Array.isArray(order.items)) {
                    order.items.forEach(item => {
                        if (productSales[item.name]) {
                            productSales[item.name].qty += item.quantity;
                            productSales[item.name].revenue += item.quantity * item.price;
                        } else {
                            productSales[item.name] = {
                                name: item.name,
                                image: item.image, // Assuming item has image
                                qty: item.quantity,
                                revenue: item.quantity * item.price
                            };
                        }
                    });
                }
            });

            const topProducts = Object.values(productSales)
                .sort((a, b) => b.qty - a.qty)
                .slice(0, 5);

            // New Analytics Aggregations
            const statusCounts = orders.reduce((acc, order) => {
                acc[order.status] = (acc[order.status] || 0) + 1;
                return acc;
            }, {});

            const revenueByDate = orders.reduce((acc, order) => {
                const date = new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                acc[date] = (acc[date] || 0) + (order.amount || 0);
                return acc;
            }, {});

            const sortedDates = Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b));

            setDashboardData({
                totalRevenue,
                totalOrders: orders.length,
                totalCustomers: uniqueCustomers.size,
                totalProducts: products.length,
                revenueGrowth,
                orderGrowth,
                lowStockProducts: lowStockCount,
                averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
                recentOrders: orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
                topProducts,
                sortedDates,
                revenueByDate,
                statusCounts
            });

        } catch (error) {
            setDataError(error.message);
            toast.error("Dashboard update failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setGreeting(getGreeting());
        fetchDashboardData();
        const timer = setInterval(fetchDashboardData, 30000); // Auto refresh every 30s
        return () => clearInterval(timer);
    }, [getGreeting, fetchDashboardData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#6B6B6B', font: { family: 'Inter', size: 10, weight: '900' }, usePointStyle: true, padding: 20, boxWidth: 6, boxHeight: 6, textTransform: 'uppercase' }
          },
          tooltip: {
            backgroundColor: '#FFFFFF',
            titleColor: '#1A1A1A',
            bodyColor: '#1A1A1A',
            borderColor: '#E5E5E0',
            borderWidth: 1,
            titleFont: { family: 'Inter', size: 11, weight: '900' },
            bodyFont: { family: 'Inter', size: 10, weight: '700' },
            padding: 12,
            cornerRadius: 0,
            displayColors: false,
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#6B6B6B', font: { family: 'Inter', size: 9, weight: '900' } } },
          y: { grid: { color: '#E5E5E0', borderDash: [2, 2] }, ticks: { color: '#6B6B6B', font: { family: 'Inter', size: 9, weight: '900' } } }
        }
    };

    const revenueChartData = {
        labels: dashboardData.sortedDates,
        datasets: [{
            label: "REVENUE FLOW",
            data: (dashboardData.sortedDates || []).map(d => dashboardData.revenueByDate[d]),
            borderColor: '#1A1A1A',
            backgroundColor: 'rgba(26, 26, 26, 0.03)',
            borderWidth: 2,
            fill: true,
            tension: 0,
            pointBackgroundColor: '#1A1A1A',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 6,
        }]
    };

    const statusPieData = {
        labels: Object.keys(dashboardData.statusCounts || {}).map(s => s.toUpperCase()),
        datasets: [{
            data: Object.values(dashboardData.statusCounts || {}),
            backgroundColor: [
                '#1A1A1A', '#4A4A4A', '#7A7A7A', '#AAAAAA', '#D1D1D1', '#E5E5E0', '#F5F5F0'
            ],
            borderWidth: 1,
            borderColor: '#FFFFFF',
            hoverOffset: 12
        }]
    };

    if (isLoading && !dashboardData.totalOrders) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-brand-bg">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-none animate-spin"></div>
            </div>
        );
    }

    if (dataError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-10 bg-brand-bg">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
                <h2 className="text-xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">System Interrupted</h2>
                <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest mb-6">{dataError}</p>
                <button onClick={fetchDashboardData} className="px-8 py-3 bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-black transition-all">Reconnect to Archive</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 lg:p-10 space-y-12 font-sans bg-brand-bg">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-brand-border pb-8">
                <div>
                    <h1 className="text-4xl font-bold text-brand-text-primary mb-2 uppercase tracking-tight">
                        {greeting}, <span className="text-brand-text-secondary">{currentUser || 'Admin'}</span>
                    </h1>
                    <p className="text-brand-text-secondary uppercase tracking-widest text-xs font-semibold">Store Overview & Real-time Analytics</p>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-brand-surface border border-brand-border rounded-none shadow-sm">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-brand-text-primary uppercase tracking-widest">System Live</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: "Total Revenue", value: formatCurrency(dashboardData.totalRevenue), icon: CreditCard, trend: dashboardData.revenueGrowth },
                    { label: "Total Orders", value: dashboardData.totalOrders, icon: ShoppingBag, trend: dashboardData.orderGrowth },
                    { label: "AOV Matrix", value: formatCurrency(dashboardData.averageOrderValue), icon: TrendingUp, trend: 0 },
                    { label: "Personnel Log", value: dashboardData.totalCustomers, icon: Users, trend: 0 }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-brand-border rounded-none p-8 hover:bg-brand-surface transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-brand-surface text-brand-text-primary group-hover:bg-brand-accent group-hover:text-white transition-all">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.trend !== 0 && (
                                <div className={`flex items-center gap-1 text-[10px] font-black px-3 py-1 rounded-none border ${stat.trend > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'}`}>
                                    {stat.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {Math.abs(stat.trend).toFixed(1)}%
                                </div>
                            )}
                        </div>
                        <h3 className="text-brand-text-secondary text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</h3>
                        <p className="text-3xl font-black text-brand-text-primary tracking-tighter">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Analytical Fusion: Visual Data Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Revenue Trajectory Chart */}
                <div className="lg:col-span-2 bg-white border border-brand-border rounded-none p-10">
                    <div className="flex items-center gap-4 mb-10 border-b border-brand-border pb-6">
                        <div className="p-2 bg-brand-surface border border-brand-border">
                            <BarChart3 className="w-5 h-5 text-brand-text-primary" />
                        </div>
                        <h3 className="text-xl font-black text-brand-text-primary uppercase tracking-tight italic">Fiscal Trajectory</h3>
                    </div>
                    <div className="h-[400px] w-full">
                        <Line data={revenueChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Allocation Distribution Chart */}
                <div className="bg-white border border-brand-border rounded-none p-10 flex flex-col">
                    <div className="mb-10 text-center">
                        <h3 className="text-xl font-black text-brand-text-primary uppercase tracking-tight mb-2 italic">Order Allocation</h3>
                        <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest"> lifecycle distributions</p>
                    </div>
                    <div className="flex-1 relative flex items-center justify-center p-4 min-h-[300px]">
                        <Pie data={statusPieData} options={{...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
                    </div>
                    <div className="grid grid-cols-1 gap-4 mt-10 pt-10 border-t border-brand-border">
                        {Object.entries(dashboardData.statusCounts || {}).slice(0, 4).map(([status, count], i) => (
                            <div key={status} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-none border border-white shrink-0 shadow-sm" style={{ backgroundColor: statusPieData.datasets[0].backgroundColor[i] }}></div>
                                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest group-hover:text-black transition-colors">{status}</p>
                                </div>
                                <p className="text-xs font-black text-brand-text-primary">{count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white border border-brand-border rounded-none p-8">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-brand-border">
                        <h2 className="text-xl font-black text-brand-text-primary flex items-center gap-3 uppercase tracking-tight">
                            <ShoppingBag className="w-5 h-5" />
                            Recent Orders
                        </h2>
                        <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">Last 5 Transactions</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest border-b border-brand-border">
                                    <th className="pb-5 pl-2">Reference</th>
                                    <th className="pb-5">Customer</th>
                                    <th className="pb-5">Date</th>
                                    <th className="pb-5">Amount</th>
                                    <th className="pb-5 text-right pr-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border/50">
                                {dashboardData.recentOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-brand-surface transition-colors">
                                        <td className="py-6 pl-2">
                                            <div className="flex flex-col">
                                                 <span className="text-brand-text-primary font-bold text-sm tracking-tighter">#{order._id.slice(-6).toUpperCase()}</span>
                                                 <span className="text-brand-text-secondary text-[10px] uppercase font-bold">{order.items?.length || 0} Items</span>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-brand-surface border border-brand-border flex items-center justify-center text-[10px] font-black text-brand-text-primary uppercase">
                                                    {(order.address?.firstName || "C").charAt(0)}
                                                </div>
                                                <span className="text-brand-text-primary font-medium text-sm">{order.address?.firstName || "Customer"}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-brand-text-secondary text-sm font-medium">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-6 font-black text-brand-text-primary">
                                            {formatCurrency(order.amount)}
                                        </td>
                                        <td className="py-6 text-right pr-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-none text-[10px] font-black uppercase tracking-widest border ${
                                                order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                                order.status === 'Cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                                                'bg-brand-surface border-brand-border text-brand-text-secondary'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {dashboardData.recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-brand-text-secondary uppercase tracking-widest text-[10px] font-bold">No orders recorded</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Panel: Top Products & Alerts */}
                <div className="space-y-10">
                    
                    {/* Top Products */}
                    <div className="bg-white border border-brand-border rounded-none p-8">
                        <h2 className="text-xl font-black text-brand-text-primary mb-8 flex items-center gap-3 uppercase tracking-tight">
                            <TrendingUp className="w-5 h-5" />
                            Top Selling
                        </h2>
                        <div className="space-y-6">
                            {dashboardData.topProducts.map((product, i) => (
                                <div key={i} className="flex items-center gap-5 p-4 bg-brand-surface border border-brand-border hover:bg-white transition-all">
                                    <div className="w-14 h-14 bg-white border border-brand-border overflow-hidden flex-shrink-0 p-1">
                                        {product.image ? (
                                             <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-brand-text-secondary">
                                                <Package className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-brand-text-primary font-bold text-sm truncate uppercase tracking-tight">{product.name}</h4>
                                        <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">{product.qty} sold</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-brand-text-primary font-black text-sm">{formatCurrency(product.revenue)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    {dashboardData.lowStockProducts > 0 && (
                        <div className="bg-red-50 border border-red-100 rounded-none p-8">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                                <div>
                                    <h3 className="text-red-700 font-black text-lg mb-2 uppercase tracking-tight">Inventory Alert</h3>
                                    <p className="text-red-600/80 text-xs font-bold uppercase tracking-wide leading-relaxed mb-6">
                                        {dashboardData.lowStockProducts} products require immediate restocking.
                                    </p>
                                    <button className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                                        Review Inventory
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;