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

  // Main color theme (matching List.jsx)
  const primaryColor = "#131313";
  const secondaryColor = "#939393";
  const accentColor = "#ff6200";

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
          "#ff6200",
          "#10b981",
          "#3b82f6",
          "#8b5cf6",
          "#ef4444",
          "#f59e0b",
          "#6b7280",
          "#ec4899",
        ],
        borderColor: "#1a1a1a",
        borderWidth: 1,
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
        backgroundColor: accentColor,
        borderColor: accentColor,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "white" } },
      title: { display: true, color: "white" },
    },
    scales: {
      x: { ticks: { color: secondaryColor }, grid: { color: "#2a2a2a" } },
      y: { ticks: { color: secondaryColor }, grid: { color: "#2a2a2a" } },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: primaryColor }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
            style={{ borderColor: accentColor, borderTopColor: "transparent" }}
          ></div>
          <p style={{ color: secondaryColor }} className="font-medium">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: primaryColor }}>
        <div
          className="rounded-3xl shadow-lg max-w-3xl mx-auto p-8"
          style={{ backgroundColor: "#1a1a1a", borderWidth: "1px", borderColor: "#2a2a2a" }}
        >
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <div className="rounded-full p-6 mb-6" style={{ backgroundColor: `rgba(255, 98, 0, 0.15)` }}>
              <Sparkles className="w-12 h-12" style={{ color: accentColor }} />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ color: "white" }}>
              No orders found
            </h3>
            <p style={{ color: secondaryColor }} className="max-w-md mb-6">
              There are no orders to display. Check back later or encourage users to place orders.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: primaryColor }}>
      <div
        className="rounded-3xl shadow-lg max-w-6xl mx-auto overflow-hidden"
        style={{ backgroundColor: "#1a1a1a", borderWidth: "1px", borderColor: "#2a2a2a" }}
      >
        {/* Header */}
        <div className="border-b px-6 py-5" style={{ borderColor: "#2a2a2a" }}>
          <h2 className="text-2xl font-bold" style={{ color: "white" }}>
            Order Analytics ({orders.length})
          </h2>
        </div>

        {/* Charts */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart: Orders by Status */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "#252525", borderWidth: "1px", borderColor: "#333333" }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: "white" }}>
              Orders by Status
            </h3>
            <Pie
              data={statusChartData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: "Order Status Distribution" } },
              }}
            />
          </div>

          {/* Bar Chart: Total Amount by Date */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "#252525", borderWidth: "1px", borderColor: "#333333" }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: "white" }}>
              Total Amount by Date
            </h3>
            <Bar
              data={amountChartData}
              options={{
                ...chartOptions,
                plugins: { ...chartOptions.plugins, title: { display: true, text: "Revenue Over Time" } },
              }}
            />
          </div>
        </div>

        {/* Order List (Optional) */}
        <div className="p-6 border-t" style={{ borderColor: "#2a2a2a" }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: "white" }}>
            Recent Orders
          </h3>
          <div className="grid gap-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                style={{ backgroundColor: "#252525", borderWidth: "1px", borderColor: "#333333" }}
              >
                <div>
                  <p className="font-semibold" style={{ color: "white" }}>
                    Order ID: {order._id.slice(-8)}
                  </p>
                  <p style={{ color: secondaryColor }}>
                    User: {order.userId.name} ({order.userId.email})
                  </p>
                  <p style={{ color: secondaryColor }}>Status: {order.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: accentColor }}>
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