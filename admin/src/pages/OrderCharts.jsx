import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    LineChart,
    Line,
    AreaChart,
    Area,
} from "recharts";

const OrderCharts = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllOrders = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`${backendUrl}/api/order/list`, {}, { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.orders);
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

        const ordersByDate = {};
        orders.forEach((order) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            if (!ordersByDate[date]) {
                ordersByDate[date] = { ...statusCounts };
            }
            if (ordersByDate[date][order.status] !== undefined) {
                ordersByDate[date][order.status]++;
            }
            if (statusCounts[order.status] !== undefined) {
                statusCounts[order.status]++;
            }
        });

        const columnChartData = Object.keys(statusCounts).map((status) => ({
            status,
            count: statusCounts[status],
        }));

        const pieChartData = Object.keys(statusCounts).map((status) => ({
            name: status,
            value: statusCounts[status],
        }));

        const radarChartData = Object.keys(statusCounts).map((status) => ({
            category: status,
            count: statusCounts[status],
            fullMark: Math.max(...Object.values(statusCounts)) || 1,
        }));

        const lineChartData = Object.keys(ordersByDate).map((date) => ({
            date,
            ...ordersByDate[date],
        }));

        const stackedBarChartData = Object.keys(ordersByDate).map((date) => ({
            date,
            ...ordersByDate[date],
        }));

        return { columnChartData, pieChartData, radarChartData, lineChartData, stackedBarChartData };
    };

    const { columnChartData, pieChartData, radarChartData, lineChartData, stackedBarChartData } = processChartData(orders);
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF1919"];

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h3 className="text-2xl font-bold text-center mb-8">Order Statistics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
                    <h4 className="text-xl font-semibold mb-4">Order Status Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={columnChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="status" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-xl font-semibold mb-4">Order Status Percentage</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(2)}%)`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-xl font-semibold mb-4">Order Trends Over Time</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Order Placed" stroke="#0088FE" />
                            <Line type="monotone" dataKey="Delivered" stroke="#00C49F" />
                            <Line type="monotone" dataKey="Cancelled" stroke="#FF1919" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-xl font-semibold mb-4">Order Status Over Time</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stackedBarChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Order Placed" stackId="a" fill="#0088FE" />
                            <Bar dataKey="Packing" stackId="a" fill="#00C49F" />
                            <Bar dataKey="Shipped" stackId="a" fill="#FFBB28" />
                            <Bar dataKey="Out for Delivery" stackId="a" fill="#FF8042" />
                            <Bar dataKey="Delivered" stackId="a" fill="#AF19FF" />
                            <Bar dataKey="Cancelled" stackId="a" fill="#FF1919" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-xl font-semibold mb-4">Order Status Comparison</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="category" />
                            <PolarRadiusAxis angle={30} domain={[0, Math.max(...Object.values(radarChartData.map(d => d.fullMark)))]} />
                            <Radar name="Orders" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default OrderCharts;
