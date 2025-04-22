import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";
import OrderModel from "../models/orderModel.js";

// Create JWT token
const createToken = (id, role = "user") => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id, user.role);
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// User registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password should be at least 8 characters long" });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isAdmin: false,
    });

    const user = await newUser.save();
    const token = createToken(user._id, user.role);
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email, role: "admin" }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    }

    const token = createToken(user._id, user.role);
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user details
const userDetails = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cartData: user.cartData,
      },
    });
  } catch (error) {
    console.error("Error in userDetails:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ success: false, message: "At least one field (name or email) is required" });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
      updateData.email = email;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin update user
const adminUpdateUser = async (req, res) => {
  try {
    const { userId, name, email, role } = req.body;

    if (!userId || !name || !email || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, email, role, isAdmin: role === "admin" },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Admin update user error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const adminCount = await UserModel.countDocuments({ role: "admin" });
    const userToDelete = await UserModel.findById(userId);
    if (adminCount <= 1 && userToDelete.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot delete the last admin" });
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      deletedUser: {
        _id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const order = await OrderModel.findOne({ _id: orderId, userId: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or not authorized" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Order is already cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Cancel order error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  userDetails,
  updateProfile,
  adminUpdateUser,
  getAllUsers,
  deleteUser,
  cancelOrder,
  getUserProfile,
};