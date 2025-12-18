import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Be flexible with the role check in the token, but always verify with DB
    if (decoded.role !== "admin" && !decoded.isAdmin) {
      // If the token doesn't explicitly say admin, we still allow proceeding to the DB check
    }

    const user = await UserModel.findById(decoded.id).select("_id role isAdmin");
    const isAdmin = user && (user.role === "admin" || user.isAdmin === true);
    
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    req.user = { id: user._id, _id: user._id, role: user.role || "admin" };
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default adminAuth;