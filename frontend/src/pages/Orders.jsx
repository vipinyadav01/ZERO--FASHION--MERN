import { useContext, useState, useEffect, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import {
  FiPackage, FiTruck, FiCheck, FiX, FiAlertCircle,
  FiSearch, FiFilter, FiBox, FiShoppingBag, FiCalendar,
  FiCreditCard, FiArrowUp, FiArrowDown, FiChevronDown
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
    "Pending": "bg-gray-100 text-gray-800 border-gray-300",
    "Order Placed": "bg-gray-100 text-gray-800 border-gray-300",
    "Packing": "bg-gray-100 text-gray-800 border-gray-300",
    "Shipped": "bg-gray-100 text-gray-800 border-gray-300",
    "Out for delivered": "bg-gray-100 text-gray-800 border-gray-300",
    "Delivered": "bg-black text-white border-black",
    "Cancelled": "bg-white text-black border-black",
    "Payment Failed": "bg-white text-black border-black",
  };

  const statusIcons = {
    "Pending": <FiAlertCircle className="w-4 h-4" />,
    "Order Placed": <FiShoppingBag className="w-4 h-4" />,
    "Packing": <FiBox className="w-4 h-4" />,
    "Shipped": <FiPackage className="w-4 h-4" />,
    "Out for delivered": <FiTruck className="w-4 h-4" />,
    "Delivered": <FiCheck className="w-4 h-4" />,
    "Cancelled": <FiX className="w-4 h-4" />,
    "Payment Failed": <FiX className="w-4 h-4" />,
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
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center p-8 bg-white border border-black rounded-none max-w-md w-full">
          <FiAlertCircle className="w-16 h-16 text-black mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-black mb-3">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your orders.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Error notification */}
      {error && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 mb-4 p-4 border ${
          error.type === "success" ? "border-green-500 bg-white" : "border-black bg-white"
        } flex items-center justify-between max-w-md w-full`}>
          <div className="flex items-center">
            {error.type === "success" ? (
              <FiCheck className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <FiAlertCircle className="w-5 h-5 text-black mr-2" />
            )}
            <span className={error.type === "success" ? "text-green-700" : "text-black"}>
              {error.message}
            </span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-gray-500 hover:text-black"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="mb-16">
        <Title text1={"MY"} text2={"ORDERS"} />
        <div className="h-px bg-black w-20 mx-auto mt-4"></div>
      </div>

      {/* Search and filter bar */}
      <div className="mb-12 border-b border-gray-200 pb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or product name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 focus:outline-none focus:border-black focus:ring-0 transition-colors"
            />
          </div>

          {/* Sort options */}
          <div className="flex gap-3">
            <button
              onClick={() => toggleSort("date")}
              className={`px-5 py-4 flex items-center gap-2 text-sm font-medium border ${
                sortBy === "date" ? "border-black bg-black text-white" : "border-gray-300 text-gray-700 hover:border-gray-500"
              } transition-colors`}
            >
              <FiCalendar className="w-4 h-4" />
              Date
              {sortBy === "date" && (
                sortOrder === "desc" ? <FiArrowDown className="w-4 h-4 ml-1" /> : <FiArrowUp className="w-4 h-4 ml-1" />
              )}
            </button>
            <button
              onClick={() => toggleSort("price")}
              className={`px-5 py-4 flex items-center gap-2 text-sm font-medium border ${
                sortBy === "price" ? "border-black bg-black text-white" : "border-gray-300 text-gray-700 hover:border-gray-500"
              } transition-colors`}
            >
              <FiCreditCard className="w-4 h-4" />
              Price
              {sortBy === "price" && (
                sortOrder === "desc" ? <FiArrowDown className="w-4 h-4 ml-1" /> : <FiArrowUp className="w-4 h-4 ml-1" />
              )}
            </button>
          </div>

          {/* Mobile filter toggle */}
          <button
            className="md:hidden flex items-center justify-center px-5 py-4 border border-gray-300 text-gray-700 hover:border-black transition-colors"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <FiFilter className="mr-2" />
            <span>Filter</span>
            <FiChevronDown className={`ml-2 transform transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:flex flex-wrap gap-3">
          {["all", "Pending", "Order Placed", "Packing", "Shipped", "Out for delivered", "Delivered", "Cancelled", "Payment Failed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2.5 text-sm font-medium transition-all border ${
                filterStatus.toLowerCase() === status.toLowerCase()
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:border-black"
              }`}
            >
              {status === "all" ? "All Orders" : status}
            </button>
          ))}
        </div>

        {/* Mobile filters */}
        {mobileFiltersOpen && (
          <div className="md:hidden mt-4 grid grid-cols-2 gap-3">
            {["all", "Pending", "Order Placed", "Packing", "Shipped", "Out for delivered", "Delivered", "Cancelled", "Payment Failed"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setMobileFiltersOpen(false);
                }}
                className={`px-4 py-2.5 text-sm font-medium transition-all border ${
                  filterStatus.toLowerCase() === status.toLowerCase()
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {status === "all" ? "All Orders" : status}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 relative">
            <div className="w-full h-full border-2 border-gray-200 rounded-full"></div>
            <div className="w-full h-full border-t-2 border-black rounded-full absolute top-0 left-0 animate-spin"></div>
          </div>
        </div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-20 border border-gray-200">
          <FiPackage className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Orders Found</h3>
          <p className="text-gray-500 mb-8">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your filters or search term"
              : "Start shopping to create your first order!"}
          </p>
          <button
            onClick={() => navigate("/collection")}
            className="px-8 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredAndSortedOrders.map((item, index) => (
            <div
              key={`${item.orderId}-${index}`}
              className="border border-gray-200 overflow-hidden hover:border-black transition-colors duration-300"
            >
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-8">
                  {/* Order header with status */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">Order ID</span>
                      <div className="font-mono font-medium text-lg">{item.orderId.slice(-8)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-500">
                        <span className="block text-xs uppercase tracking-wider mb-1">Order Date</span>
                        <span className="font-medium">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 border ${statusColors[item.status] || "bg-gray-100 text-gray-800 border-gray-300"}`}>
                        {statusIcons[item.status] || <FiPackage className="w-4 h-4" />}
                        <span className="text-sm font-medium">{item.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product details */}
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="bg-gray-50">
                      <img
                        className="w-full sm:w-32 h-32 object-cover object-center"
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/placeholder.svg";
                        }}
                      />
                    </div>

                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-xl font-medium text-black mb-2">{item.name}</h3>
                        <p className="text-gray-500 text-sm">Size: {item.size}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Unit Price</div>
                          <div className="font-medium">
                            {currency}
                            {item.price.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Quantity</div>
                          <div className="font-medium">{item.quantity}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</div>
                          <div className="font-medium text-black">
                            {currency}
                            {item.totalPrice.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Payment Method</div>
                          <div className="font-medium">{item.paymentMethod}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                    <button
                      className="flex-1 px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                      onClick={() => handleTrackOrder(item)}
                    >
                      <FiTruck className="w-4 h-4" />
                      Track Order
                    </button>

                    {["Pending", "Order Placed", "Packing", "Shipped"].includes(item.status) && (
                      <button
                        className={`flex-1 px-6 py-3 border border-black flex items-center justify-center gap-2 ${
                          cancellingOrder === item.orderId
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                            : "bg-white text-black hover:bg-black hover:text-white"
                        } transition-colors`}
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
            </div>
          ))}
        </div>
      )}

      {/* Newsletter/CTA section */}
      <div className="mt-20 py-16 border-t border-gray-200 text-center">
        <h3 className="text-2xl font-bold mb-3">ZERO FASHION</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Premium fashion experience with minimalist design and quality materials.</p>
        <button 
          onClick={() => navigate("/collection")}
          className="px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors font-medium"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Orders;