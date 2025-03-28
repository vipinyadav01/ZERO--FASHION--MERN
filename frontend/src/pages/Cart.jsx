import React, { useContext, useEffect, useState } from "react";
 import { ShopContext } from "../context/ShopContext";
 import { assets } from "../assets/assets";
 import CartTotal from "../components/CartTotal";
 function Cart() {
   const { products, currency, cartItems, navigate, updateCartItem } =
     useContext(ShopContext);
   const [cartData, setCartData] = useState([]);
 
   useEffect(() => {
     if (products.length > 0) {
       const tempData = [];
 
       for (const itemSizes in cartItems)
         for (const item in cartItems[itemSizes]) {
           if (cartItems[itemSizes][item] > 0) {
             tempData.push({
               _id: itemSizes,
               size: item,
               quantity: cartItems[itemSizes][item],
             });
           }
         }
 
       setCartData(tempData);
     }
   }, [cartItems, products]);
 
   const updateQuantity = (itemId, size, newQuantity) => {
     console.log(
       `Updating item ${itemId}, size ${size} to quantity ${newQuantity}`
     );
     updateCartItem(itemId, size, newQuantity);
   };
 
   return (
     <div className="border-t pt-14">
       <div className="text-2xl mb-3">
         <h2>YOUR CART</h2>
       </div>
       <div>
         {cartData.map((item, index) => {
           const productData = products.find(
             (product) => product._id === item._id
           );
 
           return (
             <div
               key={index}
               className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
             >
               <div className="flex items-start gap-6">
                 <img
                   className="w-16 sm:w-20"
                   src={productData?.image?.[0] || ""}
                   alt={productData?.name || "Product Image"}
                 />
                 <div>
                   <p className="text-xs sm:text-lg font-medium">
                     {productData?.name || "Unknown Product"}
                   </p>
                   <div className="flex items-center gap-5 mt-2">
                     <p>
                       {currency}
                       {productData?.price || "N/A"}
                     </p>
                     <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                       Size: {item.size}
                     </p>
                   </div>
                 </div>
               </div>
               <input
                 className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                 type="number"
                 min={1}
                 defaultValue={item.quantity}
                 onChange={(e) => {
                   const newQuantity = Number(e.target.value);
                   if (!isNaN(newQuantity) && newQuantity > 0) {
                     updateQuantity(item._id, item.size, newQuantity);
                   }
                 }}
               />
               <img
                 onClick={() => updateQuantity(item._id, item.size, 0)}
                 className="w-4 mr-4 sm:w-5 cursor-pointer"
                 src={assets?.bin_icon || ""}
                 alt="Delete Item"
               />
             </div>
           );
         })}
       </div>
       <div className="flex justify-end my-20">
         <div className="w-full sm:w-[450px]">
           <CartTotal />
           <button
             onClick={() => navigate("/place-order")}
             className="bg-black text-white text-sm my-8 px-8 py-3"
           >
             PROCEED TO CHECKOUT
           </button>
         </div>
       </div>
     </div>
   );
 }
 
 export default Cart;