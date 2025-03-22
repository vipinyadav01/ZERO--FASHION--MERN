import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  userDetails,
  getAllUsers, // New controller function
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js"; // Import adminAuth

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin/login", adminLogin);
userRouter.get("/user", authUser, userDetails);
userRouter.get("/all", adminAuth, getAllUsers); // New route for all users

export default userRouter;