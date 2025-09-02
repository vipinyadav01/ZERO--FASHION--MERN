import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../constants";
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
import { 
  Sparkles, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Users, 
  Calendar,
  DollarSign,
  Package,
  Eye,
  ChevronRight
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const OrderCharts = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Calculate analytics data
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const recentOrders = orders.slice(0, 7); // Show more on mobile

  // Mobile-optimized chart data
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
        borderColor: "rgba(30,41,59,0.8)",
        borderWidth: 1,
      },
    ],
  };

  const amountByDate = orders.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString("en-US", {
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
        label: "Revenue",
        data: Object.values(amountByDate),
        backgroundColor: "rgba(79,70,229,0.85)",
        borderColor: "rgba(126,34,206,1)",
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: "rgba(126,34,206,0.9)",
      },
    ],
  };

  // Mobile-optimized chart options
  const mobileChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        labels: { 
          color: "#c7d2fe",
          font: { size: 12 },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        },
        position: 'bottom'
      },
      title: { 
        display: false // Remove titles for mobile
      },
      tooltip: {
        backgroundColor: "rgba(15,23,42,0.95)",
        titleColor: "#4f46e5",
        bodyColor: "#c7d2fe",
        borderColor: "#4f46e5",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 12 }
      },
    },
    scales: {
      x: { 
        ticks: { 
          color: "#94a3b8",
          font: { size: 10 },
          maxRotation: 45
        }, 
        grid: { 
          color: "rgba(51,65,85,0.3)",
          display: false // Hide grid on mobile
        } 
      },
      y: { 
        ticks: { 
          color: "#94a3b8",
          font: { size: 10 }
        }, 
        grid: { 
          color: "rgba(51,65,85,0.3)" 
        } 
      },
    },
  };

  // Mobile loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-3 pt-20 pb-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="relative h-12 w-12 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
              <div className="absolute inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 animate-pulse animation-delay-75"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin"></div>
            </div>
            <div className="space-y-1">
              <p className="text-white font-semibold text-lg">Loading Analytics</p>
              <p className="text-slate-400 text-sm">Preparing your data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile empty state
  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-3 pt-20 pb-6">
        <div className="max-w-md mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">No Orders Yet</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  No orders to analyze. Check back once customers start placing orders.
                </p>
              </div>
              <button 
                onClick={() => navigate('/orders')}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 active:scale-95"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Mobile-first container */}
      <div className="px-1 pt-20 pb-6 sm:px-4 sm:pt-24 lg:px-6 lg:pt-28">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Mobile-first Header */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Order Analytics</h1>
                  <p className="text-xs sm:text-sm text-slate-400">{orders.length} total orders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Total Revenue</p>
                <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {currency}{(totalRevenue / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </div>

          {/* Mobile-first Stats Row */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {[
              {
                icon: Package,
                label: "Total Orders",
                value: orders.length.toString(),
                color: "blue"
              },
              {
                icon: DollarSign,
                label: "Revenue",
                value: `${currency}${(totalRevenue / 1000).toFixed(0)}k`,
                fullValue: `${currency}${totalRevenue.toLocaleString()}`,
                color: "emerald"
              },
              {
                icon: Eye,
                label: "Avg Order",
                value: `${currency}${Math.round(averageOrderValue)}`,
                color: "purple"
              },
              {
                icon: Calendar,
                label: "Today",
                value: orders.filter(order => 
                  new Date(order.date).toDateString() === new Date().toDateString()
                ).length.toString(),
                color: "amber"
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="relative overflow-hidden rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-3 sm:p-4 hover:bg-slate-700/60 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-1.5 sm:p-2 rounded-lg bg-${stat.color}-500/20`}>
                      <stat.icon className={`h-3 w-3 sm:h-4 sm:w-4 text-${stat.color}-400`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1 font-medium">{stat.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-white leading-none" title={stat.fullValue}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile-first Charts Section */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Charts Grid - Mobile stacked, Desktop side-by-side */}
            <div className="grid gap-4 lg:grid-cols-2">
              
              {/* Pie Chart - Mobile optimized */}
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:bg-slate-700/60 transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-indigo-500/20">
                    <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Order Status</h3>
                </div>
                <div className="h-64 sm:h-72 lg:h-80">
                  <Pie data={statusChartData} options={mobileChartOptions} />
                </div>
              </div>

              {/* Bar Chart - Mobile optimized */}
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:bg-slate-700/60 transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-purple-500/20">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Revenue Trend</h3>
                </div>
                <div className="h-64 sm:h-72 lg:h-80">
                  <Bar data={amountChartData} options={mobileChartOptions} />
                </div>
              </div>
            </div>

            {/* Recent Orders - Mobile optimized */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-4 sm:p-6 hover:bg-slate-700/60 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Recent Orders</h3>
                </div>
                <button 
                  onClick={() => navigate('/orders')}
                  className="text-xs px-2 py-1 rounded-full bg-slate-600/50 text-slate-300 hover:bg-slate-600 transition-colors"
                >
                  View All
                </button>
              </div>

              {/* Mobile-first order list */}
              <div className="space-y-2 sm:space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="group p-3 sm:p-4 rounded-xl bg-slate-700/40 hover:bg-slate-600/50 transition-all duration-200 cursor-pointer active:scale-95"
                    onClick={() => navigate('/orders')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-white truncate">
                            #{order._id.slice(-6)}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                            order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">
                          {order.userId?.name || 'Unknown User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">
                            {currency}{order.amount.toLocaleString()}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View all button - Mobile optimized */}
              <button 
                onClick={() => navigate('/orders')}
                className="mt-4 w-full py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                View All Orders
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCharts;