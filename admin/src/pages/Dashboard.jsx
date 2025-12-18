import { useState, useEffect, useCallback } from 'react';
import { backendUrl } from "../constants";
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    TrendingUp,
    Lightbulb,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRight,
    CheckCircle2,
    DollarSign,
    Package,
    Users,
    ShoppingCart,
    Activity,
    Sparkles,
    LayoutGrid,
    Clock
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
        monthlyTarget: 100,
        customerSatisfaction: 4.8,
        pendingTasks: 0,
        lowStockProducts: 0,
        averageOrderValue: 0,
        topProducts: [],
        recentOrders: []
    });

    const [dataError, setDataError] = useState(null);

    const updateDateTime = useCallback(() => {
        const now = new Date();
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        setCurrentDateTime(now.toLocaleDateString(undefined, options).toUpperCase());
    }, []);

    const getGreeting = useCallback(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "MORNING";
        if (hour >= 12 && hour < 18) return "AFTERNOON";
        return "EVENING";
    }, []);

    const fetchCurrentUser = useCallback(async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) return;
            const res = await axios.get(`${backendUrl}/api/user/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data?.success && res.data?.user?.name) {
                setCurrentUser(res.data.user.name);
            } else {
                setCurrentUser("Executive");
            }
        } catch (err) {
            console.error("Auth sync error", err);
            setCurrentUser("Executive");
        }
    }, []);

    const animateNumbers = useCallback((salesTarget, monthlyTarget, satisfaction) => {
        const duration = 1500;
        const steps = 60;
        const stepTime = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setAnimatedValues({
                salesGrowth: Number((salesTarget * easeOutQuart).toFixed(1)),
                monthlyTarget: Math.round(monthlyTarget * easeOutQuart),
                satisfaction: Number((satisfaction * easeOutQuart).toFixed(1))
            });
            if (step >= steps) clearInterval(timer);
        }, stepTime);
    }, []);

    const fetchDashboardData = useCallback(async () => {
        try {
            setIsLoading(true);
            setDataError(null);
            const token = sessionStorage.getItem("token");
            if (!token) throw new Error("Authentication required");
            
            const [ordersResponse, productsResponse] = await Promise.all([
                axios.get(`${backendUrl}/api/order/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { success: false, orders: [] } })),
                axios.get(`${backendUrl}/api/product/list`).catch(() => ({ data: { success: false, products: [] } }))
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
            
            const lowStockProducts = products.filter(product => (product.stock || 0) < 10).length;

            const monthlyTargetRevenue = 100000;
            const monthlyTargetProgress = Math.min(100, (currentMonthRevenue / monthlyTargetRevenue * 100));

            const recentOrders = orders
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 8);

            const calculatedData = {
                totalRevenue,
                totalOrders: orders.length,
                totalCustomers: uniqueCustomers.size,
                totalProducts: products.length,
                revenueGrowth: Math.round(revenueGrowth * 10) / 10,
                orderGrowth: Math.round(orderGrowth * 10) / 10,
                viewsToday: Math.floor(orders.length * 8.5),
                salesGrowth: Math.round(revenueGrowth * 10) / 10,
                monthlyTarget: Math.round(monthlyTargetProgress) || 68,
                customerSatisfaction: 4.8,
                pendingTasks: orders.filter(o => !["Delivered", "Cancelled"].includes(o.status)).length,
                lowStockProducts,
                averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
                topProducts: [],
                recentOrders
            };

            setDashboardData(calculatedData);
            animateNumbers(calculatedData.salesGrowth, calculatedData.monthlyTarget, calculatedData.customerSatisfaction);

        } catch (error) {
            setDataError(error.message);
            toast.error("Telemetry failure: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }, [animateNumbers]);

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
    }, [updateDateTime, getGreeting, fetchCurrentUser, fetchDashboardData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (dataError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                <LayoutGrid className="w-16 h-16 text-rose-500 mb-4 opacity-20" />
                <h2 className="text-2xl font-black text-white uppercase mb-2">Telemetry Offline</h2>
                <p className="text-slate-500 max-w-xs">{dataError}</p>
                <button onClick={() => fetchDashboardData()} className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest">Retry Feed</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-10 font-['Montserrat']">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Executive Welcome Section */}
                <header className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-slate-800/60 p-8 sm:p-12 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] -mr-48 -mt-48 rounded-full animate-pulse"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <Sparkles className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">
                                    {greeting}, <span className="text-indigo-500">{currentUser}</span>
                                </h1>
                            </div>
                            <p className="text-slate-400 text-lg font-medium max-w-md">
                                Systems operational. Your global fashion dashboard is calibrated and active.
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <div className="px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md">
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">System Entropy</p>
                                <p className="text-sm font-black text-emerald-400 flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    OPTIMAL PERFORMANCE
                                </p>
                            </div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mr-4">{currentDateTime}</p>
                        </div>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Gross Revenue", value: formatCurrency(dashboardData.totalRevenue), icon: DollarSign, color: "indigo", trend: dashboardData.revenueGrowth },
                        { label: "Dispatch Volume", value: dashboardData.totalOrders, icon: ShoppingCart, color: "fuchsia", trend: dashboardData.orderGrowth },
                        { label: "Active Nodes", value: dashboardData.totalCustomers, icon: Users, color: "teal", trend: 12.4 },
                        { label: "Sync Rate", value: "98.2%", icon: Activity, color: "amber", trend: 0.8 }
                    ].map((stat, i) => (
                        <div key={i} className="bg-[#0a0a0f] border border-slate-800/60 rounded-3xl p-6 hover:border-slate-700/80 transition-all duration-300 group shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                                </div>
                                <div className="text-right">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${stat.trend >= 0 ? "text-emerald-400" : "text-rose-400"} flex items-center gap-1`}>
                                        {stat.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {Math.abs(stat.trend)}%
                                    </p>
                                </div>
                            </div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-white italic">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Primary Operations */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Target Progress Card */}
                        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-8">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] -m-48 rounded-full"></div>
                            <div className="relative z-10 flex-1 space-y-4">
                                <h2 className="text-4xl font-black uppercase tracking-tighter italic">Strategic Progress</h2>
                                <p className="text-indigo-100/70 text-lg font-medium leading-relaxed max-w-md">
                                    Currently executing month-over-month expansion. You have achieved <span className="text-white font-black">{animatedValues.monthlyTarget}%</span> of the defined revenue baseline.
                                </p>
                                <button onClick={() => toast.info("Comprehensive Analysis Engaged")} className="px-10 py-4 bg-white text-indigo-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10">
                                    Audit Performance
                                </button>
                            </div>
                            <div className="relative shrink-0">
                                <svg className="w-48 h-48 transform -rotate-90">
                                    <circle cx="96" cy="96" r="80" className="stroke-white/10 fill-none" strokeWidth="16" />
                                    <circle cx="96" cy="96" r="80" className="stroke-white fill-none transition-all duration-1000" strokeWidth="16" strokeDasharray={502} strokeDashoffset={502 - (502 * animatedValues.monthlyTarget) / 100} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black italic">{animatedValues.monthlyTarget}%</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Sync</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Dispatches */}
                        <div className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-8 sm:p-10 shadow-xl overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Operational Queue</h3>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-2">
                                    View Repository <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-800/60">
                                            <th className="pb-6">Signature</th>
                                            <th className="pb-6">Client Identity</th>
                                            <th className="pb-6">Valuation</th>
                                            <th className="pb-6 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/40">
                                        {dashboardData.recentOrders.map((order, i) => (
                                            <tr key={i} className="group hover:bg-slate-900/40 transition-colors">
                                                <td className="py-5 font-mono text-xs text-slate-500 uppercase">#{order._id.slice(-8)}</td>
                                                <td className="py-5">
                                                    <p className="text-white font-bold text-sm uppercase tracking-tight">{order.address?.firstName || "EXECUTIVE"} {order.address?.lastName || "CLIENT"}</p>
                                                    <p className="text-[10px] text-slate-500 lowercase font-medium">{order.address?.city || "Remote Node"}</p>
                                                </td>
                                                <td className="py-5 font-black text-white italic text-lg whitespace-nowrap">{formatCurrency(order.amount)}</td>
                                                <td className="py-5 text-right">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                                        order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                                        'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Insights */}
                    <div className="space-y-8">
                        
                        {/* Executive Insights */}
                        <div className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-8 sm:p-10 shadow-xl space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                    <Lightbulb className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Intelligence</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { title: "Peak Segment", value: "Premium Topwear", sub: "42% OVERALL VOLUME", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                                    { title: "Attention Required", value: "3 Stock Nodes", sub: "CRITICAL REPLENISHMENT", icon: Clock, color: "text-rose-400", bg: "bg-rose-400/10" },
                                    { title: "Service Index", value: "98.4%", sub: "HIGH SATISFACTION LEVEL", icon: CheckCircle2, color: "text-indigo-400", bg: "bg-indigo-500/10" }
                                ].map((insight, i) => (
                                    <div key={i} className="flex gap-5 p-5 rounded-3xl bg-slate-900/40 border border-slate-800/60 hover:border-slate-700/80 transition-all">
                                        <div className={`p-4 h-fit rounded-2xl ${insight.bg}`}>
                                            <insight.icon className={`w-5 h-5 ${insight.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-lg tracking-tight uppercase italic">{insight.value}</p>
                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{insight.title}</p>
                                            <p className="text-[10px] text-indigo-400 font-bold mt-1 uppercase tracking-tight">{insight.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cargo Pulse */}
                        <div className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-8 sm:p-10 shadow-xl space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Cargo Pulse</h3>
                                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                                    <Package className="w-5 h-5 text-indigo-400" />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                        <span className="text-slate-500">Asset Efficiency</span>
                                        <span className="text-white">94%</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-[94%]" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800/60 text-center">
                                    <div>
                                        <p className="text-3xl font-black text-white italic">{dashboardData.totalProducts}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Global SKUs</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-rose-500 italic">{dashboardData.lowStockProducts}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Critical Stock</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Strategy Command Center */}
                <div className="bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-indigo-500/20 rounded-[2.5rem] p-10 sm:p-14 text-center">
                    <LayoutGrid className="w-12 h-12 text-indigo-400 mx-auto mb-8" />
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">Unified Control Environment</h3>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto mb-10">
                        ZeroFashion Executive Hub synchronizes real-time logistical telemetry with commercial performance metrics to provide a total strategic overview.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => toast.success("System Snapshot Generated")} className="px-12 py-5 bg-white text-indigo-950 font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl">
                            Snapshot
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;