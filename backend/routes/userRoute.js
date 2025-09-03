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

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin-login", adminLogin);
userRouter.get("/user", authUser, userDetails);
userRouter.get("/profile", authUser, getUserProfile);
userRouter.get("/all", adminAuth, getAllUsers);
userRouter.get("/recent", adminAuth, getRecentUsers);

// Add error handling for multer
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

userRouter.post("/update", authUser, handleUpload, updateProfile);
userRouter.post("/admin-update", adminAuth, adminUpdateUser);
userRouter.post("/admin-reset-password", adminAuth, adminResetPassword);
userRouter.post("/admin-create", adminAuth, adminCreateUser);
userRouter.delete("/delete/:id", adminAuth, deleteUser);
userRouter.post("/cancel-order", authUser, cancelOrder);

export default userRouter;