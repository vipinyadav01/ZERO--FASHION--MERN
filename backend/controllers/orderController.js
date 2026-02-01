import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";


dotenv.config();

// Support multiple currencies based on configuration
const currency = process.env.STRIPE_CURRENCY || "usd";
const deliveryFee = 10;

let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("Stripe initialized successfully");
  } else {
    console.log("Stripe not configured - missing STRIPE_SECRET_KEY");
  }
} catch (error) {
  console.error("Failed to initialize Stripe:", error);
}

// Initialize Razorpay with both key_id and key_secret
let razorpayInstance;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

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
      status: "Order Placed",
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
    // Lazy initialization of Stripe if needed
    if (!stripe && process.env.STRIPE_SECRET_KEY) {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    // Check if Stripe is properly configured
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env file."
      });
    }

    const { items, address } = req.body;
    let { amount } = req.body;
    const userId = req.user._id;

    // Use deployed frontend URL as default origin, but prioritize current request origin
    let origin = req.headers.origin;
    if (!origin && req.headers.referer) {
      try {
        const refererUrl = new URL(req.headers.referer);
        origin = refererUrl.origin;
      } catch (e) {
        origin = 'https://zerofashion.vercel.app';
      }
    }
    if (!origin) origin = 'https://zerofashion.vercel.app';

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty or items format is invalid"
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is missing"
      });
    }

    // Explicitly convert amount to number to avoid type issues
    amount = Number(amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount"
      });
    }

    // Validate Item Structure
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Invalid item data: ${item.name || 'Unknown Item'} missing required fields`
        });
      }
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

    // Calculate line items with proper amount conversion
    const line_items = items.map((item) => {
      // Stripe requires absolute URLs for images. If image is local path, don't send it.
      const isValidUrl = (url) => {
        try {
          new URL(url);
          return true;
        } catch (e) {
          return false;
        }
      };

      const stripeImages = item.image && isValidUrl(item.image) ? [item.image] : [];

      return {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.name,
            images: stripeImages
          },
          unit_amount: Math.round(Number(item.price) * 100), // Ensure price is number
        },
        quantity: Number(item.quantity),
      };
    });

    // Add delivery fee if not already included in items
    const itemsTotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const deliveryFeeAmount = Math.max(0, amount - itemsTotal);
    
    if (deliveryFeeAmount > 0) {
      // Verify minimal amount for line item (Stripe requirement > 0.50 currency units usually)
      const deliveryAmountPaise = Math.round(deliveryFeeAmount * 100);
      if (deliveryAmountPaise > 0) {
        line_items.push({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: "Delivery Fee" },
            unit_amount: deliveryAmountPaise,
          },
          quantity: 1,
        });
      }
    }

    // Create Stripe checkout session
    const stripeConfig = {
      customer_email: req.user.email,
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
      metadata: {
        orderId: newOrder._id.toString(),
        userId: userId.toString()
      },
      payment_method_types: ['card'],
      billing_address_collection: 'auto'
    };

    const session = await stripe.checkout.sessions.create(stripeConfig);

    // Save session ID to order
    newOrder.stripeSessionId = session.id;
    await newOrder.save();
    
    // Update user's orders
    await UserModel.findByIdAndUpdate(userId, {
      $push: { orders: newOrder._id },
    });

    res.status(200).json({ 
      success: true, 
      session_url: session.url,
      session_id: session.id
    });
  } catch (error) {
    console.error("Error in placeOrderStripe:", error);
    
    // Attempt detailed error logging
    const errorDetails = {
      type: error.type,
      message: error.message,
      param: error.param,
      code: error.code
    };
    console.error("Stripe Error Details:", errorDetails);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        message: "Invalid payment request: " + error.message
      });
    } else if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({
        success: false,
        message: "Payment authentication failed"
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Payment initialization failed: " + error.message 
    });
  }
};

// Get payment configuration status
const getPaymentConfig = async (req, res) => {
  try {
    const config = {
      stripe: {
        configured: !!stripe && !!process.env.STRIPE_SECRET_KEY,
        currency: currency,
      },
      razorpay: {
        configured: !!razorpayInstance && !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET,
      },
      cod: {
        configured: true, // Always available
      },
    };

    res.status(200).json({ success: true, config });
  } catch (error) {
    console.error("Error checking payment config:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to check payment configuration" 
    });
  }
};

const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.query;

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

    // Validate orderId format (MongoDB ObjectId)
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }

    // Validate success parameter
    if (success !== "true" && success !== "false") {
      return res.status(400).json({
        success: false,
        message: "Invalid success parameter"
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
      // Check if order has Stripe session ID
      if (!order.stripeSessionId) {
        return res.status(400).json({
          success: false,
          message: "Order does not have a valid Stripe session ID"
        });
      }

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

          // Clear user's cart
          await UserModel.findByIdAndUpdate(userId, { cartData: {} });

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

        let errorMessage = "Payment verification failed";
        if (stripeError.code === 'resource_missing') {
          errorMessage = "Stripe session not found. Payment may have expired.";
        } else if (stripeError.type === 'StripeConnectionError') {
          errorMessage = "Unable to connect to payment service. Please try again.";
        } else if (stripeError.message) {
          errorMessage = `Stripe error: ${stripeError.message}`;
        }

        order.status = "Payment Failed";
        await order.save();
        return res.status(400).json({
          success: false,
          message: errorMessage
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
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // If it's a validation error from MongoDB
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during payment verification"
    });
  }
};

// Place order using RazorPay Method
const placeOrderRazorPay = async (req, res) => {
  try {
    // Check if Razorpay is properly configured
    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: "Payment service is not configured"
      });
    }

    const { items, amount, address } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!items?.length || !amount || !address) {
      return res.status(400).json({
        success: false,
        message: "Missing required order information"
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount"
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "RazorPay",
      payment: false,
      status: "Pending",
      date: Date.now(),
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    const options = {
      amount: Math.round(amount * 100), // Convert to paise and ensure integer
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
    
    // Handle specific Razorpay errors
    if (error.error && error.error.description) {
      return res.status(400).json({
        success: false,
        message: error.error.description
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Payment initialization failed" 
    });
  }
};

// Verify RazorPay Payment
const verifyRazorPay = async (req, res) => {
  try {
    // Check if Razorpay is properly configured
    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: "Payment service is not configured"
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification data"
      });
    }

    const order = await OrderModel.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }

    // Verify payment with Razorpay
    const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
    if (payment.status === "captured") {
      order.payment = true;
      order.status = "Order Placed";
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();
      
      // Clear user's cart
      await UserModel.findByIdAndUpdate(order.userId, { cartData: {} });
      
      res.status(200).json({ 
        success: true, 
        message: "Payment successful" 
      });
    } else {
      order.status = "Payment Failed";
      await order.save();
      
      res.status(400).json({ 
        success: false, 
        message: "Payment incomplete" 
      });
    }
  } catch (error) {
    console.error("Error in verifyRazorPay:", error);
    
    // Handle specific Razorpay errors
    if (error.error && error.error.description) {
      return res.status(400).json({
        success: false,
        message: error.error.description
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Payment verification failed" 
    });
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

    // Sort orders by date in descending order (most recent first)
    const sortedOrders = user.orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ success: true, orders: sortedOrders });
  } catch (error) {
    console.error("Error in userOrders:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update order status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    // Validate status
    const validStatuses = [
      "Pending",
      "Order Placed",
      "Packing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Payment Failed"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = status;
    await order.save();

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
    const userId = req.user._id;

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or unauthorized" });
    }

    if (["Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Cannot cancel delivered or already cancelled order" });
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

    // Restore product stock
    for (let item of order.items) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    // Process refunds for paid orders
    if (order.payment) {
      if (order.paymentMethod === "Stripe") {
        await processStripeRefund(order);
      } else if (order.paymentMethod === "RazorPay") {
        await processRazorPayRefund(order);
      }
    }

    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// List all orders with user details (Admin)
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

// Get recent orders for notifications (Admin)
const getRecentOrders = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .select("_id orderNumber userId amount status date")
      .lean();

    res.status(200).json({ 
      success: true, 
      orders: orders.map(order => ({
        ...order,
        customerName: order.userId?.name || "Unknown Customer",
        customer: order.userId
      }))
    });
  } catch (error) {
    console.error("Error in getRecentOrders:", error);
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
  getRecentOrders,
  processStripeRefund,
  processRazorPayRefund,
  getPaymentConfig,
};