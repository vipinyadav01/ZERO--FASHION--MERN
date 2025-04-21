import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Extract and verify token from Authorization header
const extractUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

// Add item to user's cart
const addToCart = async (req, res) => {
  try {
    // Get user ID from token instead of request body
    const userId = extractUserFromToken(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    const { itemId, size } = req.body;
    
    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Item ID and size are required"
      });
    }
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    let cartData = user.cartData || {};

    // Check if item exists in cart
    if (cartData[itemId]) {
      // Check if size exists for this item
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      // Create new item entry
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await UserModel.findByIdAndUpdate(userId, { cartData });
    
    res.status(200).json({ 
      success: true, 
      message: "Product added to cart" 
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error adding product to cart" 
    });
  }
};

// Update product quantity in user cart
const updateCart = async (req, res) => {
  try {
    // Get user ID from token instead of request body
    const userId = extractUserFromToken(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    const { itemId, size, quantity } = req.body;
    
    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Item ID, size, and quantity are required"
      });
    }
    
    // Validate quantity
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative number"
      });
    }
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    let cartData = user.cartData || {};
    
    // Check if item and size exist
    if (!cartData[itemId] || cartData[itemId][size] === undefined) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }
    
    if (quantity === 0) {
      // Remove size if quantity is 0
      delete cartData[itemId][size];
      
      // Remove item if no sizes left
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      // Update quantity
      cartData[itemId][size] = quantity;
    }
    
    await UserModel.findByIdAndUpdate(userId, { cartData });
    
    res.status(200).json({ 
      success: true, 
      message: "Cart updated successfully" 
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating cart" 
    });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
    // Get user ID from token instead of request body
    const userId = extractUserFromToken(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    const cartData = user.cartData || {};
    
    res.status(200).json({ 
      success: true, 
      cartData 
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error getting cart data" 
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    // Get user ID from token instead of request body
    const userId = extractUserFromToken(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    const { itemId, size } = req.body;
    
    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Item ID and size are required"
      });
    }
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    let cartData = user.cartData || {};
    
    // Check if item and size exist
    if (!cartData[itemId] || cartData[itemId][size] === undefined) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }
    
    // Remove size
    delete cartData[itemId][size];
    
    // Remove item if no sizes left
    if (Object.keys(cartData[itemId]).length === 0) {
      delete cartData[itemId];
    }
    
    await UserModel.findByIdAndUpdate(userId, { cartData });
    
    res.status(200).json({
      success: true,
      message: "Item removed from cart"
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing item from cart"
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = extractUserFromToken(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }
    
    await UserModel.findByIdAndUpdate(userId, { cartData: {} });
    
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing cart"
    });
  }
};
export { 
  addToCart, 
  updateCart, 
  getUserCart,
  removeFromCart,
  clearCart 
};