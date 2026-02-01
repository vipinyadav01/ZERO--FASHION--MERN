import express from "express";
import multer from "multer";
import {
  loginUser,
  registerUser,
  adminLogin,
  userDetails,
  getAllUsers,
  updateProfile,
  adminUpdateUser,
  deleteUser,
  cancelOrder,
  getUserProfile,
  adminResetPassword,
  adminCreateUser,
  getRecentUsers,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

import rateLimit from "express-rate-limit";

const userRouter = express.Router();

// Rate limiter for login routes (IP based)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: { success: false, message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for Authenticated Users (Tracks User ID from Token)
const userActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 50, // Limit each USER to 50 sensitive actions per hour
  message: { success: false, message: "Too many requests from this account, please try again after an hour" },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Use user ID from token if available, otherwise use IP
    if (req.user && req.user._id) {
      return req.user._id.toString();
    }
    // Return IP address - rate limiter will handle IPv6 properly
    return req.ip;
  },
  skip: (req) => {
    // Skip rate limiting if in development mode
    return process.env.NODE_ENV === 'development';
  },
  handler: (req, res, next, options) => {
    // Log the event for monitoring
    const userId = req.user && req.user._id ? req.user._id : "Unknown";
    console.warn(`Rate limit exceeded for User: ${userId} (IP: ${req.ip})`);
    res.status(options.statusCode).json(options.message);
  }
});

userRouter.post("/register", loginLimiter, registerUser);
userRouter.post("/login", loginLimiter, loginUser);
userRouter.post("/admin-login", loginLimiter, adminLogin);
userRouter.get("/user", authUser, userDetails);
userRouter.get("/profile", authUser, getUserProfile);
userRouter.get("/all", adminAuth, getAllUsers);
userRouter.get("/list", adminAuth, getAllUsers);
userRouter.get("/recent", adminAuth, getRecentUsers);

const handleUpload = (req, res, next) => {
  upload.single("profileImage")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          success: false, 
          message: "File size too large. Maximum size is 5MB." 
        });
      }
      return res.status(400).json({ 
        success: false, 
        message: "File upload error: " + err.message 
      });
    } else if (err) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid file type. Only image files are allowed." 
      });
    }
    next();
  });
};

userRouter.post("/update", authUser, userActionLimiter, handleUpload, updateProfile);
userRouter.post("/admin-update", adminAuth, adminUpdateUser);
userRouter.post("/admin-reset-password", adminAuth, loginLimiter, adminResetPassword);
userRouter.post("/admin-create", adminAuth, loginLimiter, adminCreateUser);
userRouter.delete("/delete/:id", adminAuth, deleteUser);
userRouter.post("/cancel-order", authUser, userActionLimiter, cancelOrder);

export default userRouter;