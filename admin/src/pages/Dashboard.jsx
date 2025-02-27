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
    Sparkles
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
        // Update time every second
        const timer = setInterval(() => {
            updateDateTime();
            setGreeting(getGreeting());
        }, 1000);
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
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');
        setCurrentDateTime(formattedDate);
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

        return {
            totalRevenue: totalRevenue.toFixed(2),
            totalOrders,
            activeUsers,
            conversionRate,
        };
    };

    const dashboardMetrics = calculateDashboardMetrics();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value={`₹${dashboardMetrics.totalRevenue}`}
                    trend="+12.5%"
                    isPositive={true}
                    icon={<ShoppingCart className="h-6 w-6" />}
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
            </div>

            {/* Welcome Message */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50"></div>
                <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                        <Sparkles className="h-12 w-12 text-blue-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                        {greeting}, {currentUser}!
                    </h1>
                    <div className="space-y-4">
                        <h2 className="text-5xl font-extrabold">
                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                                Welcome to Zero Fashion
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Your premier destination for fashion administration.
                            Manage your inventory, track orders, and grow your business with ease.
                        </p>
                    </div>
                    <div className="mt-8 space-y-2">
                        <p className="text-lg text-gray-600">
                            Start managing your fashion empire right away!
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                            <a href="/add" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                Add New Items
                            </a>
                            <a href="/orders" className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                                View Orders
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-50"></div>
            </div>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ title, value, trend, isPositive, icon, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        red: 'bg-red-50 text-red-600'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    {icon}
                </div>
                <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend}
                    {isPositive ? (
                        <TrendingUp className="h-4 w-4 ml-1" />
                    ) : (
                        <TrendingDown className="h-4 w-4 ml-1" />
                    )}
                </span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
};

export default Dashboard;
