import validator from "validator";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking if the user already exists
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Validating email format and strong password
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 8 characters long",
      });
    }

    // Hashing the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const userDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(403).json({ success: false });
    }

    const user = await UserModel.findById(userId);
    if (user) {
      return res.status(200).json({ success: true, user });
    }

    res.status(403).json({ success: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.status(200).json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Route for user profile update

const updateProfile = async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    if (!userId) {
      return res.status(403).json({ success: false });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (updatedUser) {
      return res.status(200).json({ success: true, updatedUser });
    }

    res.status(403).json({ success: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Routes for getting all users from the database
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 }); // Exclude passwords from response
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
// Route for deleting a user from the database
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(403).json({ success: false });
    }

    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (deletedUser) {
      return res.status(200).json({ success: true, deletedUser });
    }

    res.status(403).json({ success: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Routes for cancelling a user's order
const cancelOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.body;

    if (!userId || !orderId) {
      return res.status(403).json({ success: false });
    }

    const user = await UserModel.findById(userId);
    if (user) {
      const order = user.orders.id(orderId);
      if (order) {
        order.status = "cancelled";
        await user.save();
        return res.status(200).json({ success: true, order });
      }
    }

    res.status(403).json({ success: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
export { loginUser, registerUser, adminLogin, userDetails, updateProfile, getAllUsers, getUser, deleteUser, cancelOrder };

