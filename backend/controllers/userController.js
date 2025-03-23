import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

const createToken = (id, role = "user") => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id, user.role);
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password should be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: "user"
        });

        const user = await newUser.save();
        const token = createToken(user._id, user.role);
        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const userDetails = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const user = await UserModel.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("User Details Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = createToken("admin", "admin");
            res.status(200).json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId, name, email } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID required" });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, updatedUser });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID required" });
        }

        const deletedUser = await UserModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, deletedUser });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { userId, orderId } = req.body;

        if (!userId || !orderId) {
            return res.status(400).json({ success: false, message: "User ID and Order ID required" });
        }

        const user = await UserModel.findById(userId);
        if (!user || !user.orders) {
            return res.status(404).json({ success: false, message: "User or orders not found" });
        }

        const order = user.orders.id(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = "cancelled";
        await user.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Cancel Order Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
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
    cancelOrder
};