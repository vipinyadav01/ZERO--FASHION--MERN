import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);

  const loadOrders = async () => {
    try {

      if (!token) {
        return null;
      }
      const response = await fetch(
        backendUrl + "/api/order/userorders",
        {
          method: "POST",
          headers: {
            token
          }
        }
      );
      const data = await response.json();
      if (data.success) {
        let allOrders = [];
        data.orders.map((order) => {
          console.log(order);
          order.items.map((item) => {
            item["status"] = order.status;
            item["date"] = order.date;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            allOrders.push(item);
          });
        })
        setOrderData(allOrders);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [token]);

  return (
    <div className="border-t pt-28">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-5 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-600">
                  <p>
                    {currency}
                    {item.price}
                  </p>
                  <p>Quality: {item.quantity}</p>
                  <p>Size : {item.size}</p>
                </div>
                <p className="mt-1 ">
                  Date: <span className="text-gray-400"> {new Date(item.date).toDateString()}</span>
                </p>
                <p className="mt-1 ">
                  Payment: <span className="text-gray-400"> {item.paymentMethod}</span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button className="border px-4 py-2 text-sm font-medium rounded-sm">
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
