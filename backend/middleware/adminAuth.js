import jwt from "jsonwebtoken";

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
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default adminAuth;