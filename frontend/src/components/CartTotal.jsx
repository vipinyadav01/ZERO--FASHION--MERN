import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  const subtotal = getCartAmount() || 0;
  const shippingFee = delivery_fee || 0;

  const total = subtotal + shippingFee;

  const formatCurrency = (amount) => {
    return `${currency}${amount.toFixed(2)}`;
  };

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p className="text-gray-500">Subtotal</p>
          <p className="text-gray-500">{formatCurrency(subtotal)}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>{formatCurrency(shippingFee)}</p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>{formatCurrency(total)}</b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;