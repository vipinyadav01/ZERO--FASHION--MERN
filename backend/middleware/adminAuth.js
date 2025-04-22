import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const user = await UserModel.findById(decoded.id).select("_id role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    // Use the role confirmed from the database
    req.user = { _id: user._id, role: user.role };
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;