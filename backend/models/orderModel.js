import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      size: { type: String },
    },
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: {
    type: String,
    enum: [
      "Pending",
      "Order Placed",
      "Packing",
      "Shipped",
      "Out for delivered",
      "Delivered",
      "Cancelled",
      "Payment Failed",
    ],
    default: "Pending",
  },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false },
  paymentMethod: {
    type: String,
    enum: ["RazorPay", "Stripe", "CashOnDelivery"],
    required: true,
  },

  // 👇 These are optional and based on the payment method
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  stripePaymentIntentId: { type: String },
});


const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;