import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title"

function Cart() {
  const { 
    products, 
    currency, 
    cartItems, 
    navigate, 
    updateQuantity,
    isLoading,
    token
  } = useContext(ShopContext) || {
    products: [],
    currency: "$",
    cartItems: {},
    navigate: () => {},
    updateQuantity: () => {},
    isLoading: false,
    token: null
  };
  
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const authToken = token || localStorage.getItem('token');
    
    if (!authToken) {
      console.log("No authentication token found");
      navigate("/login");
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

  const handleQuantityUpdate = (itemId, size, newQuantity) => {
    if (!updateQuantity) {
      console.error("updateQuantity function is not available");
      return;
    }
    
    console.log(
      `Updating item ${itemId}, size ${size} to quantity ${newQuantity}`
    );
    updateQuantity(itemId, size, newQuantity);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-3">Loading your cart...</span>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh]">
      <div className="mb-4 sm:mb-6">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* Empty state */}
      {!cartData || cartData.length === 0 ? (
        <div className="py-16 text-center text-gray-600 flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16" className="mb-4 text-gray-400">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <p className="text-lg mb-2">Your cart is empty</p>
          <p className="mb-6">Add some products to see them here.</p>
          <button 
            onClick={() => navigate && navigate("/collection")} 
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Items list */}
          <div className="lg:col-span-8">
            <div className="divide-y border rounded-md bg-white">
              {cartData.map((item, index) => {
                const productData = products && products.find(
                  (product) => product && product._id === item._id
                );

                if (!productData) {
                  return null;
                }

                const discountPercent = Number(productData.discountPercent || 0);
                const basePrice = Number(productData.price || 0);
                const currentPrice = discountPercent > 0
                  ? Math.round((basePrice * (100 - discountPercent)) / 100)
                  : basePrice;

                return (
                  <div
                    key={`${item._id}-${item.size}-${index}`}
                    className="p-3 sm:p-4 flex items-start gap-3 sm:gap-4"
                  >
                    <img
                      className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-md border"
                      src={(productData?.image && productData.image[0]) || ""}
                      alt={productData?.name || "Product Image"}
                      onError={(e) => {
                        e.target.src = (assets && assets.placeholder_image) || "/placeholder.svg";
                        e.target.onerror = null;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                            {productData?.name || "Unknown Product"}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                            <span className="px-2 py-0.5 rounded bg-gray-100 border">Size: {item.size}</span>
                            {discountPercent > 0 && (
                              <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">-{discountPercent}%</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleQuantityUpdate(item._id, item.size, 0)}
                          className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <img
                            className="w-4 sm:w-5"
                            src={(assets && assets.bin_icon) || ""}
                            alt="Delete"
                          />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base sm:text-lg font-semibold text-gray-900">
                            {currency}{currentPrice.toLocaleString()}
                          </span>
                          {discountPercent > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              {currency}{basePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            className="border rounded w-12 sm:w-16 px-2 py-1 text-center"
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
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="border rounded-md bg-white p-4 sm:p-6 lg:sticky lg:top-20">
              <CartTotal />
              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  onClick={() => navigate && navigate("/place-order")}
                  className="bg-black text-white text-sm px-6 py-3 w-full rounded-md hover:bg-gray-800 transition-colors"
                >
                  PROCEED TO CHECKOUT
                </button>
                <button
                  onClick={() => navigate && navigate("/collection")}
                  className="border border-gray-900 text-gray-900 text-sm px-6 py-3 w-full rounded-md hover:bg-gray-50 transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;