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
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorPay);
orderRouter.get("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/verifyRazorPay", authUser, verifyRazorPay);
orderRouter.get("/userorders", authUser, userOrders);
orderRouter.put("/:orderId/cancel", authUser, cancelOrder);
orderRouter.get("/list", adminAuth, listOrders);

export default orderRouter;