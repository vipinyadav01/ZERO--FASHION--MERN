// routes/orderRoutes.js
import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorPay,
  verifyStripe,
  verifyRazorPay,
  userOrders,
  cancelOrder,
  listOrders,
  updateStatus,
  getRecentOrders,
  getPaymentConfig,
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// Payment configuration endpoint (public)
orderRouter.get("/payment-config", getPaymentConfig);

orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorPay);
orderRouter.get("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/verifyRazorPay", authUser, verifyRazorPay);
orderRouter.get("/userOrders", authUser, userOrders);
orderRouter.put("/:orderId/cancel", authUser, cancelOrder);
orderRouter.put("/status/:orderId", adminAuth, updateStatus);
orderRouter.get("/list", adminAuth, listOrders);
orderRouter.get("/recent", adminAuth, getRecentOrders);

export default orderRouter;