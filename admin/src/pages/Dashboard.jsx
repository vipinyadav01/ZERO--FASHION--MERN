import React, { useState, useEffect } from 'react';
import { backendUrl } from "../App";
import { toast } from 'react-toastify';
import {
    BarChart3,
    Users,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    Clock,
    Sparkles,
    Package,
    DollarSign,
    ArrowRight
} from 'lucide-react';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        fetchAllOrders();
        updateDateTime();
        setCurrentUser(sessionStorage.getItem("user") || "Guest");
        setGreeting(getGreeting());

        const timer = setInterval(() => {
            updateDateTime();
            setGreeting(getGreeting());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

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
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        setCurrentDateTime(now.toLocaleDateString(undefined, options));
    };

    const fetchAllOrders = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setIsLoading(false);
            return null;
        }

        try {
            setIsLoading(true);
            const response = await fetch(backendUrl + "/api/order/list", {
                method: "POST",
                headers: { token },
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders");
        } finally {
            setIsLoading(false);
        }
    };

    const calculateDashboardMetrics = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const totalOrders = orders.length;
        const activeUsers = Math.floor(orders.length * 1.5);
        const conversionRate = ((orders.length / (orders.length * 2)) * 100).toFixed(1);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentOrders = orders.filter(order => new Date(order.orderDate) >= oneWeekAgo).length;

        return { totalRevenue: totalRevenue.toFixed(2), totalOrders, activeUsers, conversionRate, recentOrders };
    };

    const dashboardMetrics = calculateDashboardMetrics();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mx-auto"></div>
                    <p className="text-gray-600 font-medium text-lg">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 antialiased">
            {/* Header */}
            <header className="bg-white shadow-sm px-4 py-4 sticky top-0 top z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Zero Fashion</h1>
                    <div className="flex items-center gap-3 text-gray-600">
                        <Clock className="h-5 w-5 hidden sm:block" />
                        <span className="text-sm sm:text-base">{currentDateTime}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Welcome Section */}
                <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 sm:p-8 mb-8 transform hover:scale-[1.01] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 animate-fade-in">
                                {greeting}, {currentUser}!
                            </h2>
                            <p className="text-indigo-100 text-base sm:text-lg mb-6">
                                Your fashion management dashboard
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                                <a href="/add" className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md">
                                    Add New Items
                                    <Package className="ml-2 h-5 w-5" />
                                </a>
                                <a href="/orders" className="inline-flex items-center px-4 py-2 bg-indigo-700 text-white font-medium rounded-lg hover:bg-indigo-800 transition-all duration-200 shadow-md">
                                    View Orders
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </div>
                        </div>
                        <Sparkles className="h-16 w-16 text-white opacity-80 animate-pulse" />
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                    <StatsCard title="Total Revenue" value={`₹${dashboardMetrics.totalRevenue}`} trend="+12.5%" isPositive={true} icon={<DollarSign />} color="indigo" />
                    <StatsCard title="Total Orders" value={dashboardMetrics.totalOrders} trend="+8.2%" isPositive={true} icon={<ShoppingCart />} color="emerald" />
                    <StatsCard title="Active Users" value={dashboardMetrics.activeUsers} trend="+5.1%" isPositive={true} icon={<Users />} color="purple" />
                    <StatsCard title="Conversion Rate" value={`${dashboardMetrics.conversionRate}%`} trend="-1.5%" isPositive={false} icon={<BarChart3 />} color="rose" />
                    <StatsCard title="Recent Orders" value={dashboardMetrics.recentOrders} trend="+3.8%" isPositive={true} icon={<Package />} color="amber" />
                </section>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Recent Orders */}
                    <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Orders</h3>
                            <a href="/orders" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                                View all <ArrowRight className="ml-1 h-4 w-4" />
                            </a>
                        </div>
                        <div className="space-y-4">
                            {orders.slice(0, 5).map((order, index) => (
                                <div key={order.id || index} className="flex items-center py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-150">
                                    <ShoppingCart className="h-5 w-5 text-indigo-600 mr-3 sm:mr-4 flex-shrink-0" />
                                    <div className="flex-grow min-w-0">
                                        <p className="text-gray-900 font-medium truncate">Order #{order.id || `${index + 1000}`}</p>
                                        <p className="text-gray-500 text-xs sm:text-sm truncate">
                                            {new Date(order.orderDate || new Date()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-gray-900 font-semibold text-sm sm:text-base">₹{Number(order.totalAmount).toFixed(2)}</p>
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                            {order.status || 'Completed'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <div className="text-center py-8">
                                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500">No orders found</p>
                                    <a href="/add" className="text-indigo-600 font-medium text-sm mt-2 inline-block hover:underline">
                                        Add items to get started
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Tips Section */}
                    <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Tips & Quick Actions</h3>
                        <div className="space-y-4">
                            {[
                                { title: "Optimize Inventory", text: "Check stock levels regularly.", color: "indigo" },
                                { title: "Enhance Images", text: "Quality images boost conversions.", color: "purple" },
                                { title: "Run Flash Sale", text: "Create urgency to boost sales.", color: "emerald" }
                            ].map((tip, index) => (
                                <div key={index} className={`p-3 rounded-lg bg-${tip.color}-50 border border-${tip.color}-100 transform hover:scale-105 transition-all duration-200`}>
                                    <h4 className={`font-medium text-${tip.color}-800`}>{tip.title}</h4>
                                    <p className={`text-${tip.color}-700 text-sm`}>{tip.text}</p>
                                </div>
                            ))}
                        </div>
                        <a href="/analytics" className="block mt-6 w-full text-center py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200">
                            View Analytics
                        </a>
                    </section>
                </div>
            </main>
        </div>
    );
};

const StatsCard = ({ title, value, trend, isPositive, icon, color }) => {
    const colors = {
        indigo: 'bg-indigo-500/10 text-indigo-600',
        emerald: 'bg-emerald-500/10 text-emerald-600',
        purple: 'bg-purple-500/10 text-purple-600',
        rose: 'bg-rose-500/10 text-rose-600',
        amber: 'bg-amber-500/10 text-amber-600'
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className={`p-2.5 rounded-lg ${colors[color]} transform hover:rotate-6 transition-transform duration-200`}>
                    {React.cloneElement(icon, { className: "h-5 w-5 sm:h-6 sm:w-6" })}
                </div>
                <span className={`flex items-center text-xs sm:text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend}
                    {isPositive ? <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 ml-1" /> : <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />}
                </span>
            </div>
            <h3 className="text-gray-500 text-xs sm:text-sm font-medium mb-1">{title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{value}</p>
        </div>
    );
};

export default Dashboard;
