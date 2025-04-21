import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

// Create JWT token with user ID and role
const createToken = (id, role = "user") => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Extract token from Authorization header
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    
    return authHeader.split(' ')[1];
};

// Verify and decode JWT token
const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Find user by email and include password
        const user = await UserModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check for password hash
        if (!user.password) {
            console.error(`User ${email} has no password hash in the database`);
            return res.status(500).json({
                success: false,
                message: "User account error. Please contact support.",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        try {
            // Generate token
            const token = createToken(user._id, user.role);
            
            // Exclude sensitive information in response
            const { password: omit, ...userResponse } = user.toObject();
            
            res.status(200).json({ 
                success: true, 
                token,
                user: userResponse 
            });
        } catch (tokenError) {
            console.error("Token generation error:", tokenError);
            return res.status(500).json({
                success: false,
                message: "Error generating authentication token",
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate all fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please enter a valid email" 
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password should be at least 8 characters long",
            });
        }

        // Check if user already exists
        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: "user",
        });

        const user = await newUser.save();

        try {
            const token = createToken(user._id, user.role);
            
            // Exclude sensitive information in response
            const { password: omit, ...userResponse } = user.toObject();
            
            res.status(201).json({ 
                success: true, 
                token,
                user: userResponse 
            });
        } catch (tokenError) {
            console.error("Token generation error:", tokenError);
            return res.status(500).json({
                success: false,
                message: "Error generating authentication token",
            });
        }
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong" 
        });
    }
};

const userDetails = async (req, res) => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication token required" 
            });
        }
        
        const decoded = verifyToken(token);
        
        if (!decoded || !decoded.id) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid or expired token" 
            });
        }

        const user = await UserModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.error("User Details Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
            return res.status(500).json({ 
                success: false, 
                message: "Admin credentials not configured" 
            });
        }
        const isEmailMatch = email === process.env.ADMIN_EMAIL;
        const isPasswordMatch = password === process.env.ADMIN_PASSWORD;

        if (isEmailMatch && isPasswordMatch) {
            try {
                const token = createToken("admin", "admin");
                res.status(200).json({ success: true, token });
            } catch (tokenError) {
                console.error("Admin token generation error:", tokenError);
                return res.status(500).json({
                    success: false,
                    message: "Error generating admin token",
                });
            }
        } else {
            res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Something went wrong" 
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication token required" 
            });
        }
        
        const decoded = verifyToken(token);
        
        if (!decoded || !decoded.id) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid or expired token" 
            });
        }

        const { name, email } = req.body;

        // Validate email if provided
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email format" 
            });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            decoded.id,
            { name, email },
            { 
                new: true,
                runValidators: true  
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            user: updatedUser 
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication token required" 
            });
        }
        
        const decoded = verifyToken(token);
        
        if (!decoded || !decoded.role !== "admin") {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. Admin privileges required" 
            });
        }

        const users = await UserModel.find({}, { password: 0 });
        res.status(200).json({ 
            success: true, 
            users,
            total: users.length 
        });
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication token required" 
            });
        }
        
        const decoded = verifyToken(token);
        
        if (!decoded || decoded.role !== "admin") {
            return res.status(403).json({ 
                success: false, 
                message: "Access denied. Admin privileges required" 
            });
        }

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID required" 
            });
        }

        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            deletedUser: {
                _id: deletedUser._id,
                name: deletedUser.name,
                email: deletedUser.email
            }
        });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const token = extractToken(req);
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Authentication token required" 
            });
        }
        
        const decoded = verifyToken(token);
        
        if (!decoded || !decoded.id) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid or expired token" 
            });
        }

        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ 
                success: false, 
                message: "Order ID required" 
            });
        }

        const user = await UserModel.findById(decoded.id);
        if (!user || !user.orders) {
            return res.status(404).json({ 
                success: false, 
                message: "User or orders not found" 
            });
        }

        const order = user.orders.id(orderId);
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }

        // Check if order is already cancelled
        if (order.status === "cancelled") {
            return res.status(400).json({ 
                success: false, 
                message: "Order is already cancelled" 
            });
        }

        order.status = "cancelled";
        await user.save();

        res.status(200).json({ 
            success: true, 
            order 
        });
    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

export {
    loginUser,
    registerUser,
    adminLogin,
    userDetails,
    updateProfile,
    getAllUsers,
    deleteUser,
    cancelOrder,
};