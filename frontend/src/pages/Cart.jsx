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
    <div className="border-t pt-14 pb-10 min-h-[60vh]">
      <div className="text-2xl mb-6 border-b pb-3">
        <Title text1="YOUR" text2="CART" />
      </div>
      <div>
        {!cartData || cartData.length === 0 ? (
          <div className="py-12 text-center text-gray-500 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16" className="mb-4 text-gray-400">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <p className="text-lg mb-2">Your cart is empty</p>
            <p className="mb-4">Add some products to see them here.</p>
            <button 
              onClick={() => navigate && navigate("/collection")} 
              className="bg-black text-white px-8 py-2 hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {cartData.map((item, index) => {
              const productData = products && products.find(
                (product) => product && product._id === item._id
              );

              if (!productData) {
                return null; 
              }

              return (
                <div
                  key={`${item._id}-${item.size}-${index}`}
                  className="py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <img
                      className="w-16 sm:w-20 h-16 sm:h-20 object-cover"
                      src={(productData?.image && productData.image[0]) || ""}
                      alt={productData?.name || "Product Image"}
                      onError={(e) => {
                        e.target.src = (assets && assets.placeholder_image) || "";
                        e.target.onerror = null;
                      }}
                    />
                    <div>
                      <p className="text-xs sm:text-lg font-medium">
                        {productData?.name || "Unknown Product"}
                      </p>
                      <div className="flex items-center gap-5 mt-2">
                        <p className="font-semibold">
                          {currency || "$"}
                          {productData?.price || "N/A"}
                        </p>
                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 text-sm">
                          Size: {item.size}
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    className="border rounded max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 text-center"
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
                    onClick={() => handleQuantityUpdate(item._id, item.size, 0)}
                    className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-gray-200 transition-colors"
                    title="Remove item"
                  >
                    <img
                      className="w-4 sm:w-5 cursor-pointer"
                      src={(assets && assets.bin_icon) || ""}
                      alt="Delete Item"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {cartData && cartData.length > 0 && (
        <div className="flex justify-end my-10">
          <div className="w-full sm:w-[450px] border p-6 rounded shadow-sm">
            <CartTotal />
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => navigate && navigate("/place-order")}
                className="bg-black text-white text-sm px-8 py-3 w-full hover:bg-gray-800 transition-colors"
              >
                PROCEED TO CHECKOUT
              </button>
              <button
                onClick={() => navigate && navigate("/shop")}
                className="border border-black text-black text-sm px-8 py-3 w-full hover:bg-gray-100 transition-colors"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;