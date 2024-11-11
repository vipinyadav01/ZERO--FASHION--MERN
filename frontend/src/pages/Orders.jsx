import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTrackOrder = (orderId) => {
    window.open(`${backendUrl}/orders/${orderId}`, "_blank");
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${backendUrl}/api/order/cancel/${orderId}`, {
        method: "POST",
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrderData(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      } else {
        setError("Failed to cancel order. Please try again.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError("An error occurred while cancelling the order.");
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await fetch(`${backendUrl}/api/order/userorders`, {
        method: "POST",
        headers: {
          token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        const allOrders = data.orders.flatMap(order =>
          order.items.map(item => ({
            ...item,
            status: order.status,
            date: order.date,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            orderId: order._id
          }))
        );
        setOrderData(allOrders);
      } else {
        setError("Failed to fetch orders. Please try again.");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      setError("An error occurred while fetching your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    } else {
      setLoading(false);
      setOrderData([]);
    }
  }, [token, backendUrl]);

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-600">Please log in to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : orderData.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orderData.map((item, index) => (
            <div
              key={`${item.orderId}-${index}`}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-24 h-24 object-cover rounded"
                  src={item.image?.[0] || "/placeholder.svg"}
                  alt={item.name}
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>Price: {currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                    <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                    <p>Payment: {item.paymentMethod}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.status === "Delivered" ? "bg-green-500" :
                    item.status === "Cancelled" ? "bg-gray-500" :
                      "bg-yellow-500"
                    }`}></div>
                  <p className="text-sm font-medium">{item.status}</p>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                  onClick={() => handleTrackOrder(item.orderId)}
                >
                  Track Order
                </button>
                {item.status !== "Delivered" && item.status !== "Cancelled" && (
                  <button
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-red-700 transition duration-300"
                    onClick={() => handleCancelOrder(item.orderId)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;