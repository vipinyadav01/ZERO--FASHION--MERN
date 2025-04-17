import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Calendar, TrendingUp, Package, DollarSign, ShoppingBag, Clock, Filter, RefreshCw } from 'lucide-react';
import { backendUrl } from "../App";

// Constants
const COLOR_THEME = {
    primary: '#ff6200',
    primaryLight: 'rgba(255, 98, 0, 0.3)',
    primaryHover: '#ff4500',
    background: '#131313',
    backgroundAlt: '#1a1a1a',
    text: '#939393',
    textLight: '#ffffff',
    border: 'rgba(147, 147, 147, 0.2)'
};

const STATUS_COLORS = [
    '#ff6200', '#ff8c00', '#ffa500', '#ff4500', '#ff6f00', '#ff7f50'
];

const TIME_PERIODS = {
    week: {
        days: 7,
        interval: 'day',
        previousMultiplier: 2,
        dateFormat: { day: 'numeric' },
        chartPeriods: 7
    },
    month: {
        days: 30,
        interval: 'day',
        previousMultiplier: 2,
        dateFormat: { day: 'numeric', month: 'short' },
        chartPeriods: 30
    },
    year: {
        days: 365,
        interval: 'month',
        previousMultiplier: 2,
        dateFormat: { month: 'short' },
        chartPeriods: 12
    }
};

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

    // Memoized time period settings based on current timeframe
    const timePeriod = useMemo(() => TIME_PERIODS[timeframe], [timeframe]);

    // Fetch orders with memoized callback
    const fetchAllOrders = useCallback(async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setError("Authentication required. Please log in.");
            setLoading(false);
            toast.error("Please log in to view the dashboard.");
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
                const ordersData = response.data.orders || [];
                setOrders(ordersData);
            } else {
                throw new Error(response.data.message || "Failed to fetch orders");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to fetch orders. Please try again.";
            setError(message);
            toast.error(message);
            console.error("Fetch orders error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter orders by selected timeframe
    const filterOrdersByTimeframe = useCallback((orders, period) => {
        if (!orders?.length) return [];

        const now = new Date();
        const cutoff = new Date(now);

        if (period.interval === 'day') {
            cutoff.setDate(cutoff.getDate() - period.days);
        } else {
            cutoff.setMonth(cutoff.getMonth() - period.chartPeriods);
        }

        return orders.filter(order => {
            const orderDate = new Date(order.date || order.createdAt);
            return !isNaN(orderDate.getTime()) && orderDate >= cutoff;
        });
    }, []);

    // Calculate growth rate comparing current period to previous period
    const calculateGrowthRate = useCallback((orders, period) => {
        if (!orders?.length) return 0;

        const now = new Date();

        // Current period
        const currentPeriodStart = new Date(now);
        if (period.interval === 'day') {
            currentPeriodStart.setDate(currentPeriodStart.getDate() - period.days);
        } else {
            currentPeriodStart.setMonth(currentPeriodStart.getMonth() - period.chartPeriods);
        }

        // Previous period (same length, just before current period)
        const previousPeriodEnd = new Date(currentPeriodStart);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);

        const previousPeriodStart = new Date(previousPeriodEnd);
        if (period.interval === 'day') {
            previousPeriodStart.setDate(previousPeriodStart.getDate() - period.days);
        } else {
            previousPeriodStart.setMonth(previousPeriodStart.getMonth() - period.chartPeriods);
        }

        const currentOrders = orders.filter(order => {
            const orderDate = new Date(order.date || order.createdAt);
            return !isNaN(orderDate.getTime()) &&
                   orderDate >= currentPeriodStart &&
                   orderDate <= now &&
                   order.status !== 'Cancelled';
        });

        const previousOrders = orders.filter(order => {
            const orderDate = new Date(order.date || order.createdAt);
            return !isNaN(orderDate.getTime()) &&
                   orderDate >= previousPeriodStart &&
                   orderDate <= previousPeriodEnd &&
                   order.status !== 'Cancelled';
        });

        const currentValue = currentOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const previousValue = previousOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

        if (previousValue === 0) return currentValue > 0 ? 100 : 0;
        return ((currentValue - previousValue) / previousValue) * 100;
    }, []);

    // Calculate dashboard statistics
    const calculateStats = useCallback((orders) => {
        if (!orders?.length) {
            setStats({
                total: 0,
                delivered: 0,
                pending: 0,
                cancelled: 0,
                revenue: 0,
                avgOrderValue: 0,
                growthRate: 0
            });
            return;
        }

        const filteredOrders = filterOrdersByTimeframe(orders, timePeriod);

        const validOrders = filteredOrders.filter(order => order.status !== "Cancelled");
        const totalRevenue = validOrders.reduce((acc, order) => acc + (order.amount || 0), 0);

        const newStats = {
            total: filteredOrders.length,
            delivered: filteredOrders.filter(order => order.status === "Delivered").length,
            pending: filteredOrders.filter(order => !["Delivered", "Cancelled"].includes(order.status)).length,
            cancelled: filteredOrders.filter(order => order.status === "Cancelled").length,
            revenue: totalRevenue,
            avgOrderValue: validOrders.length ? totalRevenue / validOrders.length : 0,
            growthRate: calculateGrowthRate(orders, timePeriod)
        };

        setStats(newStats);
    }, [filterOrdersByTimeframe, calculateGrowthRate, timePeriod]);

    // Fetch orders on component mount
    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    // Update stats when orders or timeframe changes
    useEffect(() => {
        calculateStats(orders);
    }, [orders, calculateStats]);

    // Process data for charts
    const chartData = useMemo(() => {
        if (!orders?.length) return { statusData: [], revenueData: [] };

        const filteredOrders = filterOrdersByTimeframe(orders, timePeriod);

        // Status distribution data
        const statusCounts = {
            "Order Placed": 0, "Packing": 0, "Shipped": 0,
            "Out for Delivery": 0, "Delivered": 0, "Cancelled": 0
        };

        filteredOrders.forEach(order => {
            const status = order.status || "Unknown";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const statusData = Object.entries(statusCounts)
            .map(([status, count]) => ({ status, count }))
            .filter(item => item.count > 0);

        // Revenue trend data
        const revenueData = [];
        const now = new Date();

        for (let i = timePeriod.chartPeriods - 1; i >= 0; i--) {
            const date = new Date(now);

            if (timePeriod.interval === 'day') {
                date.setDate(date.getDate() - i);
            } else {
                date.setMonth(date.getMonth() - i);
            }

            // Format date for display
            const period = date.toLocaleDateString('en-US', timePeriod.dateFormat);

            // Calculate revenue for this period
            const periodRevenue = filteredOrders
                .filter(order => {
                    const orderDate = new Date(order.date || order.createdAt);

                    if (isNaN(orderDate.getTime())) return false;
                    if (order.status === 'Cancelled') return false;

                    if (timePeriod.interval === 'day') {
                        return orderDate.getDate() === date.getDate() &&
                               orderDate.getMonth() === date.getMonth() &&
                               orderDate.getFullYear() === date.getFullYear();
                    } else {
                        return orderDate.getMonth() === date.getMonth() &&
                               orderDate.getFullYear() === date.getFullYear();
                    }
                })
                .reduce((acc, order) => acc + (order.amount || 0), 0);

            revenueData.push({ period, revenue: periodRevenue });
        }

        return { statusData, revenueData };
    }, [orders, filterOrdersByTimeframe, timePeriod]);

    // Render loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#131313]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ff6200]"></div>
                    <p className="text-[#939393] text-sm mt-2">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#131313] text-[#939393]">
                <div className="text-center p-6 max-w-md bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-2xl border border-[#939393]/20 shadow-lg">
                    <div className="text-[#ff6200] mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-base sm:text-lg mb-4">{error}</p>
                    <button
                        onClick={fetchAllOrders}
                        className="px-4 py-2 bg-[#ff6200] text-white rounded-xl hover:bg-[#ff4500] transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#131313] p-4 sm:p-6 py-20 text-[#939393]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Order Analytics</h1>
                        <p className="text-[#939393] mt-1 text-sm sm:text-base">Monitor and optimize your business performance</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                        <Filter size={16} className="text-[#ff6200]" />
                        <select
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#1a1a1a] text-[#939393] border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 text-sm sm:text-base"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {[
                        { title: "Total Orders", value: stats.total, icon: ShoppingBag, extra: `${stats.growthRate.toFixed(1)}% vs last period` },
                        { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, extra: `Avg ₹${stats.avgOrderValue.toFixed(0)}` },
                        { title: "Delivered", value: stats.delivered, icon: Package, extra: `${stats.total ? ((stats.delivered / stats.total) * 100).toFixed(0) : 0}%` },
                        { title: "Pending", value: stats.pending, icon: Clock, extra: "Requires attention" }
                    ].map((card, idx) => (
                        <div
                            key={idx}
                            className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-2xl p-4 sm:p-5 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/30 hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm font-medium text-[#939393] mb-1">{card.title}</p>
                                    <h3 className="text-lg sm:text-xl font-bold text-white">{card.value}</h3>
                                </div>
                                <div className="bg-[#ff6200]/10 p-2 sm:p-3 rounded-xl">
                                    <card.icon size={18} className="text-[#ff6200]" />
                                </div>
                            </div>
                            <p className={`mt-2 sm:mt-3 text-xs ${card.title === "Pending" ? "text-[#ff6200]" : "text-[#939393]"}`}>{card.extra}</p>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-2xl p-4 sm:p-5 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/30 transition-all duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-white">Revenue Trend</h2>
                                <p className="text-xs sm:text-sm text-[#939393]">Revenue over time</p>
                            </div>
                            <TrendingUp size={18} className="text-[#ff6200]" />
                        </div>
                        <div className="h-64 sm:h-80">
                            <ResponsiveContainer>
                                <AreaChart data={chartData.revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#939393" opacity={0.2} />
                                    <XAxis dataKey="period" stroke="#939393" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="#939393" tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #939393',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke={COLOR_THEME.primary}
                                        fill={COLOR_THEME.primaryLight}
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-2xl p-4 sm:p-5 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/30 transition-all duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-white">Order Status</h2>
                                <p className="text-xs sm:text-sm text-[#939393]">Distribution</p>
                            </div>
                            <Package size={18} className="text-[#ff6200]" />
                        </div>
                        <div className="h-64 sm:h-80">
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData.statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        dataKey="count"
                                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                        paddingAngle={5}
                                    >
                                        {chartData.statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1a1a1a',
                                            border: '1px solid #939393',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '12px'
                                        }}
                                        formatter={(value, name, props) => [value, props.payload.status]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {chartData.statusData.map((status, index) => (
                                <div key={index} className="flex items-center text-xs text-[#939393]">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }}></div>
                                    <span className="truncate">{status.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-2xl border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/30 transition-all duration-300 overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-[#939393]/20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-white">Recent Orders</h2>
                                <p className="text-xs sm:text-sm text-[#939393]">
                                    Showing {Math.min(orders.length, 10)} of {orders.length}
                                </p>
                            </div>
                            <div className="mt-2 sm:mt-0 bg-[#ff6200]/10 px-3 py-1 rounded-xl text-xs sm:text-sm text-[#ff6200] flex items-center">
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
                                        <th key={header} className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-[#939393] uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#939393]/20">
                                {orders.slice(0, 10).map((order) => (
                                    <tr key={order._id} className="hover:bg-[#1a1a1a] transition-colors duration-200">
                                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-white">
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-[#939393]">
                                            {order.address?.firstName || 'N/A'} {order.address?.lastName || ''}
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full bg-[#ff6200]/10 text-[#ff6200]`}>
                                                {order.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-[#939393]">
                                            {new Date(order.date || order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-white">
                                            ₹{(order.amount || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {!orders.length && (
                                    <tr>
                                        <td colSpan="5" className="px-3 sm:px-4 py-6 text-center text-xs sm:text-sm text-[#939393]">
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