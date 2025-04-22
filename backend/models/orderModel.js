import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String },
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
    required: true,
    default: "Pending",
  },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Number, required: true },
  stripeSessionId: { type: String },
  stripePaymentIntentId: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
});

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;