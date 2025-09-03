import { useState, useEffect } from 'react';
import { backendUrl } from "../constants";
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Clock,
    TrendingUp,
    TrendingDown,
    Lightbulb,
    Star,
    Heart,
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
    BarChart3,
    Eye,
    DollarSign,
    Package,
    Users,
    ChevronRight,
    Target,
    Briefcase,
    ShoppingCart,
    Calendar,
    Activity,
    Zap
} from 'lucide-react';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [greeting, setGreeting] = useState('');
    const [animatedValues, setAnimatedValues] = useState({
        salesGrowth: 0,
        monthlyTarget: 0,
        satisfaction: 0
    });

    const [dashboardData, setDashboardData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        revenueGrowth: 0,
        orderGrowth: 0,
        customerGrowth: 0,
        viewsToday: 0,
        salesGrowth: 0,
        monthlyTarget: 0,
        customerSatisfaction: 4.8,
        pendingTasks: 0,
        lowStockProducts: 0,
        averageOrderValue: 0,
        topProducts: [],
        recentOrders: []
    });

    const [dataError, setDataError] = useState(null);

    useEffect(() => {
        updateDateTime();
        setGreeting(getGreeting());
        fetchCurrentUser();
        fetchDashboardData();

        const timer = setInterval(() => {
            updateDateTime();
            setGreeting(getGreeting());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) return;
            const res = await axios.get(`${backendUrl}/api/user/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data?.success && res.data?.user?.name) {
                setCurrentUser(res.data.user.name);
            } else {
                setCurrentUser("Admin");
            }
        } catch (_) {
            setCurrentUser("Admin");
        }
    };

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setDataError(null);
            const token = sessionStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication required");
            }
            
            const [ordersResponse, productsResponse, usersResponse] = await Promise.all([
                axios.get(`${backendUrl}/api/order/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(err => ({ data: { success: false, orders: [] } })),
                axios.get(`${backendUrl}/api/product/list`).catch(err => ({ data: { success: false, products: [] } })),
                axios.get(`${backendUrl}/api/user/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(err => ({ data: { success: false, users: [] } }))
            ]);

            const orders = ordersResponse.data.success ? ordersResponse.data.orders : [];
            const products = productsResponse.data.success ? productsResponse.data.products : [];
            const users = usersResponse.data.success ? usersResponse.data.users : [];

            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

            const currentMonthOrders = orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
            });

            const lastMonthOrders = orders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear;
            });

            const today = now.toDateString();
            const todayOrders = orders.filter(order => 
                new Date(order.date).toDateString() === today
            );

            const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
            const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
            const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
            const revenueGrowth = lastMonthRevenue > 0 
                ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
                : currentMonthRevenue > 0 ? 100 : 0;
            const orderGrowth = lastMonthOrders.length > 0 
                ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100)
                : currentMonthOrders.length > 0 ? 100 : 0;

            const uniqueCustomers = new Set(orders.map(order => order.userId?.email || order.userId?._id).filter(Boolean));
            const currentMonthCustomers = new Set(currentMonthOrders.map(order => order.userId?.email || order.userId?._id).filter(Boolean));
            const lastMonthCustomers = new Set(lastMonthOrders.map(order => order.userId?.email || order.userId?._id).filter(Boolean));
            const customerGrowth = lastMonthCustomers.size > 0 
                ? ((currentMonthCustomers.size - lastMonthCustomers.size) / lastMonthCustomers.size * 100)
                : currentMonthCustomers.size > 0 ? 100 : 0;

            const pendingOrders = orders.filter(order => 
                order.status === 'Order Placed' || order.status === 'Packing'
            ).length;

            const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
            const lowStockProducts = products.filter(product => (product.stock || 0) < 10).length;

            // Calculate views based on orders and products
            const viewsToday = Math.floor(todayOrders.length * 8 + products.length * 2 + Math.random() * 50);
            const monthlyTargetRevenue = 100000;
            const monthlyTargetProgress = Math.min(100, (currentMonthRevenue / monthlyTargetRevenue * 100));

            // Get top products by orders
            const productOrderCount = {};
            orders.forEach(order => {
                if (order.products && Array.isArray(order.products)) {
                    order.products.forEach(product => {
                        const productId = product.productId || product._id;
                        if (productId) {
                            productOrderCount[productId] = (productOrderCount[productId] || 0) + 1;
                        }
                    });
                }
            });

            const topProducts = Object.entries(productOrderCount)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([productId, count]) => {
                    const product = products.find(p => p._id === productId);
                    return {
                        name: product?.name || 'Unknown Product',
                        orders: count,
                        revenue: count * (product?.price || 0)
                    };
                });

            // Get recent orders
            const recentOrders = orders
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map(order => ({
                    id: order._id,
                    customer: order.userId?.name || order.userId?.email || 'Unknown',
                    amount: order.amount,
                    status: order.status,
                    date: new Date(order.date).toLocaleDateString()
                }));

            const calculatedData = {
                totalRevenue,
                totalOrders: orders.length,
                totalCustomers: uniqueCustomers.size,
                totalProducts: products.length,
                revenueGrowth: Math.round(revenueGrowth * 10) / 10,
                orderGrowth: Math.round(orderGrowth * 10) / 10,
                customerGrowth: Math.round(customerGrowth * 10) / 10,
                viewsToday,
                salesGrowth: Math.round(revenueGrowth * 10) / 10,
                monthlyTarget: Math.round(monthlyTargetProgress),
                customerSatisfaction: 4.8,
                pendingTasks: pendingOrders,
                lowStockProducts,
                averageOrderValue,
                topProducts,
                recentOrders
            };

            setDashboardData(calculatedData);
            setTimeout(() => {
                animateNumbers(calculatedData.salesGrowth, calculatedData.monthlyTarget, calculatedData.customerSatisfaction);
            }, 300);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setDataError(error.message || "Failed to load dashboard data");
            toast.error("Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    const animateNumbers = (salesTarget, monthlyTarget, satisfaction) => {
        const targets = { 
            salesGrowth: salesTarget, 
            monthlyTarget: monthlyTarget, 
            satisfaction: satisfaction 
        };
        const duration = 1500;
        const steps = 60;
        const stepTime = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setAnimatedValues({
                salesGrowth: Number((targets.salesGrowth * easeOutQuart).toFixed(1)),
                monthlyTarget: Math.round(targets.monthlyTarget * easeOutQuart),
                satisfaction: Number((targets.satisfaction * easeOutQuart).toFixed(1))
            });

            if (step >= steps) {
                clearInterval(timer);
                setAnimatedValues(targets);
            }
        }, stepTime);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 18) return "Good Afternoon";
        if (hour >= 18 && hour < 22) return "Good Evening";
        return "Good Night";
    };

    const updateDateTime = () => {
        const now = new Date();
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        setCurrentDateTime(now.toLocaleDateString(undefined, options));
    };

    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(0)}k`;
        } else {
            return `$${amount.toFixed(0)}`;
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        } else {
            return num.toString();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-400 bg-green-500/20';
            case 'Shipped': return 'text-blue-400 bg-blue-500/20';
            case 'Packing': return 'text-amber-400 bg-amber-500/20';
            case 'Order Placed': return 'text-purple-400 bg-purple-500/20';
            default: return 'text-slate-400 bg-slate-500/20';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="px-3 pt-8 pb-6 sm:px-4 sm:pt-10 lg:px-6 lg:pt-12">
                    <main className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
                        {/* Loading Skeleton */}
                        <div className="animate-pulse">
                            {/* Welcome Section Skeleton */}
                            <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-4 sm:p-6 lg:p-8">
                                <div className="space-y-4">
                                    <div className="h-8 bg-slate-700 rounded-lg w-3/4 mx-auto sm:mx-0"></div>
                                    <div className="h-6 bg-slate-700 rounded-lg w-1/2 mx-auto sm:mx-0"></div>
                                    <div className="h-10 bg-slate-700 rounded-xl w-32 mx-auto sm:mx-0"></div>
                                </div>
                            </section>

                            {/* Stats Grid Skeleton */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-32 bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-700/50 p-4 sm:p-5 lg:p-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
                                                <div className="w-16 h-6 bg-slate-700 rounded-full"></div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-slate-700 rounded w-20"></div>
                                                <div className="h-8 bg-slate-700 rounded w-24"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Metrics Cards Skeleton */}
                            <div className="grid gap-4 sm:gap-6">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-40 bg-slate-800/60 rounded-xl sm:rounded-2xl border border-slate-700/50 p-5 sm:p-6"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (dataError) {
        return (
            <div className="min-h-screen px-3 pt-8 pb-6 sm:pt-10 lg:pt-12">
                <div className="max-w-md mx-auto">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-6 text-center">
                        <div className="space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white">Error Loading Dashboard</h3>
                                <p className="text-sm text-slate-400">{dataError}</p>
                            </div>
                            <button 
                                onClick={fetchDashboardData}
                                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 active:scale-95"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Mobile-first container with proper spacing */}
            <div className="px-3 pt-8 pb-6 sm:px-4 sm:pt-10 lg:px-6 lg:pt-12">
                <main className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
                    {/*  Welcome Section */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 shadow-2xl p-6 sm:p-10 lg:p-14 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-10">
                        {/* Decorative gradients */}
                        <div className="pointer-events-none absolute inset-0 z-0">
                            <div className="absolute -top-1/4 -right-1/4 w-72 h-72 sm:w-[32rem] sm:h-[32rem] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
                            <div className="absolute -bottom-1/4 -left-1/4 w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-2xl animate-pulse delay-1000"></div>
                        </div>
                        {/* Welcome Text */}
                        <div className="relative z-10 flex-1 text-center sm:text-left">
                            <div className="space-y-2 mb-4 sm:mb-6">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-2">
                                    <span className="block text-indigo-400">{greeting},</span>
                                    <span className="capitalize text-slate-100">{(currentUser || 'Admin').split(' ')[0]}</span>
                                    <span className="text-indigo-300">!</span>
                                </h1>
                                <p className="text-base sm:text-lg lg:text-2xl text-slate-300 font-medium">
                                    Welcome to your <span className="text-indigo-400 font-semibold">command center</span>
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 bg-slate-800/70 px-4 py-2 rounded-xl border border-slate-600/40 shadow">
                                <Clock className="h-4 w-4 text-indigo-400" />
                                <span className="font-medium">{currentDateTime}</span>
                            </div>
                        </div>
                    </section>

                    {/* Important Alerts */}
                    {(dashboardData.pendingTasks > 0 || dashboardData.lowStockProducts > 0) && (
                        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-xl border border-amber-500/30 shadow-2xl p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-amber-500/20">
                                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-amber-100">Action Required</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-amber-500/30 text-amber-200 font-medium border border-amber-400/30">
                                    {dashboardData.pendingTasks + dashboardData.lowStockProducts} items
                                </span>
                            </div>
                            
                            <div className="grid gap-3 sm:grid-cols-2">
                                {dashboardData.pendingTasks > 0 && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></div>
                                        <span className="text-sm text-amber-200">
                                            <strong>{dashboardData.pendingTasks}</strong> orders need processing
                                        </span>
                                    </div>
                                )}
                                {dashboardData.lowStockProducts > 0 && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse"></div>
                                        <span className="text-sm text-red-200">
                                            <strong>{dashboardData.lowStockProducts}</strong> products low on stock
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                        {[
                            { 
                                icon: DollarSign, 
                                label: "Total Revenue", 
                                value: formatCurrency(dashboardData.totalRevenue),
                                fullValue: `$${dashboardData.totalRevenue.toLocaleString()}`,
                                color: "emerald", 
                                trend: `${dashboardData.revenueGrowth >= 0 ? '+' : ''}${dashboardData.revenueGrowth}%`,
                                trendIcon: dashboardData.revenueGrowth >= 0 ? TrendingUp : TrendingDown
                            },
                            { 
                                icon: ShoppingCart, 
                                label: "Total Orders", 
                                value: formatNumber(dashboardData.totalOrders),
                                fullValue: dashboardData.totalOrders.toLocaleString(),
                                color: "blue", 
                                trend: `${dashboardData.orderGrowth >= 0 ? '+' : ''}${dashboardData.orderGrowth}%`,
                                trendIcon: dashboardData.orderGrowth >= 0 ? TrendingUp : TrendingDown
                            },
                            { 
                                icon: Users, 
                                label: "Total Customers", 
                                value: formatNumber(dashboardData.totalCustomers),
                                fullValue: dashboardData.totalCustomers.toLocaleString(),
                                color: "purple", 
                                trend: `${dashboardData.customerGrowth >= 0 ? '+' : ''}${dashboardData.customerGrowth}%`,
                                trendIcon: dashboardData.customerGrowth >= 0 ? TrendingUp : TrendingDown
                            },
                            { 
                                icon: Eye, 
                                label: "Today's Views", 
                                value: formatNumber(dashboardData.viewsToday),
                                fullValue: dashboardData.viewsToday.toLocaleString(),
                                color: "orange", 
                                trend: "+23%",
                                trendIcon: TrendingUp
                            }
                        ].map((stat, index) => (
                            <div 
                                key={index} 
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 p-4 sm:p-5 lg:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 active:scale-95 cursor-pointer shadow-lg hover:shadow-xl"
                            >
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className={`p-3 rounded-xl bg-${stat.color}-500/20 group-hover:bg-${stat.color}-500/30 transition-all duration-300 group-hover:scale-110`}>
                                            <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}-400`} />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <stat.trendIcon className={`h-3 w-3 text-${stat.color}-400`} />
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                stat.trend.startsWith('+') 
                                                    ? `bg-${stat.color}-500/20 text-${stat.color}-400` 
                                                    : 'bg-red-500/20 text-red-400'
                                            }`}>
                                                {stat.trend}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">{stat.label}</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-none" title={stat.fullValue}>
                                            {stat.value}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Metrics Cards */}
                    <div className="grid gap-4 sm:gap-6">
                        {/* Performance metrics row */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Sales Growth */}
                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 sm:p-4 rounded-xl bg-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-400" />
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                                        animatedValues.salesGrowth >= 0 
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                        {animatedValues.salesGrowth >= 0 ? '+' : ''}{animatedValues.salesGrowth}%
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Revenue Growth</h3>
                                    <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                        {animatedValues.salesGrowth >= 0 ? '+' : ''}{animatedValues.salesGrowth}%
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">vs last month</p>
                                </div>
                            </div>

                            {/* Monthly Target */}
                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 sm:p-4 rounded-xl bg-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <Target className="h-6 w-6 sm:h-7 sm:w-7 text-blue-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Monthly Target</h3>
                                    <p className="text-3xl sm:text-4xl font-bold text-white mb-3">{animatedValues.monthlyTarget}%</p>
                                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                                        <div 
                                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-1000 ease-out shadow-lg"
                                            style={{ width: `${animatedValues.monthlyTarget}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium mt-2">Target: $100k</p>
                                </div>
                            </div>

                            {/* Customer Satisfaction */}
                            <div className="group sm:col-span-2 lg:col-span-1 relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 sm:p-4 rounded-xl bg-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-pink-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Satisfaction</h3>
                                    <p className="text-3xl sm:text-4xl font-bold text-white mb-3">{animatedValues.satisfaction}/5</p>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star, i) => (
                                            <Star 
                                                key={i} 
                                                className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${
                                                    i < Math.floor(animatedValues.satisfaction) 
                                                        ? "text-pink-400 fill-pink-400" 
                                                        : "text-slate-600"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Customer rating</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Metrics Row */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Average Order Value */}
                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 sm:p-4 rounded-xl bg-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <Activity className="h-6 w-6 sm:h-7 sm:w-7 text-amber-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Avg Order Value</h3>
                                    <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                        {formatCurrency(dashboardData.averageOrderValue)}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">Per transaction</p>
                                </div>
                            </div>

                            {/* Pending Orders */}
                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 sm:p-4 rounded-xl bg-red-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 text-red-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Pending Orders</h3>
                                    <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                        {dashboardData.pendingTasks}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">Need attention</p>
                                </div>
                            </div>

                            {/* Low Stock Products */}
                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 sm:p-4 rounded-xl bg-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <Package className="h-6 w-6 sm:h-7 sm:w-7 text-orange-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Low Stock</h3>
                                    <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                        {dashboardData.lowStockProducts}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">Products</p>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Chart */}
                        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-emerald-500/20">
                                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-white">Revenue Overview</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">This Month</span>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl sm:text-3xl font-bold text-white">{formatCurrency(dashboardData.totalRevenue)}</p>
                                        <p className="text-sm text-slate-400">Total Revenue</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-semibold ${dashboardData.revenueGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {dashboardData.revenueGrowth >= 0 ? '+' : ''}{dashboardData.revenueGrowth}%
                                        </p>
                                        <p className="text-sm text-slate-400">vs last month</p>
                                    </div>
                                </div>
                                
                                {/* Simple Bar Chart */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>Target: $100k</span>
                                        <span>Current: {formatCurrency(dashboardData.totalRevenue)}</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                                        <div 
                                            className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 transition-all duration-1000 ease-out shadow-lg"
                                            style={{ width: `${Math.min(100, (dashboardData.totalRevenue / 100000) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced AI Insights */}
                        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-indigo-500/20">
                                    <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-white">Business Insights</h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 font-medium border border-indigo-500/30">LIVE</span>
                            </div>
                            
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    { 
                                        title: "Pending Orders", 
                                        desc: `${dashboardData.pendingTasks} orders need processing and fulfillment.`, 
                                        color: dashboardData.pendingTasks > 5 ? "red" : "amber",
                                        urgency: dashboardData.pendingTasks > 5 ? "high" : "medium",
                                        icon: AlertCircle
                                    },
                                    { 
                                        title: "Revenue Performance", 
                                        desc: `${dashboardData.revenueGrowth >= 0 ? 'Revenue up' : 'Revenue down'} ${Math.abs(dashboardData.revenueGrowth)}% this month.`, 
                                        color: dashboardData.revenueGrowth >= 0 ? "green" : "red",
                                        urgency: dashboardData.revenueGrowth >= 0 ? "low" : "high",
                                        icon: TrendingUp
                                    },
                                    { 
                                        title: "Customer Growth", 
                                        desc: `${dashboardData.customerGrowth >= 0 ? 'Gained' : 'Lost'} ${Math.abs(dashboardData.customerGrowth)}% customers vs last month.`, 
                                        color: dashboardData.customerGrowth >= 0 ? "green" : "amber",
                                        urgency: "low",
                                        icon: Users
                                    }
                                ].map((insight, index) => (
                                    <div key={index} className="group/item p-4 rounded-xl bg-slate-700/40 hover:bg-slate-600/50 transition-all duration-200 cursor-pointer active:scale-95 border border-slate-600/30">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg bg-${insight.color}-500/20 flex-shrink-0 mt-0.5`}>
                                                <insight.icon className={`h-4 w-4 sm:h-5 sm:w-5 text-${insight.color}-400`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className={`font-semibold text-sm text-${insight.color}-400`}>{insight.title}</h4>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                                        insight.urgency === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                                        insight.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                                        'bg-green-500/20 text-green-400 border-green-500/30'
                                                    }`}>
                                                        {insight.urgency}
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{insight.desc}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-500 group-hover/item:text-slate-300 transition-colors flex-shrink-0 mt-0.5" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Products & Recent Orders */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Top Products */}
                            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 shadow-lg hover:shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-emerald-500/20">
                                        <Star className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white">Top Products</h3>
                                </div>
                                
                                <div className="space-y-3">
                                    {dashboardData.topProducts.map((product, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/40 border border-slate-600/30">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{product.name}</p>
                                                    <p className="text-xs text-slate-400">{product.orders} orders</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-emerald-400">
                                                {formatCurrency(product.revenue)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 shadow-lg hover:shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-blue-500/20">
                                        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white">Recent Orders</h3>
                                </div>
                                
                                <div className="space-y-3">
                                    {dashboardData.recentOrders.map((order, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/40 border border-slate-600/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                                                    #{order.id.slice(-4)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{order.customer}</p>
                                                    <p className="text-xs text-slate-400">{order.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-white">{formatCurrency(order.amount)}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Quick Actions */}
                        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-xl border border-slate-600/50 p-5 sm:p-6 hover:from-slate-700/80 hover:to-slate-600/80 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-emerald-500/20">
                                        <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white">Quick Actions</h3>
                                </div>
                                <span className="text-xs px-3 py-1.5 rounded-full bg-slate-600/50 text-slate-300 font-medium border border-slate-500/30">
                                    {dashboardData.pendingTasks} pending
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {[
                                    { icon: CheckCircle2, text: "Process orders", status: dashboardData.pendingTasks > 0 ? "urgent" : "completed", color: "emerald" },
                                    { icon: BarChart3, text: "Review analytics", status: "pending", color: "blue" },
                                    { icon: Package, text: "Update inventory", status: "pending", color: "amber" },
                                    { icon: Users, text: "Customer support", status: "pending", color: "purple" }
                                ].map((task, index) => (
                                    <div key={index} className="group/task p-4 rounded-xl bg-slate-700/40 hover:bg-slate-600/50 transition-all duration-200 cursor-pointer active:scale-95 border border-slate-600/30">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-${task.color}-500/20 group-hover/task:bg-${task.color}-500/30 transition-colors flex-shrink-0`}>
                                                <task.icon className={`h-4 w-4 sm:h-5 sm:w-5 text-${task.color}-400`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white group-hover/task:text-slate-100 truncate">{task.text}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block border ${
                                                    task.status === 'urgent' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                                                    task.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                    'bg-slate-600/50 text-slate-400 border-slate-500/30'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-500 group-hover/task:text-slate-300 transition-colors flex-shrink-0" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={fetchDashboardData}
                                className="mt-6 w-full py-4 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <Zap className="h-4 w-4" />
                                Refresh Data
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;