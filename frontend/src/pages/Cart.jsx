import  { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title"
import axios from "axios";
import { toast } from "react-toastify";

function Cart() {
  const { 
    products, 
    currency, 
    cartItems, 
    navigate, 
    updateQuantity,
    isLoading,
    token,
    backendUrl
  } = useContext(ShopContext) || {
    products: [],
    currency: "$",
    cartItems: {},
    navigate: () => {},
    updateQuantity: () => {},
    isLoading: false,
    token: null,
    backendUrl: ""
  };
  
  const [cartData, setCartData] = useState([]);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);

  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    
    if (!authToken) {
      navigate("/login");
    } else {
      // Check if user has previous orders
      fetchUserOrders(authToken);
    }
    
    if (products && products.length > 0 && cartItems) {
      const tempData = [];

      for (const itemId in cartItems) {
        if (cartItems[itemId]) {
          if (typeof cartItems[itemId] === 'object') {
            for (const size in cartItems[itemId]) {
              if (cartItems[itemId][size] > 0) {
                tempData.push({
                  _id: itemId,
                  size: size,
                  quantity: cartItems[itemId][size],
                });
              }
            }
          } else if (typeof cartItems[itemId] === 'number' && cartItems[itemId] > 0) {
            tempData.push({
              _id: itemId,
              size: "Default",
              quantity: cartItems[itemId],
            });
          }
        }
      }

      setCartData(tempData);
    }
  }, [cartItems, products, token, navigate]);

  const fetchUserOrders = async (authToken) => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/userOrders`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.data.success && response.data.orders && response.data.orders.length > 0) {
        setUserOrders(response.data.orders);
        setIsReturningCustomer(true);
      }
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  const handleQuantityUpdate = (itemId, size, newQuantity) => {
    if (!updateQuantity) return;
    updateQuantity(itemId, size, newQuantity);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      toast.info("Promo code validation coming soon!");
      setPromoCode("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-3">Loading your cart...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 mt-8">
          <Title text1="YOUR" text2="CART" />
        </div>

        {!cartData || cartData.length === 0 ? (
          <div className="bg-white rounded-lg shadow py-16 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16" className="mx-auto mb-6 text-gray-300">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <p className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</p>
            <p className="text-gray-600 mb-8">Start adding items to begin your fashion journey!</p>
            <button 
              onClick={() => navigate && navigate("/collection")} 
              className="inline-flex items-center bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <span>Continue Shopping</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Info Banner for Returning Customers */}
              {isReturningCustomer && (
                <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                  <p className="text-sm">
                    Welcome back! We noticed you have previous orders with us. Check out our latest collections and enjoy exclusive offers for returning customers!
                  </p>
                </div>
              )}

              {/* Cart Items List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {cartData.map((item, index) => {
                  const productData = products && products.find(
                    (product) => product && product._id === item._id
                  );

                  if (!productData) return null;

                  const discountPercent = Number(productData.discountPercent || 0);
                  const basePrice = Number(productData.price || 0);
                  const currentPrice = discountPercent > 0
                    ? Math.round((basePrice * (100 - discountPercent)) / 100)
                    : basePrice;

                  return (
                    <div
                      key={`${item._id}-${item.size}-${index}`}
                      className="p-4 sm:p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border"
                            src={(productData?.image && productData.image[0]) || ""}
                            alt={productData?.name || "Product"}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                              e.target.onerror = null;
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <div>
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                                  {productData?.name}
                                </h3>
                                <div className="mt-2 flex gap-2 flex-wrap">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Size: {item.size}
                                  </span>
                                  {discountPercent > 0 && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Save {discountPercent}%
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleQuantityUpdate(item._id, item.size, 0)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Remove item"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex justify-between items-end">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg sm:text-xl font-bold text-gray-900">
                                {currency}{currentPrice.toLocaleString()}
                              </span>
                              {discountPercent > 0 && (
                                <span className="text-sm text-gray-500 line-through">
                                  {currency}{basePrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center border rounded-lg bg-gray-50">
                              <button
                                onClick={() => handleQuantityUpdate(item._id, item.size, Math.max(1, item.quantity - 1))}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-200"
                              >
                                −
                              </button>
                              <input
                                className="w-10 sm:w-12 px-2 py-1 text-center font-medium bg-transparent"
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = Number(e.target.value);
                                  if (!isNaN(newQuantity) && newQuantity > 0) {
                                    handleQuantityUpdate(item._id, item.size, newQuantity);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleQuantityUpdate(item._id, item.size, item.quantity + 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-200"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Cart Totals */}
                <CartTotal />

                {/* Promo Code Section */}
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={() => setShowPromo(!showPromo)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  >
                    <span>Have a promo code?</span>
                    <svg className={`w-4 h-4 transition-transform ${showPromo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  
                  {showPromo && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate && navigate("/place-order")}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Checkout</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate && navigate("/collection")}
                    className="w-full border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;