import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { motion } from "framer-motion";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount() || 0;
  const shippingFee = delivery_fee || 0;
  const total = subtotal + shippingFee;

  const formatCurrency = (amount) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6"
    >
      <div className="mb-6">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
        >
          <p className="text-gray-600 font-medium">Subtotal</p>
          <p className="text-gray-800 font-semibold">{formatCurrency(subtotal)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
        >
          <p className="text-gray-600 font-medium">Shipping Fee</p>
          <p className="text-gray-800 font-semibold">{formatCurrency(shippingFee)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex justify-between items-center p-4 bg-gray-800 text-white rounded-lg"
        >
          <p className="text-lg font-bold">Total</p>
          <div className="flex flex-col items-end">
            <p className="text-lg font-bold">{formatCurrency(total)}</p>
            <p className="text-xs text-gray-300">Including Shipping Fee</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CartTotal;