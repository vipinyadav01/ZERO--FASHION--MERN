import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/userModel.js";
import OrderModel from "../models/orderModel.js";
import { processStripeRefund, processRazorPayRefund } from "./orderController.js";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

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
    
    // Sanitize input types to prevent NoSQL injection
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid input format" });
    }

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
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
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

    // Sanitize input types to prevent NoSQL injection
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid input format" });
    }

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
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
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

    // Sanitize input types to prevent NoSQL injection
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid input format" });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Prefer DB-based admin authentication
    let user = await UserModel.findOne({ email }).select("+password role isAdmin name email");
    if (user) {
      if (user.role !== "admin" && !user.isAdmin) {
        return res.status(403).json({ success: false, message: "User is not an admin" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid admin credentials" });
      }
      const isAdmin = user.role === "admin" || user.isAdmin === true;
      const token = createToken(user._id, isAdmin ? "admin" : "user");
      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: isAdmin ? "admin" : "user",
          isAdmin: isAdmin,
        },
      });
    }

    // Fallback: env-based admin (legacy)
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: "Invalid admin credentials" });
      }

      // Ensure a DB admin exists for the env admin for consistency
      let adminUser = await UserModel.findOne({ email: process.env.ADMIN_EMAIL });
      if (!adminUser) {
        const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        adminUser = await UserModel.create({
          name: "Admin",
          email: process.env.ADMIN_EMAIL,
          password: hashed,
          role: "admin",
          isAdmin: true,
        });
      } else if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        adminUser.isAdmin = true;
        await adminUser.save();
      }

      const token = createToken(adminUser._id, "admin");
      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
          isAdmin: adminUser.isAdmin,
        },
      });
    }

    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get user details
const userDetails = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
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
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        cartData: user.cartData,
        createdAt: user.createdAt,
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
    const user = await UserModel.findById(req.user._id).select("-password");
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
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        cartData: user.cartData,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body; // Only accept name changes
    let profileImageUrl = "";

    // Validate input
    if (!name && !req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one field (name or profile image) is required" 
      });
    }

    if (name && name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Name must be at least 2 characters long" });
    }

    // Handle profile image upload to Cloudinary
    if (req.file) {
      try {
        
        // Check if Cloudinary is properly configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
          console.error("Cloudinary credentials missing in environment variables");
          return res.status(500).json({ 
            success: false, 
            message: "Image upload service is not configured. Please update only your name or contact support." 
          });
        }

        // Convert buffer to stream for Cloudinary
        const stream = Readable.from(req.file.buffer);
        
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "user_profiles",
              transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
                { quality: "auto", fetch_format: "auto" }
              ]
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          
          stream.pipe(uploadStream);
        });

        profileImageUrl = result.secure_url;

        // Delete old profile image if exists
        try {
          const currentUser = await UserModel.findById(req.user._id);
          if (currentUser.profileImage && currentUser.profileImage.includes('cloudinary')) {
            const publicId = currentUser.profileImage.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`user_profiles/${publicId}`);
          }
        } catch (deleteError) {
          console.warn("Could not delete old profile image:", deleteError.message);
          // Don't fail the update if we can't delete the old image
        }
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to upload profile image. Please try again or update without image." 
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name && name.trim()) updateData.name = name.trim();
    if (profileImageUrl) updateData.profileImage = profileImageUrl;

    // Ensure we have something to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid changes detected" 
      });
    }



    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id, 
      updateData, 
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }



    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully. Note: Email address cannot be changed for security reasons.",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isAdmin: updatedUser.isAdmin,
        profileImage: updatedUser.profileImage,
        createdAt: updatedUser.createdAt,
      }
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    console.error("Full error stack:", error.stack);
    
    // Provide specific error messages based on error type
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid data provided: " + error.message 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Internal server error. Please try again later." 
    });
  }
};

// Admin update user (Admin can change email for security/management purposes)
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
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").trim();

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    
    if (req.query.role && req.query.role !== "all") {
      query.role = req.query.role;
    }

    const [users, total] = await Promise.all([
      UserModel.find(query)
        .select("name email role isAdmin profileImage createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      users,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id || req.body.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const userToDelete = await UserModel.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Admin can delete any user, including other admins
    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser: {
        _id: userToDelete._id,
        name: userToDelete.name,
        email: userToDelete.email,
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
    const userId = req.user._id;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found or not authorized" });
    }

    if (["Delivered", "Cancelled"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Cannot cancel delivered or already cancelled order" });
    }

    // Restore stock
    // Assuming ProductModel is imported or available in the scope
    // for (const item of order.items) {
    //   await ProductModel.findByIdAndUpdate(item.productId, {
    //     $inc: { stock: item.quantity },
    //   });
    // }

    order.status = "Cancelled";

    // Process refund if paid
    if (order.payment) {
      try {
        if (order.paymentMethod === "Stripe" && order.stripePaymentIntentId) {
          await processStripeRefund(order);
        } else if (order.paymentMethod === "RazorPay" && order.razorpayPaymentId) {
          await processRazorPayRefund(order);
        }
      } catch (refundError) {
        console.error("Refund error:", refundError.message);
        return res.status(400).json({ success: false, message: refundError.message });
      }
    }

    await order.save();
    res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel order error:", error.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Admin reset user password (admin only)
const adminResetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
      return res.status(400).json({ success: false, message: "userId and newPassword are required" });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const user = await UserModel.findById(userId).select("_id email name");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(userId, { password: hashed });

    // Basic audit log (console). For production, persist to a collection.
    console.log(`AdminResetPassword: Admin ${req.user?._id?.toString?.() || 'unknown'} reset password for user ${userId} (${user.email}) at ${new Date().toISOString()}`);

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Admin reset password error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin create user with admin role (admin only)
const adminCreateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Sanitize input types to prevent NoSQL injection
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid input format" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = await UserModel.create({
      name,
      email,
      password: hashed,
      role: "admin",
      isAdmin: true,
    });

    console.log(`AdminCreateUser: Admin ${req.user?._id?.toString?.() || 'unknown'} created admin ${newAdmin._id} (${email}) at ${new Date().toISOString()}`);

    return res.status(201).json({
      success: true,
      user: {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        isAdmin: newAdmin.isAdmin,
      }
    });
  } catch (error) {
    console.error("Admin create user error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get recent users for notifications (Admin)
const getRecentUsers = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const users = await UserModel.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("_id name email role createdAt")
      .lean();

    res.status(200).json({ 
      success: true, 
      users 
    });
  } catch (error) {
    console.error("Error in getRecentUsers:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
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
  adminResetPassword,
  adminCreateUser,
  getRecentUsers,
};