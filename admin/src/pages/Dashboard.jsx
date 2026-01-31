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
    AlertCircle
} from 'lucide-react';

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
                topProducts
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

    if (isLoading && !dashboardData.totalOrders) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (dataError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4 opacity-50" />
                <h2 className="text-xl font-bold text-white mb-2">Unavailable</h2>
                <p className="text-slate-500 mb-6">{dataError}</p>
                <button onClick={fetchDashboardData} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Retry</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 lg:p-10 space-y-8 font-sans">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                        {greeting}, <span className="text-indigo-400">{currentUser || 'Admin'}</span>
                    </h1>
                    <p className="text-slate-400">Here&apos;s what&apos;s happening with your store today.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Updates</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: formatCurrency(dashboardData.totalRevenue), icon: CreditCard, color: "indigo", trend: dashboardData.revenueGrowth },
                    { label: "Total Orders", value: dashboardData.totalOrders, icon: ShoppingBag, color: "emerald", trend: dashboardData.orderGrowth },
                    { label: "Customers", value: dashboardData.totalCustomers, icon: Users, color: "blue", trend: 0 },
                    { label: "Products", value: dashboardData.totalProducts, icon: Package, color: "amber", trend: 0 }
                ].map((stat, i) => (
                    <div key={i} className="bg-[#0f111a] border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 group-hover:bg-${stat.color}-500/20 transition-colors`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.trend !== 0 && (
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                    {stat.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {Math.abs(stat.trend).toFixed(1)}%
                                </div>
                            )}
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-[#0f111a] border border-slate-800 rounded-3xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-indigo-400" />
                            Recent Orders
                        </h2>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last 5 Transactions</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                                    <th className="pb-4 pl-2">Details</th>
                                    <th className="pb-4">Customer</th>
                                    <th className="pb-4">Date</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4 text-right pr-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {dashboardData.recentOrders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-slate-900/50 transition-colors">
                                        <td className="py-4 pl-2">
                                            <div className="flex flex-col">
                                                 <span className="text-white font-medium text-sm">#{order._id.slice(-6).toUpperCase()}</span>
                                                 <span className="text-slate-500 text-xs">{order.items?.length || 0} Items</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                                                    {(order.address?.firstName || "C").charAt(0)}
                                                </div>
                                                <span className="text-slate-300 text-sm">{order.address?.firstName || "Customer"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-400 text-sm">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 font-medium text-white">
                                            {formatCurrency(order.amount)}
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                                                order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400' :
                                                'bg-amber-500/10 text-amber-400'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {dashboardData.recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-slate-500">No orders found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Panel: Top Products & Alerts */}
                <div className="space-y-6">
                    
                    {/* Top Products */}
                    <div className="bg-[#0f111a] border border-slate-800 rounded-3xl p-6 md:p-8">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            Top Selling
                        </h2>
                        <div className="space-y-4">
                            {dashboardData.topProducts.map((product, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800">
                                    <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                                        {product.image ? (
                                             <img src={Array.isArray(product.image) ? product.image[0] : product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                <Package className="w-6 h-6" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-medium text-sm truncate">{product.name}</h4>
                                        <p className="text-slate-500 text-xs">{product.qty} sold</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-emerald-400 font-bold text-sm">{formatCurrency(product.revenue)}</p>
                                    </div>
                                </div>
                            ))}
                            {dashboardData.topProducts.length === 0 && (
                                <p className="text-center text-slate-500 py-4">No sales data yet</p>
                            )}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    {dashboardData.lowStockProducts > 0 && (
                        <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-6 md:p-8">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-8 h-8 text-rose-500 flex-shrink-0" />
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">Low Stock Alert</h3>
                                    <p className="text-rose-200/70 text-sm mb-4">
                                        {dashboardData.lowStockProducts} products are running low on inventory.
                                    </p>
                                    <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors">
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