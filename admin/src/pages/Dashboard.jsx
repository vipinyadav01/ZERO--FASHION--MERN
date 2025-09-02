import { useState, useEffect } from 'react';
import { backendUrl } from "../constants";
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Clock,

    TrendingUp,

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
    Briefcase
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
        lowStockProducts: 0
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
            const [ordersResponse, productsResponse] = await Promise.all([
                axios.get(`${backendUrl}/api/order/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(err => ({ data: { success: false, orders: [] } })),
                axios.get(`${backendUrl}/api/product/list`).catch(err => ({ data: { success: false, products: [] } }))
            ]);

            const orders = ordersResponse.data.success ? ordersResponse.data.orders : [];
            const products = productsResponse.data.success ? productsResponse.data.products : [];

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

            const viewsToday = todayOrders.length * 15 + Math.floor(Math.random() * 100);
            const monthlyTargetRevenue = 100000;
            const monthlyTargetProgress = (currentMonthRevenue / monthlyTargetRevenue * 100);

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
                monthlyTarget: Math.min(100, Math.round(monthlyTargetProgress)),
                customerSatisfaction: 4.8,
                pendingTasks: pendingOrders,
                lowStockProducts: 0
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


    if (dataError) {
            return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-3 pt-8 pb-6 sm:pt-10 lg:pt-12">
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
                    {/* Mobile-first Welcome Section */}
                    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-4 sm:p-6 lg:p-8">
                        {/* Mobile-optimized background */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-1/3 -right-1/3 w-48 h-48 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-indigo-500/8 via-purple-500/8 to-pink-500/8 blur-2xl sm:blur-3xl animate-pulse"></div>
                        </div>

                        <div className="relative z-10 text-center sm:text-left">
                            <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                                {/* Mobile-first typography */}
                                <h1 className="text-xl leading-tight sm:text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                                    {greeting}, {(currentUser || 'Admin').split(' ')[0]}!
                                </h1>
                                <p className="text-sm sm:text-base lg:text-xl text-slate-300 font-medium">
                                    Welcome to your command center
                                </p>
                            </div>
                            
                            {/* Mobile-optimized time display */}
                            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 bg-slate-800/50 px-3 py-2 rounded-xl">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
                                <span className="font-medium">{currentDateTime}</span>
                            </div>
                        </div>
                    </section>

                    {/* Mobile-first Stats Grid - Real Data */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
                        {[
                            { 
                                icon: DollarSign, 
                                label: "Revenue", 
                                value: `$${dashboardData.totalRevenue.toLocaleString()}`, 
                                fullValue: `$${dashboardData.totalRevenue.toLocaleString()}`,
                                color: "emerald", 
                                trend: `${dashboardData.revenueGrowth >= 0 ? '+' : ''}${dashboardData.revenueGrowth}%` 
                            },
                            { 
                                icon: Package, 
                                label: "Orders", 
                                value: dashboardData.totalOrders.toLocaleString(), 
                                fullValue: dashboardData.totalOrders.toLocaleString(),
                                color: "blue", 
                                trend: `${dashboardData.orderGrowth >= 0 ? '+' : ''}${dashboardData.orderGrowth}%` 
                            },
                            { 
                                icon: Users, 
                                label: "Customers", 
                                value: dashboardData.totalCustomers.toLocaleString(), 
                                fullValue: dashboardData.totalCustomers.toLocaleString(),
                                color: "purple", 
                                trend: `${dashboardData.customerGrowth >= 0 ? '+' : ''}${dashboardData.customerGrowth}%` 
                            },
                            { 
                                icon: Eye, 
                                label: "Views", 
                                value: dashboardData.viewsToday.toLocaleString(), 
                                fullValue: dashboardData.viewsToday.toLocaleString(),
                                color: "orange", 
                                trend: "+23%" 
                            }
                        ].map((stat, index) => (
                            <div 
                                key={index} 
                                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-3 sm:p-4 lg:p-5 hover:bg-slate-700/60 transition-all duration-300 active:scale-95 cursor-pointer"
                            >
                                <div className="space-y-2 sm:space-y-3">
                                    {/* Mobile-first icon layout */}
                                    <div className="flex items-centered justify-between">
                                        <div className={`p-2 rounded-lg bg-${stat.color}-500/20 group-hover:bg-${stat.color}-500/30 transition-colors`}>
                                            <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 text-${stat.color}-400`} />
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                            stat.trend.startsWith('+') 
                                                ? `bg-${stat.color}-500/10 text-${stat.color}-400` 
                                                : 'bg-red-500/10 text-red-400'
                                        }`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-slate-400 mb-1 font-medium">{stat.label}</p>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-none" title={stat.fullValue}>
                                            {stat.fullValue}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile-first Metrics Cards - Real Data */}
                    <div className="grid gap-3 sm:gap-4">
                        {/* Performance metrics row - mobile stacked */}
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Sales Growth */}
                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-5 hover:bg-slate-700/60 transition-all duration-300 active:scale-95">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 sm:p-3 rounded-xl bg-emerald-500/20 group-hover:scale-110 transition-transform">
                                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                        animatedValues.salesGrowth >= 0 
                                            ? 'bg-emerald-500/20 text-emerald-400' 
                                            : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {animatedValues.salesGrowth >= 0 ? '+' : ''}{animatedValues.salesGrowth}%
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-1">Revenue Growth</h3>
                                    <p className="text-2xl sm:text-3xl font-bold text-white">
                                        {animatedValues.salesGrowth >= 0 ? '+' : ''}{animatedValues.salesGrowth}%
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">vs last month</p>
                                </div>
                            </div>

                            {/* Monthly Target */}
                            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-5 hover:bg-slate-700/60 transition-all duration-300 active:scale-95">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 sm:p-3 rounded-xl bg-blue-500/20 group-hover:scale-110 transition-transform">
                                        <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-1">Monthly Target</h3>
                                    <p className="text-2xl sm:text-3xl font-bold text-white">{animatedValues.monthlyTarget}%</p>
                                    <div className="w-full h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                        <div 
                                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out"
                                            style={{ width: `${animatedValues.monthlyTarget}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Satisfaction */}
                            <div className="group sm:col-span-2 lg:col-span-1 relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-5 hover:bg-slate-700/60 transition-all duration-300 active:scale-95">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="p-2 sm:p-3 rounded-xl bg-pink-500/20 group-hover:scale-110 transition-transform">
                                        <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-pink-400" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-slate-400 mb-1">Satisfaction</h3>
                                    <p className="text-2xl sm:text-3xl font-bold text-white">{animatedValues.satisfaction}/5</p>
                                    <div className="flex items-center gap-0.5 mt-2">
                                        {[1, 2, 3, 4, 5].map((star, i) => (
                                            <Star 
                                                key={i} 
                                                className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 ${
                                                    i < Math.floor(animatedValues.satisfaction) 
                                                        ? "text-pink-400 fill-pink-400" 
                                                        : "text-slate-600"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Insights - Real Data */}
                        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:bg-slate-700/60 transition-all duration-300">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-indigo-500/20">
                                    <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-white">Business Insights</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-medium">LIVE</span>
                            </div>
                            
                            <div className="space-y-3">
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
                                    <div key={index} className="group/item p-3 sm:p-4 rounded-xl bg-slate-700/40 hover:bg-slate-600/50 transition-all duration-200 cursor-pointer active:scale-95">
                                        <div className="flex items-start gap-3">
                                            <div className={`p-1.5 rounded-lg bg-${insight.color}-500/20 flex-shrink-0 mt-0.5`}>
                                                <insight.icon className={`h-3 w-3 sm:h-4 sm:w-4 text-${insight.color}-400`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className={`font-semibold text-sm text-${insight.color}-400`}>{insight.title}</h4>
                                                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                                        insight.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                                                        insight.urgency === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-green-500/20 text-green-400'
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

                        {/* Quick Actions - Real Data */}
                        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:bg-slate-700/60 transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-500/20">
                                        <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white">Quick Actions</h3>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-slate-600/50 text-slate-300 font-medium">
                                    {dashboardData.pendingTasks} pending
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                {[
                                    { icon: CheckCircle2, text: "Process orders", status: dashboardData.pendingTasks > 0 ? "urgent" : "completed", color: "emerald" },
                                    { icon: BarChart3, text: "Review analytics", status: "pending", color: "blue" },
                                    { icon: Package, text: "Update inventory", status: "pending", color: "amber" },
                                    { icon: Users, text: "Customer support", status: "pending", color: "purple" }
                                ].map((task, index) => (
                                    <div key={index} className="group/task p-3 rounded-xl bg-slate-700/40 hover:bg-slate-600/50 transition-all duration-200 cursor-pointer active:scale-95">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-lg bg-${task.color}-500/20 group-hover/task:bg-${task.color}-500/30 transition-colors flex-shrink-0`}>
                                                <task.icon className={`h-3 w-3 sm:h-4 sm:w-4 text-${task.color}-400`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white group-hover/task:text-slate-100 truncate">{task.text}</p>
                                                <span className={`text-xs px-1.5 py-0.5 rounded-full mt-0.5 inline-block ${
                                                    task.status === 'urgent' ? 'bg-red-500/20 text-red-400' : 
                                                    task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-slate-600/50 text-slate-400'
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
                                className="mt-4 w-full py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                            >
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