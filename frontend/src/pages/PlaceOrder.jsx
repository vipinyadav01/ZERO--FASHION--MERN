import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

function PlaceOrder() {
  const [method, setMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleOrderSuccess = () => {
    toast.success("Order Placed Successfully");
    setCartItems({});
    navigate("/order");
    setIsProcessing(false);
  };

  const handleOrderError = (error) => {
    console.error("Order Error:", error);
    toast.error(error?.response?.data?.message || error?.message || "Something went wrong with your order");
    setIsProcessing(false);
  };

  const prepareOrderItems = () => {
    let orderItems = [];
    for (const itemId in cartItems) {
      for (const item in cartItems[itemId]) {
        if (cartItems[itemId][item] > 0) {
          const itemInfo = structuredClone(
            products.find((product) => product._id === itemId)
          );
          if (itemInfo) {
            itemInfo.size = item;
            itemInfo.quantity = cartItems[itemId][item];
            orderItems.push(itemInfo);
          }
        }
      }
    }
    return orderItems;
  };

  const initRazorpay = (orderData) => {
    // Validate order data
    if (!orderData?.id || !orderData?.amount) {
      toast.error("Invalid payment data received");
      setIsProcessing(false);
      return;
    }

    const amount = Number(orderData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid payment amount");
      setIsProcessing(false);
      return;
    }

    // Configure Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount,
      currency: orderData.currency || "INR",
      name: "Your Shop Name",
      description: `Order Payment - ${orderData.id}`,
      order_id: orderData.id,
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      handler: async function (response) {
        try {
          console.log("Payment Success Response:", response);
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            verificationData,
            { headers: { token } }
          );

          if (data.success) {
            handleOrderSuccess();
          } else {
            throw new Error(data.message || "Payment verification failed");
          }
        } catch (error) {
          handleOrderError(error);
        }
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          toast.info("Payment cancelled");
        },
      },
      theme: {
        color: "#000000",
      },
    };

    // Initialize Razorpay
    try {
      console.log("Initializing Razorpay with options:", options);
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        toast.error(response.error.description || "Payment failed");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay Initialization Error:", error);
      handleOrderError(new Error("Failed to initialize payment"));
    }
  };

  const handleCodOrder = async (orderData) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        orderData,
        { headers: { token } }
      );
      if (response.data.success) {
        handleOrderSuccess();
      } else {
        throw new Error(response.data.message || "Failed to place COD order");
      }
    } catch (error) {
      handleOrderError(error);
    }
  };

  const handleStripeOrder = async (orderData) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/stripe`,
        orderData,
        { headers: { token } }
      );
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      handleOrderError(error);
    }
  };

  const handleRazorpayOrder = async (orderData) => {
    try {
      console.log("Creating Razorpay order with data:", orderData);
      const response = await axios.post(
        `${backendUrl}/api/order/razorpay`,
        orderData,
        { headers: { token } }
      );

      console.log("Razorpay order response:", response.data);

      if (!response.data?.order) {
        throw new Error("Invalid order data received from server");
      }

      initRazorpay(response.data.order);
    } catch (error) {
      handleOrderError(error);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const orderItems = prepareOrderItems();

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        setIsProcessing(false);
        return;
      }

      const totalAmount = getCartAmount() + delivery_fee;
      if (totalAmount <= 0) {
        toast.error("Invalid order amount");
        setIsProcessing(false);
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: totalAmount,
      };

      switch (method) {
        case "cod":
          await handleCodOrder(orderData);
          break;
        case "stripe":
          await handleStripeOrder(orderData);
          break;
        case "razorpay":
          await handleRazorpayOrder(orderData);
          break;
        default:
          throw new Error("Invalid payment method selected");
      }
    } catch (error) {
      handleOrderError(error);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-28 sm:pt-24 min-h-[80vh] border-t"
    >
      {/* Left Side - Delivery Information */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First Name"
            disabled={isProcessing}
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last Name"
            disabled={isProcessing}
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email Address"
          disabled={isProcessing}
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
          disabled={isProcessing}
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
            disabled={isProcessing}
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
            disabled={isProcessing}
          />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
            disabled={isProcessing}
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
            disabled={isProcessing}
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
          disabled={isProcessing}
        />
      </div>

      {/* Right Side - Cart Total and Payment Method */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => !isProcessing && setMethod("stripe")}
              className={`flex items-center gap-3 border p-2 px-3 ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""
                  }`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div
              onClick={() => !isProcessing && setMethod("razorpay")}
              className={`flex items-center gap-3 border p-2 px-3 ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""
                  }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.razorpay_logo}
                alt="Razorpay"
              />
            </div>
            <div
              onClick={() => !isProcessing && setMethod("cod")}
              className={`flex items-center gap-3 border p-2 px-3 ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""
                  }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              disabled={isProcessing}
              className={`bg-black text-white px-16 py-3 text-sm ${isProcessing
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-800"
                }`}
            >
              {isProcessing ? "PROCESSING..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;