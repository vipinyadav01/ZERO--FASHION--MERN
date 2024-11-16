import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { products, currency, navigate, updateQuantity } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cart data from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      const cartItems = savedCart ? JSON.parse(savedCart) : {};

      if (products.length > 0) {
        const tempData = Object.entries(cartItems).flatMap(([itemId, sizes]) =>
          Object.entries(sizes)
            .filter(([_, quantity]) => quantity > 0)
            .map(([size, quantity]) => ({
              _id: itemId,
              size,
              quantity
            }))
        );
        setCartData(tempData);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading cart data:', err);
      setError("Failed to load cart items. Please try again.");
      setIsLoading(false);
    }
  }, [products]);

  const handleQuantityChange = (itemId, size, newQuantity) => {
    try {
      const validQuantity = Math.max(0, Math.min(99, parseInt(newQuantity) || 0));

      // Update local state
      setCartData(prev => {
        const updated = prev.map(item =>
          item._id === itemId && item.size === size
            ? { ...item, quantity: validQuantity }
            : item
        );
        return validQuantity === 0
          ? updated.filter(item => !(item._id === itemId && item.size === size))
          : updated;
      });

      // Update localStorage
      const savedCart = JSON.parse(localStorage.getItem('cartItems') || '{}');
      if (!savedCart[itemId]) savedCart[itemId] = {};

      if (validQuantity === 0) {
        delete savedCart[itemId][size];
        if (Object.keys(savedCart[itemId]).length === 0) {
          delete savedCart[itemId];
        }
      } else {
        savedCart[itemId][size] = validQuantity;
      }

      localStorage.setItem('cartItems', JSON.stringify(savedCart));
      updateQuantity(itemId, size, validQuantity);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError("Failed to update quantity. Please try again.");
    }
  };

  const handleDeleteItem = (itemId, size) => {
    handleQuantityChange(itemId, size, 0);
  };

  // Calculate cart total
  const calculateTotal = () => {
    return cartData.reduce((total, item) => {
      const product = products.find(p => p._id === item._id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const errorVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-[400px]"
      >
        <motion.div
          className="w-8 h-8 border-4 border-black border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        variants={errorVariants}
        initial="hidden"
        animate="show"
        className="bg-red-50 border-l-4 border-red-500 p-4 mt-4"
      >
        <p className="text-red-700">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-t mt-24"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-semibold">Your Cart</h2>
        <span className="text-sm text-gray-500">
          {cartData.length} {cartData.length === 1 ? 'item' : 'items'}
        </span>
      </motion.div>

      {/* Empty cart state */}
      {cartData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/Collection")}
            className="bg-black text-white text-sm px-6 py-2 hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Cart items list */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence>
              {cartData.map((item, index) => {
                const productData = products.find(
                  (product) => product._id === item._id
                );

                if (!productData) return null;

                const itemPrice = productData.price * item.quantity;

                return (
                  <motion.div
                    key={`${item._id}-${item.size}-${index}`}
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -100 }}
                    layout
                    className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-6">
                      <motion.div
                        className="relative w-16 sm:w-20 aspect-square"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={productData.image?.[0]}
                          alt={productData.name}
                          onError={(e) => {
                            e.target.src = "/api/placeholder/80/80";
                          }}
                        />
                      </motion.div>
                      <div>
                        <p className="text-xs sm:text-lg font-medium">
                          {productData.name}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 mt-2">
                          <motion.p
                            className="font-medium"
                            animate={{ opacity: 1 }}
                            key={itemPrice}
                          >
                            {currency}
                            {itemPrice.toLocaleString()}
                          </motion.p>
                          <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 text-sm">
                            Size: {item.size}
                          </p>
                        </div>
                      </div>
                    </div>
                    <input
                      className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      type="number"
                      min="1"
                      max="99"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, item.size, e.target.value)
                      }
                      aria-label={`Quantity for ${productData.name}`}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteItem(item._id, item.size)}
                      className="group p-1 hover:bg-red-50 rounded transition-colors"
                      aria-label="Remove item"
                    >
                      <img
                        className="w-4 mr-4 sm:w-5 group-hover:opacity-70 transition-opacity"
                        src={assets.bin_icon}
                        alt="Remove"
                      />
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Cart total and checkout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-end my-20"
          >
            <div className="w-full sm:w-[450px]">
              <motion.div
                className="border-t pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <motion.span
                    key={calculateTotal()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {currency}
                    {calculateTotal().toLocaleString()}
                  </motion.span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Calculated at checkout as per your location</span>
                </div>
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-lg font-semibold">Total</span>
                  <motion.span
                    key={calculateTotal()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-semibold"
                  >
                    {currency}
                    {calculateTotal().toLocaleString()}
                  </motion.span>
                </div>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/place-order")}
                className="w-full bg-black text-white text-sm my-8 px-8 py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={cartData.length === 0}
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Cart;