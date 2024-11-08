import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
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

  return (
    <div >
      <h3 className="text-xl font-bold text-center">Order Page</h3>

      <div>
        {orders.map((order, index) => {
          return (
            <div
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr] gap-4 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700"
              key={index}
            >
              <img className="w-12" src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => (
                    <p className="py-0.5" key={index}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                      {index === order.items.length - 1 ? "" : ","}
                    </p>
                  ))}
                </div>
                <p className="mt-4 mb-3 font-medium">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className="text-sm sm:text-[14px]">Items: {order.items.length}</p>
                <p className="mt-3">Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? "done" : "pending"}</p>
                <p>Date: {new Date(order.date).toDateString()}</p>
              </div>
              <p className="text-sm sm:text-[18px]">₹ {order.amount}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-3 font-semibold"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;
