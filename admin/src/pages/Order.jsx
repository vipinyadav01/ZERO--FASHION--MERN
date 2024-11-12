import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      const response = await fetch(backendUrl + "/api/order/list", {
        method: "POST",
        headers: { token },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h3 className="text-2xl font-bold text-center mb-8">Order Management</h3>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-[0.5fr_2fr_1fr_1fr] gap-6 items-start">
                <img className="w-16 h-16 object-contain" src={assets.parcel_icon} alt="Parcel icon" />

                <div className="space-y-4">
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm">
                        {item.name} x {item.quantity} <span className="text-gray-500">({item.size})</span>
                        {idx === order.items.length - 1 ? "" : ","}
                      </p>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                    <p className="text-sm text-gray-600">{order.address.street},</p>
                    <p className="text-sm text-gray-600">
                      {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                    </p>
                    <p className="text-sm text-gray-600">{order.address.phone}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p>Items: <span className="font-medium">{order.items.length}</span></p>
                  <p>Method: <span className="font-medium">{order.paymentMethod}</span></p>
                  <p>Payment: <span className={`font-medium ${order.payment ? "text-green-600" : "text-red-600"}`}>
                    {order.payment ? "Completed" : "Pending"}
                  </span></p>
                  <p>Date: <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span></p>
                </div>

                <div className="space-y-4">
                  <p className="text-2xl font-bold">₹ {order.amount.toFixed(2)}</p>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;