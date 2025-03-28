import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

// Global variables
const currency = "inr";
const deliveryFee = 10;

// Payment Gateway Initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Place order using Cash on Delivery Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new OrderModel(orderData);
    await newOrder.save();
    await UserModel.findByIdAndUpdate(userId, { cartData: {} });
    res.status(200).json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Place order using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name, images: [item.image] },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Fee" },
        unit_amount: deliveryFee * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in placeOrderStripe:", error);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
};

// Verify Stripe Payment
const verifyStripe = async (req, res) => {
  try {
    const { orderId } = req.query;
    const { success } = req.query;
    const order = await OrderModel.findById(orderId);
    if (success === "true") {
      order.paymentStatus = "paid";
      order.payment = true;
      await order.save();
    } else {
      await OrderModel.findByIdAndDelete(orderId);
      return res.status(200).json({ success: false, message: "Payment Failed" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in verifyStripe:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Place order using RazorPay Method
const placeOrderRazorPay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "RazorPay",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error in placeOrderRazorPay:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Verify RazorPay Payment
const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      await OrderModel.findOneAndUpdate(
        { _id: orderInfo.receipt },
        { payment: true }
      );
      await UserModel.findByIdAndUpdate(orderInfo.userId, { cartData: {} });
      res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error in verifyRazorPay:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Fetch all orders (Admin)
const allOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Fetch user orders
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await OrderModel.find({ userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update order status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await OrderModel.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "This order cannot be cancelled" });
    }

    const orderDate = new Date(order.date);
    const currentDate = new Date();
    const hoursSinceOrder = (currentDate - orderDate) / (1000 * 60 * 60);

    if (hoursSinceOrder > 24) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled after 24 hours",
      });
    }

    order.status = "Cancelled";
    await order.save();

    for (let item of order.items) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    if (order.payment) {
      if (order.paymentMethod === "Stripe") await processStripeRefund(order);
      if (order.paymentMethod === "RazorPay") await processRazorPayRefund(order);
    }

    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Order cancellation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Refund Processing Functions
async function processStripeRefund(order) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
      amount: Math.round(order.amount * 100),
    });
    console.log("Stripe Refund:", refund);
  } catch (error) {
    console.error("Stripe Refund Error:", error);
  }
}

async function processRazorPayRefund(order) {
  try {
    const refund = await razorpayInstance.payments.refund(
      order.razorpayPaymentId,
      {
        amount: Math.round(order.amount * 100),
        speed: "optimum",
      }
    );
    console.log("RazorPay Refund:", refund);
  } catch (error) {
    console.error("RazorPay Refund Error:", error);
  }
}

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorPay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorPay,
  cancelOrder,
};
