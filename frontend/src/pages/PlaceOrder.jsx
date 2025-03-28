import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

function PlaceOrder() {
  const [method, setMethod] = useState("cod");
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

  // Add script loading for Razorpay
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initpay = (order) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Payment for order",
      order_id: order.id,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorPay`,
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/orders");
            setCartItems([]);
            toast.success("Payment successful");
          }
        } catch (error) {
          console.error(error);
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        email: formData.email,
        contact: formData.phone
      },
      notes: {
        address: `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}`
      },
      theme: {
        color: "#3399cc"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.street || !formData.city || !formData.state || 
        !formData.country || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Ensure cartItems is an array
      const cartItemsArray = Array.isArray(cartItems) ? cartItems : 
        (typeof cartItems === 'object' ? Object.values(cartItems) : []);

      if (cartItemsArray.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      let orderItems = [];

      cartItemsArray.forEach((item) => {
        const itemInfo = products.find((product) => product._id === item.id);
        if (itemInfo) {
          orderItems.push({
            ...itemInfo,
            size: item.size,
            quantity: item.quantity,
          });
        }
      });

      // Validate cart
      if (orderItems.length === 0) {
        toast.error("No valid items in cart");
        return;
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method
      };

      switch (method) {
        case "cod":
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { token } }
          );
          if (response.status === 200) {
            toast.success("Order placed successfully");
            setCartItems([]);
            navigate("/orders");
          } else {
            toast.error("Order placement failed");
          }
          break;

        case "stripe":
          const stripeResponse = await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            { headers: { token } }
          );
          if (stripeResponse.status === 200) {
            toast.success("Order placed successfully");
            setCartItems([]);
            navigate("/orders");
          } else {
            toast.error("Order placement failed");
          }
          break;

        case "razorpay":
          const razorpayResponse = await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            { headers: { token } }
          );
          if (razorpayResponse.status === 200) {
            initpay(razorpayResponse.data.order);
          } else {
            toast.error("Order placement failed");
          }
          break;

        default:
          toast.error("Invalid payment method");
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-6 pt-28 sm:pt-24 min-h-[80vh] border-t"
    >
      {/* --------------------Left Side------------- */}
      <div className="flex flex-col gap-6 w-full sm:max-w-lg">
        <Title text1="DELIVERY" text2="INFORMATION" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="input-field"
            type="text"
            placeholder="First Name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="input-field"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="input-field"
          type="email"
          placeholder="Email Address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="input-field"
          type="text"
          placeholder="Street Address"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="input-field"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="input-field"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="input-field"
            type="number"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="input-field"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="input-field"
          type="tel"
          placeholder="Phone Number"
        />
      </div>

      {/* --------------------Right Side------------------- */}
      <div className="mt-8 sm:mt-0">
        <div className="mb-8">
          <CartTotal />
        </div>
        <div>
          <Title text1="PAYMENT" text2="METHOD" />
          {/* --------------- PAYMENT Method Selection----------- */}
          <div className="flex flex-col gap-4 mt-4">
            <div
              onClick={() => setMethod("stripe")}
              className="payment-option"
            >
              <p
                className={`selection-dot ${method === "stripe" ? "bg-green-500" : ""}`}
              ></p>
              <img className="h-6 mx-4" src={assets.stripe_logo} alt="Stripe Logo" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="payment-option"
            >
              <p
                className={`selection-dot ${method === "razorpay" ? "bg-green-500" : ""}`}
              ></p>
              <img className="h-6 mx-4" src={assets.razorpay_logo} alt="Razorpay Logo" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="payment-option"
            >
              <p
                className={`selection-dot ${method === "cod" ? "bg-green-500" : ""}`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="place-order-button"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;