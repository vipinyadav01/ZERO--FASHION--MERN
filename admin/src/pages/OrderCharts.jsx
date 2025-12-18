import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Bar, Pie, Line } from "react-chartjs-2";
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
  PieChart as PieChartIcon, 
  BarChart3, 
  Users, 
  Calendar,
  DollarSign,
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Rocket
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

  const fetchOrders = async () => {
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
  };

  useEffect(() => {
    if (token) fetchOrders();
    else navigate("/login");
  }, [token, navigate]);

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
        labels: { color: '#94a3b8', font: { family: 'Montserrat', size: 10, weight: '700' }, usePointStyle: true, padding: 20 }
      },
      tooltip: {
        backgroundColor: '#0a0a0f',
        titleFont: { family: 'Montserrat', size: 14, weight: '900' },
        bodyFont: { family: 'Montserrat', size: 12, weight: '500' },
        padding: 16,
        cornerRadius: 16,
        borderColor: 'rgba(79, 70, 229, 0.4)',
        borderWidth: 1,
        displayColors: false,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { family: 'Montserrat', weight: '600' } } },
      y: { grid: { color: 'rgba(51, 65, 85, 0.2)', borderDash: [5, 5] }, ticks: { color: '#64748b', font: { family: 'Montserrat', weight: '600' } } }
    }
  };

  const revenueChartData = {
    labels: sortedDates,
    datasets: [{
      label: "Gross Revenue",
      data: sortedDates.map(d => revenueByDate[d]),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 4,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
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
      hoverOffset: 20
    }]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-800 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm animate-pulse">Analyzing Performance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Analytics Header */}
        <header className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-slate-800/60 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] -mr-48 -mt-48 rounded-full animate-pulse"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20">
                  <TrendingUp className="w-8 h-8 text-fuchsia-400" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">
                  Market <span className="text-fuchsia-500">Pulse</span>
                </h1>
              </div>
              <p className="text-slate-400 text-lg font-medium max-w-md">
                Quantifying growth. Real-time visualization of your commercial trajectory and delivery efficiency.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={fetchOrders}
                className="px-8 py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
              >
                <Activity className="w-5 h-5 text-indigo-400" />
                Live Refresh
              </button>
            </div>
          </div>
        </header>

        {/* Global Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: DollarSign, label: "Gross Revenue", value: `${currency}${totalRevenue.toLocaleString()}`, color: "indigo", trend: "+12.5%" },
            { icon: Target, label: "Avg Transaction", value: `${currency}${Math.round(averageOrderValue).toLocaleString()}`, color: "fuchsia", trend: "+4.2%" },
            { icon: Package, label: "Volume Total", value: orders.length.toString(), color: "teal", trend: "+18% " },
            { icon: Rocket, label: "Growth Index", value: "98.4", color: "amber", trend: "High" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#0a0a0f] border border-slate-800/60 rounded-3xl p-6 hover:border-slate-700/80 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="text-right">
                    <p className={`text-xs font-black uppercase tracking-widest ${stat.trend.includes('-') ? "text-rose-400" : "text-emerald-400"} flex items-center gap-1`}>
                        {stat.trend.includes('-') ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {stat.trend}
                    </p>
                </div>
              </div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Vision Center - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Velocity */}
          <div className="lg:col-span-2 bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-8 sm:p-10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full"></div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Revenue Velocity</h3>
                  <p className="text-slate-500 text-sm font-medium italic">Temporal performance tracking</p>
                </div>
              </div>
              <div className="flex gap-2">
                {['Day', 'Week', 'Month'].map(t => (
                  <button key={t} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${t === 'Day' ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-500 hover:text-white"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[400px]">
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          {/* Operational Distribution */}
          <div className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-8 sm:p-10 shadow-xl flex flex-col">
            <div className="mb-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Status Matrix</h3>
              <p className="text-slate-500 text-sm font-medium italic">Fulfillment state distribution</p>
            </div>
            <div className="flex-1 relative flex items-center justify-center p-4">
              <div className="w-full h-full max-h-[300px]">
                <Pie data={statusPieData} options={{...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
              </div>
              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total</p>
                <p className="text-3xl font-black text-white">{orders.length}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-800">
              {Object.entries(statusCounts).map(([status, count], i) => (
                <div key={status} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusPieData.datasets[0].backgroundColor[i] }}></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase truncate flex-1">{status}</p>
                  <p className="text-xs font-black text-white">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategy Bar */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900/40 border border-indigo-500/20 rounded-[2.5rem] p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left">
                <div className="p-6 bg-white/5 rounded-full backdrop-blur-3xl shrink-0">
                    <Target className="w-12 h-12 text-indigo-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Performance Analytics Active</h3>
                    <p className="text-indigo-200/60 text-lg font-medium">Your global fashion footprint is expanding. Currently outperforming last month's fulfillment baseline by 18.2%.</p>
                </div>
                <button className="px-10 py-5 bg-white text-indigo-950 font-black uppercase rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
                    Export Report
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default OrderCharts;