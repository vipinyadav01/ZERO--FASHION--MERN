import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
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

    const COLORS = ['#1a1a1a', '#4a4a4a', '#6a6a6a', '#8a8a8a', '#aaaaaa', '#cacaca'];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    const chartData = processChartData(orders);
    const revenueData = generateRevenueData(orders);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Order Analytics</h1>
                    <select
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                    >
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="year">Last 12 months</option>
                    </select>
                </div>
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Trend */}
                    <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#000000"
                                        fill="#f0f0f0"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Status Distribution */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        dataKey="count"
                                        label={({ name, percent }) =>
                                            `${name} (${(percent * 100).toFixed(0)}%)`
                                        }
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                            <span className="text-sm text-gray-500">
                                Last {Math.min(orders.length, 10)} of {orders.length} orders
                            </span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
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
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.slice(0, 10).map((order, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.address.firstName} {order.address.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'Delivered'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'Cancelled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{order.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDashboard;
