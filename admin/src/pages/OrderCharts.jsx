import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Calendar, TrendingUp, Package, DollarSign, ShoppingBag, Clock, Filter } from 'lucide-react';
import { backendUrl } from "../App";

const OrderDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const fetchAllOrders = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setError("Please log in to view dashboard.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axios.post(
                `${backendUrl}/api/order/list`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                const ordersData = response.data.orders;
                setOrders(ordersData);
                calculateStats(ordersData);
            } else {
                setError(response.data.message);
                toast.error(response.data.message);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to fetch orders";
            setError(message);
            toast.error(message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrdersByTimeframe = (orders) => {
        const now = new Date();
        const timeframeMap = {
            week: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
            month: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
            year: 365 * 24 * 60 * 60 * 1000 // 365 days in ms
        };
        const cutoff = now - timeframeMap[timeframe];
        return orders.filter(order => new Date(order.date || order.createdAt) >= cutoff);
    };

    const calculateStats = (orders) => {
        const filteredOrders = filterOrdersByTimeframe(orders);
        const totalRevenue = filteredOrders.reduce((acc, order) =>
            acc + (order.status !== "Cancelled" ? order.amount : 0), 0);

        const newStats = {
            total: filteredOrders.length,
            delivered: filteredOrders.filter(order => order.status === "Delivered").length,
            pending: filteredOrders.filter(order => !["Delivered", "Cancelled"].includes(order.status)).length,
            cancelled: filteredOrders.filter(order => order.status === "Cancelled").length,
            revenue: totalRevenue,
            avgOrderValue: totalRevenue / (filteredOrders.length || 1),
            growthRate: calculateGrowthRate(filteredOrders)
        };
        setStats(newStats);
    };

    const calculateGrowthRate = (orders) => {
        const now = new Date();
        const prevPeriod = new Date(now - (timeframe === 'week' ? 14 : timeframe === 'month' ? 60 : 730) * 24 * 60 * 60 * 1000);
        const currentOrders = orders.filter(order => new Date(order.date || order.createdAt) >= prevPeriod);
        const prevOrders = orders.filter(order => new Date(order.date || order.createdAt) < prevPeriod);

        const currentCount = currentOrders.length;
        const prevCount = prevOrders.length;
        return prevCount ? ((currentCount - prevCount) / prevCount) * 100 : 0;
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    useEffect(() => {
        if (orders.length) calculateStats(orders);
    }, [timeframe]);

    const processChartData = (orders) => {
        const filteredOrders = filterOrdersByTimeframe(orders);
        const statusCounts = {
            "Order Placed": 0, "Packing": 0, "Shipped": 0,
            "Out for Delivery": 0, "Delivered": 0, "Cancelled": 0,
        };
        filteredOrders.forEach(order => statusCounts[order.status]++);
        return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
    };

    const generateRevenueData = (orders) => {
        const periods = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 12;
        const interval = timeframe === 'year' ? 'month' : 'day';
        const data = Array.from({ length: periods }, (_, i) => {
            const d = new Date();
            if (interval === 'day') d.setDate(d.getDate() - i);
            else d.setMonth(d.getMonth() - i);
            const label = interval === 'day' ? d.getDate() : d.toLocaleString('default', { month: 'short' });
            return {
                period: label,
                revenue: orders
                    .filter(order => {
                        const orderDate = new Date(order.date || order.createdAt);
                        return (interval === 'day' ? orderDate.getDate() : orderDate.getMonth()) === (interval === 'day' ? d.getDate() : d.getMonth()) &&
                            order.status !== 'Cancelled';
                    })
                    .reduce((acc, order) => acc + order.amount, 0)
            };
        }).reverse();
        return data;
    };

    const COLORS = ['#ff6200', '#ff8c00', '#ffa500', '#ff4500', '#ff6f00', '#ff7f50'];
    const CHART_LINE_COLOR = '#ff6200';
    const CHART_FILL_COLOR = 'rgba(255, 98, 0, 0.3)';

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#131313]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6200]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#131313] text-[#939393]">
                <div className="text-center p-6 bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl border border-[#939393]/20">
                    <p className="text-lg mb-4">{error}</p>
                    <button
                        onClick={fetchAllOrders}
                        className="px-4 py-2 bg-[#ff6200] text-white rounded-xl hover:bg-[#ff4500] transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const chartData = processChartData(orders);
    const revenueData = generateRevenueData(orders);

    return (
        <div className="min-h-screen bg-[#131313] p-6 text-[#939393]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Order Analytics</h1>
                        <p className="text-[#939393] mt-1">Monitor your business performance</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-2">
                        <Filter size={16} className="text-[#ff6200]" />
                        <select
                            className="px-4 py-2 bg-[#1a1a1a] text-[#939393] border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all"
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                        >
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="year">Last 12 Months</option>
                        </select>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { title: "Total Orders", value: stats.total, icon: ShoppingBag, extra: `${stats.growthRate.toFixed(1)}% vs last period` },
                        { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, extra: `Avg ₹${stats.avgOrderValue.toFixed(0)}` },
                        { title: "Delivered", value: stats.delivered, icon: Package, extra: `${stats.total ? ((stats.delivered / stats.total) * 100).toFixed(0) : 0}%` },
                        { title: "Pending", value: stats.pending, icon: Clock, extra: "Requires attention" }
                    ].map((card, idx) => (
                        <div
                            key={idx}
                            className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl p-6 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/20 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#939393] mb-1">{card.title}</p>
                                    <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                                </div>
                                <div className="bg-[#ff6200]/10 p-3 rounded-xl">
                                    <card.icon size={20} className="text-[#ff6200]" />
                                </div>
                            </div>
                            <p className={`mt-4 text-xs ${card.title === "Pending" ? "text-[#ff6200]" : "text-[#939393]"}`}>{card.extra}</p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl p-6 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/20 transition-all duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Revenue Trend</h2>
                                <p className="text-sm text-[#939393]">Revenue over time</p>
                            </div>
                            <TrendingUp size={20} className="text-[#ff6200]" />
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer>
                                <AreaChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#939393" opacity={0.2} />
                                    <XAxis dataKey="period" stroke="#939393" />
                                    <YAxis stroke="#939393" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #939393',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke={CHART_LINE_COLOR}
                                        fill={CHART_FILL_COLOR}
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl p-6 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/20 transition-all duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Order Status</h2>
                                <p className="text-sm text-[#939393]">Distribution</p>
                            </div>
                            <Package size={20} className="text-[#ff6200]" />
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        dataKey="count"
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #939393',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        formatter={(value, name, props) => [value, props.payload.status]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {chartData.map((status, index) => (
                                <div key={index} className="flex items-center text-xs text-[#939393]">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="truncate">{status.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/20 transition-all duration-300 overflow-hidden">
                    <div className="p-6 border-b border-[#939393]/20">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                                <p className="text-sm text-[#939393]">
                                    Showing {Math.min(orders.length, 10)} of {orders.length}
                                </p>
                            </div>
                            <div className="bg-[#ff6200]/10 px-3 py-1 rounded-xl text-sm text-[#ff6200] flex items-center">
                                <Calendar size={14} className="mr-1" />
                                Today
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#939393]/20">
                            <thead className="bg-[#1a1a1a]">
                                <tr>
                                    {["Order ID", "Customer", "Status", "Date", "Amount"].map((header) => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-[#939393] uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#939393]/20">
                                {orders.slice(0, 10).map((order) => (
                                    <tr key={order._id} className="hover:bg-[#1a1a1a] transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#939393]">
                                            {order.address.firstName} {order.address.lastName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full bg-[#ff6200]/10 text-[#ff6200]`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#939393]">
                                            {new Date(order.date || order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            ₹{order.amount.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {!orders.length && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-sm text-[#939393]">
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