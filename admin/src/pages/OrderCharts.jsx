import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { Calendar, TrendingUp, Package, DollarSign, ShoppingBag, Clock, Filter } from 'lucide-react';
import { backendUrl } from "../App";

const OrderDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('week');
    const [stats, setStats] = useState({
        total: 0,
        delivered: 0,
        pending: 0,
        cancelled: 0,
        revenue: 0,
        avgOrderValue: 0,
        growthRate: 0
    });

    // Fetch orders and calculate stats
    const fetchAllOrders = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
            if (response.data.success) {
                const ordersData = response.data.orders;
                setOrders(ordersData);
                calculateStats(ordersData);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (orders) => {
        const totalRevenue = orders.reduce((acc, order) =>
            acc + (order.status !== "Cancelled" ? order.amount : 0), 0);

        const newStats = {
            total: orders.length,
            delivered: orders.filter(order => order.status === "Delivered").length,
            pending: orders.filter(order => !["Delivered", "Cancelled"].includes(order.status)).length,
            cancelled: orders.filter(order => order.status === "Cancelled").length,
            revenue: totalRevenue,
            avgOrderValue: totalRevenue / (orders.length || 1),
            growthRate: calculateGrowthRate(orders)
        };
        setStats(newStats);
    };

    const calculateGrowthRate = (orders) => {
        // Calculate month-over-month growth
        const thisMonth = orders.filter(order =>
            new Date(order.createdAt).getMonth() === new Date().getMonth()
        ).length;
        const lastMonth = orders.filter(order =>
            new Date(order.createdAt).getMonth() === new Date().getMonth() - 1
        ).length;
        return lastMonth ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const processChartData = (orders) => {
        const statusCounts = {
            "Order Placed": 0,
            "Packing": 0,
            "Shipped": 0,
            "Out for Delivery": 0,
            "Delivered": 0,
            "Cancelled": 0,
        };

        orders.forEach((order) => {
            if (statusCounts[order.status] !== undefined) {
                statusCounts[order.status]++;
            }
        });

        return Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count
        }));
    };

    const generateRevenueData = (orders) => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return d.toLocaleString('default', { month: 'short' });
        }).reverse();

        const monthlyRevenue = last6Months.map(month => ({
            month,
            revenue: orders
                .filter(order => {
                    const orderMonth = new Date(order.createdAt)
                        .toLocaleString('default', { month: 'short' });
                    return orderMonth === month && order.status !== 'Cancelled';
                })
                .reduce((acc, order) => acc + order.amount, 0)
        }));

        return monthlyRevenue;
    };

    // Modern color palette
    const COLORS = ['#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316'];
    const CHART_LINE_COLOR = '#0EA5E9';
    const CHART_FILL_COLOR = 'rgba(14, 165, 233, 0.2)';

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const chartData = processChartData(orders);
    const revenueData = generateRevenueData(orders);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Analytics</h1>
                        <p className="text-gray-500">Monitor your business performance and customer orders</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                        <Filter size={16} className="text-gray-500" />
                        <select
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                        >
                            <option value="week">Last 7 days</option>
                            <option value="month">Last 30 days</option>
                            <option value="year">Last 12 months</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <ShoppingBag size={20} className="text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className={`text-xs font-medium ${stats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate.toFixed(1)}%
                            </span>
                            <span className="text-xs text-gray-500 ml-2">vs. last month</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</h3>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <DollarSign size={20} className="text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-xs font-medium text-gray-500">
                                Avg. ₹{stats.avgOrderValue.toFixed(0)} per order
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Delivered</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.delivered}</h3>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Package size={20} className="text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-xs font-medium text-gray-500">
                                {stats.total ? ((stats.delivered / stats.total) * 100).toFixed(0) : 0}% of total orders
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
                                <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
                            </div>
                            <div className="bg-amber-100 p-3 rounded-lg">
                                <Clock size={20} className="text-amber-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <span className="text-xs font-medium text-amber-600">
                                Requires attention
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Trend */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
                                <p className="text-sm text-gray-500">Monthly revenue over time</p>
                            </div>
                            <div className="bg-blue-50 p-2 rounded-md">
                                <TrendingUp size={16} className="text-blue-600" />
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={CHART_LINE_COLOR} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={CHART_LINE_COLOR} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke={CHART_LINE_COLOR}
                                        strokeWidth={2}
                                        fill="url(#colorRevenue)"
                                        activeDot={{ r: 6 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Status Distribution */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Order Status</h2>
                                <p className="text-sm text-gray-500">Distribution by status</p>
                            </div>
                            <div className="bg-purple-50 p-2 rounded-md">
                                <Package size={16} className="text-purple-600" />
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        dataKey="count"
                                        paddingAngle={5}
                                        label={({ status, percent }) =>
                                            `${(percent * 100).toFixed(0)}%`
                                        }
                                        labelLine={false}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name, props) => [value, props.payload.status]}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {chartData.map((status, index) => (
                                <div key={index} className="flex items-center text-xs">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="truncate">{status.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                                <p className="text-sm text-gray-500">
                                    Showing {Math.min(orders.length, 10)} of {orders.length} orders
                                </p>
                            </div>
                            <div className="bg-gray-50 px-3 py-1 rounded-md text-sm text-gray-500 flex items-center">
                                <Calendar size={14} className="mr-1" />
                                Today
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {orders.slice(0, 10).map((order, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.address.firstName} {order.address.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                order.status === 'Delivered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'Cancelled'
                                                        ? 'bg-red-100 text-red-800'
                                                        : order.status === 'Shipped'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : order.status === 'Out for Delivery'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ₹{order.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDashboard;
