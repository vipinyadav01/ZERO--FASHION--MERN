import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Helper function for deep cloning cart items
  const cloneCartItems = (items) => {
    return structuredClone
      ? structuredClone(items)
      : JSON.parse(JSON.stringify(items));
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    let cartData = cloneCartItems(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);

    toast.success("Item added to cart");
    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error("Error adding item to cart");
      }
    }
  };

  const getCartCount = () => {
    let totalcount = 0;

    for (const itemId in cartItems) {
      const itemSizes = cartItems[itemId];
      for (const size in itemSizes) {
        try {
          if (itemSizes[size] > 0) {
            totalcount += itemSizes[size];
          }
        } catch (error) {
          console.error("Error accessing item size quantity:", error);
        }
      }
    }
    return totalcount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = cloneCartItems(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error updating item quantity:", error);
        toast.error("Error updating item quantity");
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const productInfo = products.find((product) => product._id === itemId);
      const itemSizes = cartItems[itemId];

      if (productInfo) {
        for (const size in itemSizes) {
          try {
            const quantity = itemSizes[size];
            if (quantity > 0) {
              totalAmount += productInfo.price * quantity;
            }
          } catch (error) {
            console.error("Error calculating cart amount:", error);
          }
        }
      } else {
        console.warn(`Product with ID ${itemId} not found in products list.`);
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.message || "Failed to load products");
    }
  };

  const getUserCart = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
      toast.error(error.message || "Failed to load cart");
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
