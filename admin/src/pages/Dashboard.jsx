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

        // Update time every minute instead of every second for better performance
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

    // Calculate dashboard metrics
    const calculateDashboardMetrics = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        const totalOrders = orders.length;
        const activeUsers = Math.floor(orders.length * 1.5);
        const conversionRate = ((orders.length / (orders.length * 2)) * 100).toFixed(1);

        // Calculate recent orders (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentOrders = orders.filter(order => new Date(order.orderDate) >= oneWeekAgo).length;

        return {
            totalRevenue: totalRevenue.toFixed(2),
            totalOrders,
            activeUsers,
            conversionRate,
            recentOrders
        };
    };

    const dashboardMetrics = calculateDashboardMetrics();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-6 text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top navigation bar with date/time */}
            <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Zero Fashion</h1>
                <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">{currentDateTime}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-6 md:mb-0">
                            <h2 className="text-white text-3xl font-bold mb-2">
                                {greeting}, {currentUser}!
                            </h2>
                            <p className="text-indigo-100 text-lg">
                                Welcome to your fashion management dashboard
                            </p>
                            <div className="mt-6 flex gap-4">
                                <a href="/add" className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md flex items-center">
                                    Add New Items
                                    <Package className="ml-2 h-5 w-5" />
                                </a>
                                <a href="/orders" className="px-6 py-3 bg-indigo-800 text-white font-medium rounded-lg hover:bg-indigo-900 transition-colors shadow-md flex items-center">
                                    View Orders
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="p-4 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl">
                                <Sparkles className="h-16 w-16 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                    <StatsCard
                        title="Total Revenue"
                        value={`₹${dashboardMetrics.totalRevenue}`}
                        trend="+12.5%"
                        isPositive={true}
                        icon={<DollarSign className="h-6 w-6" />}
                        color="blue"
                    />
                    <StatsCard
                        title="Total Orders"
                        value={dashboardMetrics.totalOrders}
                        trend="+8.2%"
                        isPositive={true}
                        icon={<ShoppingCart className="h-6 w-6" />}
                        color="green"
                    />
                    <StatsCard
                        title="Active Users"
                        value={dashboardMetrics.activeUsers}
                        trend="+5.1%"
                        isPositive={true}
                        icon={<Users className="h-6 w-6" />}
                        color="purple"
                    />
                    <StatsCard
                        title="Conversion Rate"
                        value={`${dashboardMetrics.conversionRate}%`}
                        trend="-1.5%"
                        isPositive={false}
                        icon={<BarChart3 className="h-6 w-6" />}
                        color="red"
                    />
                    <StatsCard
                        title="Recent Orders"
                        value={dashboardMetrics.recentOrders}
                        trend="+3.8%"
                        isPositive={true}
                        icon={<Package className="h-6 w-6" />}
                        color="orange"
                    />
                </div>

                {/* Recent Activity & Tips Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders Preview */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                            <a href="/orders" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                                View all <ArrowRight className="ml-1 h-4 w-4" />
                            </a>
                        </div>

                        <div className="overflow-hidden">
                            {orders.slice(0, 5).map((order, index) => (
                                <div key={order.id || index} className="flex items-center py-4 border-b border-gray-100 last:border-b-0">
                                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                                        <ShoppingCart className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-gray-800 font-medium">Order #{order.id || `${index + 1000}`}</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(order.orderDate || new Date()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-900 font-bold">₹{Number(order.totalAmount).toFixed(2)}</p>
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                            {order.status || 'Completed'}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {orders.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                    <p>No orders found</p>
                                    <a href="/add" className="text-indigo-600 font-medium mt-2 inline-block">
                                        Add items to get started
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tips & Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Tips & Quick Actions</h3>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-800 mb-2">Optimize Your Inventory</h4>
                                <p className="text-blue-700 text-sm">Check your stock levels regularly to ensure popular items remain available.</p>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <h4 className="font-medium text-purple-800 mb-2">Enhance Product Images</h4>
                                <p className="text-purple-700 text-sm">High-quality images can increase conversion rates by up to 30%.</p>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-800 mb-2">Run a Flash Sale</h4>
                                <p className="text-green-700 text-sm">Limited-time offers create urgency and can boost sales.</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a href="/analytics" className="block w-full text-center py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                                View Full Analytics
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Stats Card Component
const StatsCard = ({ title, value, trend, isPositive, icon, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 ring-blue-500/30',
        green: 'bg-green-50 text-green-600 ring-green-500/30',
        purple: 'bg-purple-50 text-purple-600 ring-purple-500/30',
        red: 'bg-red-50 text-red-600 ring-red-500/30',
        orange: 'bg-orange-50 text-orange-600 ring-orange-500/30'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colors[color]} ring-1 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend}
                    {isPositive ? (
                        <TrendingUp className="h-4 w-4 ml-1" />
                    ) : (
                        <TrendingDown className="h-4 w-4 ml-1" />
                    )}
                </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

export default Dashboard;
