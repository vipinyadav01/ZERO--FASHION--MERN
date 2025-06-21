import express from "express";
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
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin/login", adminLogin);
userRouter.get("/user", authUser, userDetails);
userRouter.get("/profile", authUser, getUserProfile);
userRouter.get("/all", adminAuth, getAllUsers);
userRouter.post("/update", authUser, updateProfile);
userRouter.post("/admin-update", adminAuth, adminUpdateUser);
userRouter.post("/delete", adminAuth, deleteUser);
userRouter.post("/cancel-order", authUser, cancelOrder);


export default userRouter;