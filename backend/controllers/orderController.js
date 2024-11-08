import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";

// global variables
const currency = "inr";
const deliveryFee = 10;

//Gateway Initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
//Placed order using CASH ON DELIVERY Method
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

    res
      .status(200)
      .json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Placed order by using StRIPE Method
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
        currency: currency,
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "deliveryFee",
        },
        unit_amount: amount * 100,
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
    console.error(error);
    res.status(500).json({ success: false, message: "payment failed" });
  }
};

//verify stripe payment
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
      return res
        .status(200)
        .json({ success: false, message: "Payment Failed" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Placed order by using RazorPay Method
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

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: false, message: "Something went wrong" });
      }
      res.status(200).json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const verifyRazorPay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    console.log(orderInfo);
    if (orderInfo.status === "paid") {
      await OrderModel.findOneAndUpdate(
        { _id: orderInfo.receipt },
        {
          payment: true,
        }
      );
      await UserModel.findByIdAndUpdate(userId, { cartData: {} });
      res.status(200).json({ success: true, message: "Payment successful" });
    } else {
      res.status(400).json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//All Orders Data for Admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// User Orders Data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await OrderModel.find({ userId });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update Order Status from Admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await OrderModel.findByIdAndUpdate(orderId, { status });

    res
      .status(200)
      .json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    console.log(error);
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
};
