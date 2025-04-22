import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

// Global variables
const currency = "inr";
const deliveryFee = 10;

// Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Place order using Cash on Delivery Method
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id; 

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

    // Update user's orders and clear cart
    await UserModel.findByIdAndUpdate(userId, {
      $push: { orders: newOrder._id },
      cartData: {},
    });

    res.status(200).json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error in placeOrder:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Place order using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;
    const { origin } = req.headers;

    // Validate required fields
    if (!items?.length || !amount || !address) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required order information" 
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      status: "Pending",
      date: Date.now(),
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    // Create line items for Stripe checkout
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency, 
        product_data: { 
          name: item.name,
          images: item.image ? [item.image] : [] 
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery fee as separate line item
    line_items.push({
      price_data: {
        currency: currency,
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
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString()
      }
    });

    newOrder.stripeSessionId = session.id;
    await newOrder.save();

    await UserModel.findByIdAndUpdate(userId, {
      $push: { orders: newOrder._id },
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
    const { orderId, success } = req.query;

    // Check if user token exists
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const userId = req.user._id;

    if (!orderId) {
      return res.status(400).json({ 
        success: false, 
        message: "Order ID is required" 
      });
    }

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found or unauthorized" 
      });
    }

    if (success === "true") {
      try {
        const session = await stripe.checkout.sessions.retrieve(
          order.stripeSessionId,
          {
            expand: ['payment_intent']
          }
        );

        if (session.payment_status === "paid") {
          order.payment = true;
          order.status = "Order Placed";
          order.stripePaymentIntentId = session.payment_intent.id;
          await order.save();

          await UserModel.findByIdAndUpdate(userId, { 
            cartData: {},
            $set: { 'orders.$[elem].payment': true }
          }, {
            arrayFilters: [{ 'elem._id': orderId }]
          });

          return res.status(200).json({ 
            success: true, 
            message: "Payment successful" 
          });
        } else {
          order.status = "Payment Failed";
          await order.save();
          return res.status(400).json({ 
            success: false, 
            message: "Payment incomplete" 
          });
        }
      } catch (stripeError) {
        console.error("Stripe session retrieval error:", stripeError);
        order.status = "Payment Failed";
        await order.save();
        return res.status(400).json({ 
          success: false, 
          message: "Payment verification failed" 
        });
      }
    } else {
      order.status = "Cancelled";
      await order.save();
      return res.status(200).json({ 
        success: false, 
        message: "Payment cancelled" 
      });
    }
  } catch (error) {
    console.error("Error in verifyStripe:", error);
    res.status(500).json({ 
      success: false, 
      message: "Something went wrong" 
    });
  }
};

// Place order using RazorPay Method
const placeOrderRazorPay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id;

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
    newOrder.razorpayOrderId = order.id;
    await newOrder.save();

    // Update user's orders
    await UserModel.findByIdAndUpdate(userId, {
      $push: { orders: newOrder._id },
    });

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
    const order = await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
    if (payment.status === "captured") {
      order.payment = true;
      order.paymentStatus = "paid";
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();
      await UserModel.findByIdAndUpdate(order.userId, { cartData: {} });
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
    const user = await UserModel.findById(req.user._id).populate({
      path: "orders",
      select: "-stripeSessionId -stripePaymentIntentId -razorpayOrderId -razorpayPaymentId",
    });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, orders: user.orders });
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
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or unauthorized" });
    }

    if (["Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Cannot cancel delivered or already cancelled order" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Refund Processing Functions
async function processStripeRefund(order) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
      amount: Math.round(order.amount * 100),
    });
    return refund;
  } catch (error) {
    throw new Error(`Stripe refund failed: ${error.message}`);
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
    return refund;
  } catch (error) {
    throw new Error(`RazorPay refund failed: ${error.message}`);
  }
}
const listOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .sort({ date: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in listOrders:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

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
  listOrders,
};