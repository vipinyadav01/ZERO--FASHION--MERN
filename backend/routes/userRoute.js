import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  userDetails
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();


userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin/login", adminLogin);
userRouter.get("/user", authUser, userDetails);

export default userRouter;
