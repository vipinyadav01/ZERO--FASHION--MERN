import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided", code: "NO_TOKEN" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided", code: "NO_TOKEN" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Session expired. Please login again.", code: "TOKEN_EXPIRED" });
      }
      return res.status(401).json({ success: false, message: "Invalid token. Please login again.", code: "INVALID_TOKEN" });
    }

    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Malformed token", code: "INVALID_TOKEN" });
    }

    const user = await UserModel.findById(decoded.id).select("_id role isAdmin isActive isDeleted");
    if (!user || user.isDeleted) {
      return res.status(401).json({ success: false, message: "Account not found", code: "USER_NOT_FOUND" });
    }
    if (user.isActive === false) {
      return res.status(403).json({ success: false, message: "Account is deactivated", code: "ACCOUNT_DEACTIVATED" });
    }
    if (user.role !== "admin" && !user.isAdmin) {
      return res.status(403).json({ success: false, message: "Admin access required", code: "NOT_ADMIN" });
    }

    req.user = { id: user._id, _id: user._id, role: user.role || "admin" };
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(500).json({ success: false, message: "Authentication error", code: "AUTH_ERROR" });
  }
};

export default adminAuth;
