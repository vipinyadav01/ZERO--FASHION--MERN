import  { useContext, useState, useEffect, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage, FiTruck, FiCheck, FiX, FiAlertCircle,
  FiSearch, FiFilter, FiBox, FiShoppingBag, FiCalendar,
  FiCreditCard, FiArrowUp, FiArrowDown
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency, logout } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  const statusColors = {
    "Pending": "bg-gray-100 text-gray-800",
    "Order Placed": "bg-indigo-100 text-indigo-800",
    "Packing": "bg-amber-100 text-amber-800",
    "Shipped": "bg-blue-100 text-blue-800",
    "Out for delivered": "bg-purple-100 text-purple-800",
    "Delivered": "bg-emerald-100 text-emerald-800",
    "Cancelled": "bg-rose-100 text-rose-800",
    "Payment Failed": "bg-red-100 text-red-800",
  };

  const statusIcons = {
    "Pending": <FiAlertCircle className="w-5 h-5" />,
    "Order Placed": <FiShoppingBag className="w-5 h-5" />,
    "Packing": <FiBox className="w-5 h-5" />,
    "Shipped": <FiPackage className="w-5 h-5" />,
    "Out for delivered": <FiTruck className="w-5 h-5" />,
    "Delivered": <FiCheck className="w-5 h-5" />,
    "Cancelled": <FiX className="w-5 h-5" />,
    "Payment Failed": <FiX className="w-5 h-5" />,
  };

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await axios.get(`${backendUrl}/api/order/userOrders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      if (data.success) {
        const allOrders = data.orders.flatMap((order) =>
          order.items.map((item) => ({
            orderId: order._id,
            name: item.name,
            image: item.image, 
            size: item.size || "N/A",
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.price * item.quantity,
            date: order.date,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
          }))
        );
        setOrderData(allOrders);
      } else {
        setError({ type: "error", message: data.message || "Failed to load orders" });
        toast.error(data.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        setError({ type: "error", message: error.response?.data?.message || "An unexpected error occurred" });
        toast.error(error.response?.data?.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      const response = await axios.put(
        `${backendUrl}/api/order/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;

      if (data.success) {
        setOrderData((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
        toast.success("Order cancelled successfully");
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        logout();
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "An unexpected error occurred");
      }
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleTrackOrder = (item) => {
    navigate("/TrackOrder", {
      state: {
        orderDetails: {
          orderId: item.orderId,
          name: item.name,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          date: item.date,
          status: item.status,
          price: item.price,
          paymentMethod: item.paymentMethod,
        },
      },
    });
  };

  useEffect(() => {
    loadOrders();
  }, [token, backendUrl]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orderData.filter((order) => {
      const statusMatch =
        filterStatus === "all" || order.status.toLowerCase() === filterStatus.toLowerCase();
      const searchMatch =
        searchTerm === "" ||
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === "price") {
        comparison = a.totalPrice - b.totalPrice;
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [orderData, filterStatus, searchTerm, sortBy, sortOrder]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full"
        >
          <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your orders.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 md:mt-24 mb-16">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 mb-4 p-4 rounded-xl shadow-lg ${
              error.type === "success" ? "bg-emerald-50 border-emerald-500" : "bg-rose-50 border-rose-500"
            } border flex items-center justify-between max-w-md w-full`}
          >
            <div className="flex items-center">
              {error.type === "success" ? (
                <FiCheck className="w-5 h-5 text-emerald-500 mr-2" />
              ) : (
                <FiAlertCircle className="w-5 h-5 text-rose-500 mr-2" />
              )}
              <span className={error.type === "success" ? "text-emerald-700" : "text-rose-700"}>
                {error.message}
              </span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      {/* Search and filter bar */}
      <div className="mb-6 bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort options */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort("date")}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
                sortBy === "date" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"
              }`}
            >
              <FiCalendar className="w-4 h-4" />
              Date
              {sortBy === "date" && (
                sortOrder === "desc" ? <FiArrowDown className="w-4 h-4" /> : <FiArrowUp className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => toggleSort("price")}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
                sortBy === "price" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"
              }`}
            >
              <FiCreditCard className="w-4 h-4" />
              Price
              {sortBy === "price" && (
                sortOrder === "desc" ? <FiArrowDown className="w-4 h-4" /> : <FiArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Mobile filter toggle */}
          <button
            className="md:hidden flex items-center justify-center px-4 py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <FiFilter className="mr-2" />
            <span>Filter</span>
          </button>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:flex flex-wrap gap-2">
          {["all", "Pending", "Order Placed", "Packing", "Shipped", "Out for delivered", "Delivered", "Cancelled", "Payment Failed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterStatus.toLowerCase() === status.toLowerCase()
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All Orders" : status}
            </button>
          ))}
        </div>

        {/* Mobile filters */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {["all", "Pending", "Order Placed", "Packing", "Shipped", "Out for delivered", "Delivered", "Cancelled", "Payment Failed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setMobileFiltersOpen(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filterStatus.toLowerCase() === status.toLowerCase()
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all" ? "All Orders" : status}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-ping opacity-25"></div>
            </div>
          </div>
        </div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-md"
        >
          <FiPackage className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-700 mb-3">No Orders Found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your filters or search term"
              : "Start shopping to create your first order!"}
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition duration-300"
          >
            Browse Products
          </button>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          {filteredAndSortedOrders.map((item, index) => (
            <motion.div
              key={`${item.orderId}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col gap-6">
                  {/* Order header with status */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-500">Order ID:</span>
                      <span className="font-mono font-semibold">{item.orderId.slice(-8)}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusColors[item.status] || "bg-gray-100 text-gray-800"}`}>
                      {statusIcons[item.status] || <FiPackage className="w-5 h-5" />}
                      <span className="text-sm font-medium">{item.status}</span>
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative group">
                      <img
                        className="w-full sm:w-32 h-32 sm:h-32 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-xl"></div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{item.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Unit Price:</span>
                          <span>
                            {currency}
                            {item.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Quantity:</span>
                          <span>{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Total:</span>
                          <span className="font-semibold text-gray-800">
                            {currency}
                            {item.totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Size:</span>
                          <span>{item.size}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Payment:</span>
                          <span>{item.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Date:</span>
                          <span>
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2"
                      onClick={() => handleTrackOrder(item)}
                    >
                      <FiTruck className="w-4 h-4" />
                      Track Order
                    </button>

                    {["Pending", "Order Placed", "Packing", "Shipped"].includes(item.status) && (
                      <button
                        className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 ${
                          cancellingOrder === item.orderId
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-rose-600 hover:bg-rose-700 text-white"
                        } transition duration-300`}
                        onClick={() => handleCancelOrder(item.orderId)}
                        disabled={cancellingOrder === item.orderId}
                      >
                        <FiX className="w-4 h-4" />
                        {cancellingOrder === item.orderId ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;