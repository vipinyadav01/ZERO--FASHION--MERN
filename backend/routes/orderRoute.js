import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorPay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorPay,
  cancelOrder,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.get("/list", adminAuth, allOrders);
orderRouter.put("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorPay);

// User Features
orderRouter.get("/userorders", authUser, userOrders);

// Verify payment
orderRouter.get("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/verifyRazorPay", authUser, verifyRazorPay);

// Cancel order
orderRouter.put("/:orderId/cancel", authUser, cancelOrder);

export default orderRouter;