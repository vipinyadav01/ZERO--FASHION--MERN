import UserModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const user = await UserModel.findById(userId);
    let cartData = user.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await UserModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error adding product to cart" });
  }
};

// Update product in user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const user = await UserModel.findById(userId);
    let cartData = user.cartData;
    cartData[itemId][size] = quantity;
    await UserModel.findByIdAndUpdate(userId, { cartData });
    res
      .status(200)
      .json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating cart" });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(403)
        .json({ success: false, message: "User ID is required" });
    }
    const user = await UserModel.findById(userId);
    const cartData = user.cartData;
    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error getting cart data" });
  }
};

export { addToCart, updateCart, getUserCart };
