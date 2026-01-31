import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { backendUrl, currency } from "../constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { 
  TrendingUp, 
  BarChart3, 
  RefreshCcw,
  Package,
  ArrowUpRight,
  DollarSign,
  ShoppingCart
} from "lucide-react";

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

const OrderCharts = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      if (!token) throw new Error("No token provided");
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
  }, [token, navigate]);

  useEffect(() => {
    if (token) fetchOrders();
    else navigate("/login");
  }, [token, navigate, fetchOrders]);

  // Analytics calculation
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const revenueByDate = orders.reduce((acc, order) => {
    const date = new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    acc[date] = (acc[date] || 0) + order.amount;
    return acc;
  }, {});

  const sortedDates = Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b));

  // Chart configs
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'sans-serif', size: 11, weight: '600' }, usePointStyle: true, padding: 20 }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'sans-serif', size: 13, weight: '700' },
        bodyFont: { family: 'sans-serif', size: 12, weight: '500' },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'sans-serif', weight: '500' } } },
      y: { grid: { color: 'rgba(51, 65, 85, 0.2)', borderDash: [5, 5] }, ticks: { color: '#64748b', font: { family: 'sans-serif', weight: '500' } } }
    }
  };

  const revenueChartData = {
    labels: sortedDates,
    datasets: [{
      label: "Revenue",
      data: sortedDates.map(d => revenueByDate[d]),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  const statusPieData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: [
        '#6366f1', '#a855f7', '#14b8a6', '#0ea5e9', '#f43f5e', '#f59e0b', '#10b981'
      ],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 font-sans text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Analytics Overview</h1>
              <p className="text-slate-400 text-sm">Real-time performance metrics and sales data.</p>
            </div>
            <button 
                onClick={fetchOrders}
                className="px-4 py-2 bg-[#0f111a] border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-medium"
            >
                <RefreshCcw className="w-4 h-4" />
                Refresh Data
            </button>
        </div>

        {/* Global Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: DollarSign, label: "Total Revenue", value: `${currency}${totalRevenue.toLocaleString()}`, color: "indigo", trend: "+12.5%" },
            { icon: ShoppingCart, label: "Avg. Order Value", value: `${currency}${Math.round(averageOrderValue).toLocaleString()}`, color: "fuchsia", trend: "+4.2%" },
            { icon: Package, label: "Total Orders", value: orders.length.toString(), color: "teal", trend: "+18% " },
            { icon: TrendingUp, label: "Growth", value: "98.4%", color: "amber", trend: "High" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-500/10`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center justify-end gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {stat.trend}
                    </p>
                </div>
              </div>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Trends */}
          <div className="lg:col-span-2 bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                 </div>
                 <h3 className="text-lg font-bold text-white">Revenue Trends</h3>
            </div>
            
            <div className="h-[350px] w-full">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">Order Status</h3>
              <p className="text-slate-500 text-sm">Distribution by fulfillment status</p>
            </div>
            <div className="flex-1 relative flex items-center justify-center p-2 min-h-[250px]">
               <Pie data={statusPieData} options={{...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800">
              {Object.entries(statusCounts).map(([status, count], i) => (
                <div key={status} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: statusPieData.datasets[0].backgroundColor[i] }}></div>
                  <p className="text-xs font-medium text-slate-400 truncate flex-1">{status}</p>
                  <p className="text-sm font-bold text-white">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

OrderCharts.propTypes = {
  token: PropTypes.string.isRequired
};

export default OrderCharts;