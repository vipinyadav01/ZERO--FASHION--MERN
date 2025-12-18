import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select("_id role email name");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = { id: user._id, _id: user._id, role: user.role, email: user.email, name: user.name };
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;