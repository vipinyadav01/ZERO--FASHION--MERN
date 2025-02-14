import React, { useState } from 'react';
import {
    BarChart3,
    Users,
    DollarSign,
    ShoppingCart,
    TrendingUp,
    TrendingDown,
    Bell,
    Search,
    Calendar,
    Package
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const salesData = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 5000 },
        { name: 'Apr', value: 4500 },
        { name: 'May', value: 6000 },
        { name: 'Jun', value: 5500 },
    ];

    const recentOrders = [
        { id: '#12345', customer: 'John Doe', status: 'Delivered', amount: '$299.99', date: '2024-02-14' },
        { id: '#12346', customer: 'Jane Smith', status: 'Processing', amount: '$199.50', date: '2024-02-14' },
        { id: '#12347', customer: 'Mike Johnson', status: 'Pending', amount: '$599.99', date: '2024-02-13' },
        { id: '#12348', customer: 'Sarah Wilson', status: 'Delivered', amount: '$149.99', date: '2024-02-13' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600">Welcome back, Admin</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <button className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50">
                        <Bell className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value="$54,239"
                    trend="+12.5%"
                    isPositive={true}
                    icon={<DollarSign className="h-6 w-6" />}
                />
                <StatsCard
                    title="Total Orders"
                    value="1,429"
                    trend="+8.2%"
                    isPositive={true}
                    icon={<ShoppingCart className="h-6 w-6" />}
                />
                <StatsCard
                    title="Active Users"
                    value="3,842"
                    trend="+5.1%"
                    isPositive={true}
                    icon={<Users className="h-6 w-6" />}
                />
                <StatsCard
                    title="Conversion Rate"
                    value="2.4%"
                    trend="-1.5%"
                    isPositive={false}
                    icon={<BarChart3 className="h-6 w-6" />}
                />
            </div>

            {/* Charts and Recent Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
                            <p className="text-sm text-gray-600">Monthly revenue statistics</p>
                        </div>
                        <select className="p-2 border border-gray-300 rounded-lg text-sm">
                            <option>Last 6 months</option>
                            <option>Last year</option>
                            <option>All time</option>
                        </select>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#000000"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                        <button className="text-sm text-gray-600 hover:text-gray-900">View all</button>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <Package className="h-8 w-8 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">{order.id}</p>
                                        <p className="text-sm text-gray-600">{order.customer}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{order.amount}</p>
                                    <p className="text-sm text-gray-600">{order.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stats Card Component
const StatsCard = ({ title, value, trend, isPositive, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
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

export default Dashboard;
