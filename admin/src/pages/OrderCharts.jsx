import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Sparkles } from "lucide-react";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const OrderCharts = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modern color scheme
  const primaryColor = "#0f172a"; // Slate-900
  const secondaryColor = "#94a3b8"; // Slate-400
  const cardBgColor = "#1e293b"; // Slate-800
  const chartPanelBg = "#0f172a"; // Slate-900
  const borderColor = "#334155";
  const accentFromColor = "#4f46e5"; // Indigo-600
  const accentToColor = "#7e22ce"; // Purple-700

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error("No token provided");
      }
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      if (error.response?.status === 401) {
        toast.error("Admin access required. Please log in again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      toast.error("Please log in as admin to view orders");
      navigate("/login");
    }
    // eslint-disable-next-line
  }, [token, navigate]);

  // Prepare data for charts
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Orders by Status",
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(79,70,229,0.85)",   // Indigo
          "rgba(126,34,206,0.85)",  // Purple
          "rgba(20,184,166,0.85)",  // Teal
          "rgba(59,130,246,0.85)",  // Blue
          "rgba(239,68,68,0.85)",   // Red
          "rgba(245,158,11,0.85)",  // Amber
          "rgba(16,185,129,0.85)",  // Green
          "rgba(236,72,153,0.85)",  // Pink
        ],
        borderColor: borderColor,
        borderWidth: 1.5,
      },
    ],
  };

  const amountByDate = orders.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    acc[date] = (acc[date] || 0) + order.amount;
    return acc;
  }, {});

  const amountChartData = {
    labels: Object.keys(amountByDate),
    datasets: [
      {
        label: "Total Amount by Date",
        data: Object.values(amountByDate),
        backgroundColor: "rgba(79,70,229,0.85)",
        borderColor: accentToColor,
        borderWidth: 2,
        borderRadius: 10,
        hoverBackgroundColor: "rgba(126,34,206,0.85)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#c7d2fe" } },
      title: { display: true, color: "#c7d2fe" },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: accentFromColor,
        bodyColor: "#c7d2fe",
        borderColor: accentToColor,
        borderWidth: 1,
      },
    },
    scales: {
      x: { ticks: { color: secondaryColor }, grid: { color: "#232946" } },
      y: { ticks: { color: secondaryColor }, grid: { color: "#232946" } },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 mx-auto relative">
            <div className="absolute inset-0 rounded-full animate-pulse bg-indigo-600/20"></div>
            <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-indigo-500"></div>
          </div>
          <p className="text-slate-400 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen py-8 px-4 bg-slate-900">
        <div
          className="rounded-3xl shadow-xl max-w-3xl mx-auto p-8 border border-slate-700 bg-slate-800"
        >
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="rounded-full p-6 mb-6 bg-gradient-to-br from-indigo-600/15 to-purple-700/10">
              <Sparkles className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">
              No orders found
            </h3>
            <p className="text-slate-400 max-w-md mb-6">
              There are no orders to display. Check back later or encourage users to place orders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-slate-900">
      <div
        className="rounded-3xl shadow-2xl max-w-6xl mx-auto overflow-hidden border border-slate-700 bg-slate-800"
      >
        {/* Header */}
        <div className="border-b px-7 py-7 border-slate-700 bg-gradient-to-r from-indigo-600/10 to-purple-700/10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-indigo-400" />
            Order Analytics <span className="text-base text-indigo-300">({orders.length})</span>
          </h2>
        </div>

        {/* Charts */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart: Orders by Status */}
          <div
            className="rounded-2xl p-7 bg-slate-900 border border-slate-700 shadow-lg hover:shadow-indigo-800/30 transition-all"
          >
            <h3 className="text-lg font-semibold mb-5 text-indigo-300 tracking-wide">
              Orders by Status
            </h3>
            <Pie
              data={statusChartData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: "Order Status Distribution", color: "#c7d2fe" } },
              }}
            />
          </div>

          {/* Bar Chart: Total Amount by Date */}
          <div
            className="rounded-2xl p-7 bg-slate-900 border border-slate-700 shadow-lg hover:shadow-purple-800/30 transition-all"
          >
            <h3 className="text-lg font-semibold mb-5 text-purple-300 tracking-wide">
              Total Amount by Date
            </h3>
            <Bar
              data={amountChartData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: "Revenue Over Time", color: "#c7d2fe" } },
              }}
            />
          </div>
        </div>

        {/* Order List */}
        <div className="p-8 border-t border-slate-700 bg-gradient-to-r from-indigo-600/10 to-purple-700/10">
          <h3 className="text-lg font-semibold mb-6 text-white">
            Recent Orders
          </h3>
          <div className="grid gap-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-700 hover:border-indigo-500/50 transition-all"
              >
                <div>
                  <p className="font-semibold text-white">
                    <span className="text-indigo-400">Order</span> #{order._id.slice(-8)}
                  </p>
                  <p className="text-slate-400">
                    <span className="text-white">User:</span> {order.userId.name} ({order.userId.email})
                  </p>
                  <p className="text-slate-400">
                    <span className="text-white">Status:</span> <span className="font-semibold text-indigo-300">{order.status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    {currency}
                    {order.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderCharts;