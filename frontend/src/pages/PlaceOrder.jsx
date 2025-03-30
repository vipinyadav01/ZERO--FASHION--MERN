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
  const [validatedCartItems, setValidatedCartItems] = useState([]);
  const [isValidating, setIsValidating] = useState(true);
  const [cartError, setCartError] = useState(null);

  // Load user data from localStorage on component mount if available
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setFormData(prevData => ({
          ...prevData,
          firstName: parsedData.firstName || prevData.firstName,
          lastName: parsedData.lastName || prevData.lastName,
          email: parsedData.email || prevData.email,
          phone: parsedData.phone || prevData.phone,
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

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

  // Validate cart items on component mount
  useEffect(() => {
    validateCartItems();
  }, [cartItems, products]);

  // Get token from context or localStorage as fallback
  const getAuthToken = () => {
    // First try to get token from context
    if (token) {
      return token;
    }
    
    // If not in context, try localStorage
    const localToken = localStorage.getItem('token');
    if (localToken) {
      return localToken;
    }
    
    return null;
  };

  // Function to validate cart items
  const validateCartItems = () => {
    setIsValidating(true);
    setCartError(null);
    
    // Check for authentication
    const authToken = getAuthToken();
    if (!authToken) {
      setCartError("You need to be logged in to place an order");
      setIsValidating(false);
      return;
    }
    
    // Early return if products aren't loaded yet
    if (!products || products.length === 0) {
      setIsValidating(false);
      return;
    }
    
    try {
      const validItems = [];
      
      // Check if cartItems is the nested object structure from your Cart component
      if (typeof cartItems === 'object' && !Array.isArray(cartItems)) {
        for (const itemId in cartItems) {
          if (cartItems[itemId]) {
            // Find product data
            const productData = products.find(product => product && product._id === itemId);
            
            if (!productData) {
              setCartError("Some products in your cart are no longer available");
              setIsValidating(false);
              return;
            }
            
            // Process each size for this item
            for (const size in cartItems[itemId]) {
              const quantity = cartItems[itemId][size];
              
              if (quantity > 0) {
                // Check if size is valid (assuming product has sizes array)
                if (productData.sizes && !productData.sizes.includes(size)) {
                  setCartError(`Size ${size} for ${productData.name} is not available`);
                  setIsValidating(false);
                  return;
                }
                
                validItems.push({
                  id: itemId,
                  _id: itemId, // Adding both formats for compatibility
                  size,
                  quantity,
                  name: productData.name,
                  price: productData.price,
                  image: productData.image
                });
              }
            }
          }
        }
      } else if (Array.isArray(cartItems)) {
        // Handle if cartItems is already an array
        cartItems.forEach(item => {
          const productData = products.find(product => product && product._id === item.id);
          
          if (!productData) {
            setCartError("Some products in your cart are no longer available");
            setIsValidating(false);
            return;
          }
          
          validItems.push({
            ...item,
            name: productData.name,
            price: productData.price,
            image: productData.image
          });
        });
      }
      
      if (validItems.length === 0) {
        setCartError("Your cart is empty");
      }
      
      setValidatedCartItems(validItems);
    } catch (error) {
      console.error("Error validating cart:", error);
      setCartError("There was an error processing your cart");
    }
    
    setIsValidating(false);
  };

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
          const authToken = getAuthToken();
          if (!authToken) {
            toast.error("You need to be logged in to complete this payment");
            navigate("/login");
            return;
          }
          
          const { data } = await axios.post(
            `${backendUrl}/api/order/verifyRazorPay`,
            response,
            { headers: { token: authToken } }
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
        color: "#000000"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Get auth token with fallback to localStorage
    const authToken = getAuthToken();
    
    // Check if user is authenticated
    if (!authToken) {
      toast.error("You need to be logged in to place an order");
      navigate("/login");
      return;
    }
    
    // Validate form data
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.street || !formData.city || !formData.state || 
        !formData.country || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if cart has been validated
    if (isValidating) {
      toast.info("Please wait while we validate your cart");
      return;
    }

    // Check if cart has errors
    if (cartError) {
      toast.error(cartError);
      return;
    }

    // Check if cart is empty
    if (validatedCartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      let orderData = {
        address: formData,
        items: validatedCartItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method
      };

      console.log("Placing order with token:", authToken);

      switch (method) {
        case "cod":
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { token: authToken } }
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
            { headers: { token: authToken } }
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
            { headers: { token: authToken } }
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
      console.error("Error placing order:", error);
      
      // Check if the error is due to authentication
      if (error.response && error.response.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  // Show loading state while validating cart
  if (isValidating) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mr-3"></div>
        <p>Validating your cart...</p>
      </div>
    );
  }

  // Show error if cart has errors
  if (cartError) {
    return (
      <div className="pt-28 sm:pt-24 min-h-[80vh] border-t">
        <div className="bg-red-50 p-6 rounded border border-red-200 mb-6 max-w-lg mx-auto">
          <h2 className="text-xl font-medium mb-4">Cart Error</h2>
          <p className="text-red-600 mb-4">{cartError}</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
            >
              Return to Cart
            </button>
            {cartError.includes("logged in") && (
              <button
                onClick={() => navigate("/login")}
                className="bg-gray-800 text-white px-6 py-2 hover:bg-black transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show order items preview
  const OrderItemsPreview = () => (
    <div className="mb-6 mt-4">
      <h3 className="text-lg font-medium mb-3 pb-2 border-b">Order Items ({validatedCartItems.length})</h3>
      <div className="max-h-60 overflow-y-auto pr-2">
        {validatedCartItems.map((item, index) => (
          <div key={`${item._id}-${item.size}-${index}`} className="flex items-center gap-3 py-2 border-b">
            <img 
              src={item.image?.[0] || assets?.placeholder_image} 
              alt={item.name} 
              className="w-12 h-12 object-cover"
              onError={(e) => {
                e.target.src = assets?.placeholder_image || "";
                e.target.onerror = null;
              }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Size: {item.size}</span>
                <span>Qty: {item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-8 pt-28 sm:pt-24 min-h-[80vh] border-t pb-12"
    >
      {/* --------------------Left Side------------- */}
      <div className="flex flex-col gap-6 w-full sm:max-w-lg">
        <Title text1="DELIVERY" text2="INFORMATION" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="firstName" className="text-xs text-gray-600">First Name *</label>
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              id="firstName"
              value={formData.firstName}
              className="input-field"
              type="text"
              placeholder="First Name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="lastName" className="text-xs text-gray-600">Last Name *</label>
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              id="lastName"
              value={formData.lastName}
              className="input-field"
              type="text"
              placeholder="Last Name"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-xs text-gray-600">Email Address *</label>
          <input
            required
            onChange={onChangeHandler}
            name="email"
            id="email"
            value={formData.email}
            className="input-field"
            type="email"
            placeholder="Email Address"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="street" className="text-xs text-gray-600">Street Address *</label>
          <input
            required
            onChange={onChangeHandler}
            name="street"
            id="street"
            value={formData.street}
            className="input-field"
            type="text"
            placeholder="Street Address"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="city" className="text-xs text-gray-600">City *</label>
            <input
              required
              onChange={onChangeHandler}
              name="city"
              id="city"
              value={formData.city}
              className="input-field"
              type="text"
              placeholder="City"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="state" className="text-xs text-gray-600">State *</label>
            <input
              required
              onChange={onChangeHandler}
              name="state"
              id="state"
              value={formData.state}
              className="input-field"
              type="text"
              placeholder="State"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="zipcode" className="text-xs text-gray-600">Zipcode</label>
            <input
              onChange={onChangeHandler}
              name="zipcode"
              id="zipcode"
              value={formData.zipcode}
              className="input-field"
              type="number"
              placeholder="Zipcode"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="text-xs text-gray-600">Country *</label>
            <input
              required
              onChange={onChangeHandler}
              name="country"
              id="country"
              value={formData.country}
              className="input-field"
              type="text"
              placeholder="Country"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-xs text-gray-600">Phone Number *</label>
          <input
            required
            onChange={onChangeHandler}
            name="phone"
            id="phone"
            value={formData.phone}
            className="input-field"
            type="tel"
            placeholder="Phone Number"
          />
        </div>
      </div>

      {/* --------------------Right Side------------------- */}
      <div className="mt-8 sm:mt-0 w-full sm:max-w-md">
        <div className="bg-gray-50 border rounded-lg p-6 sticky top-24">
          <div className="mb-8">
            <Title text1="ORDER" text2="SUMMARY" />
            <OrderItemsPreview />
            <CartTotal />
          </div>
          <div>
            <Title text1="PAYMENT" text2="METHOD" />
            {/* --------------- PAYMENT Method Selection----------- */}
            <div className="flex flex-col gap-4 mt-4">
              <div
                onClick={() => setMethod("stripe")}
                className="payment-option bg-white p-3 border rounded-md flex items-center cursor-pointer transition-all hover:border-black"
              >
                <div 
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${method === "stripe" ? "border-2 border-green-500" : "border-gray-300"}`}
                >
                  {method === "stripe" && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                </div>
                <img className="h-6 mx-4" src={assets.stripe_logo} alt="Stripe Logo" />
              </div>
              <div
                onClick={() => setMethod("razorpay")}
                className="payment-option bg-white p-3 border rounded-md flex items-center cursor-pointer transition-all hover:border-black"
              >
                <div 
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${method === "razorpay" ? "border-2 border-green-500" : "border-gray-300"}`}
                >
                  {method === "razorpay" && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                </div>
                <img className="h-6 mx-4" src={assets.razorpay_logo} alt="Razorpay Logo" />
              </div>
              <div
                onClick={() => setMethod("cod")}
                className="payment-option bg-white p-3 border rounded-md flex items-center cursor-pointer transition-all hover:border-black"
              >
                <div 
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${method === "cod" ? "border-2 border-green-500" : "border-gray-300"}`}
                >
                  {method === "cod" && <div className="w-3 h-3 rounded-full bg-green-500"></div>}
                </div>
                <p className="text-gray-700 font-medium mx-4">
                  CASH ON DELIVERY
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-3 mt-8">
              <button
                type="submit"
                className="bg-black text-white text-sm px-8 py-4 w-full hover:bg-gray-800 transition-colors rounded flex items-center justify-center"
              >
                PLACE ORDER
              </button>
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="border border-black text-black text-sm px-8 py-3 w-full hover:bg-gray-100 transition-colors rounded"
              >
                RETURN TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;