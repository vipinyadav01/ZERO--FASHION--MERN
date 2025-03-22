import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Get Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized: No valid token provided. Please log in again.",
      });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized: Token missing. Please log in again.",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded token matches the admin credentials
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized: Admin access required.",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export default adminAuth;