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

    // Validate user existence (skip for adminLogin token with id: "admin")
    if (decoded.id !== "admin") {
      const user = await UserModel.findById(decoded.id).select("_id role");
      if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }
      req.user = { id: user._id, role: user.role };
    } else {
      req.user = decoded; // For adminLogin token
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;