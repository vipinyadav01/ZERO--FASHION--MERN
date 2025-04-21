import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";

// Create context
export const ShopContext = createContext();

// Create provider component
const ShopContextProvider = ({ children }) => {
  // Configuration constants
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Auth-related state
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shop-related state
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  // Helper function for deep cloning cart items
  const cloneCartItems = (items) => {
    if (!items) return {};
    return structuredClone
      ? structuredClone(items)
      : JSON.parse(JSON.stringify(items));
  };

  // Helper function to clean token (remove 'Bearer ' prefix if present)
  const cleanToken = (rawToken) => {
    if (!rawToken) return null;
    return rawToken.replace(/^Bearer\s+/i, '');
  };

  // Helper function to get auth header
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Cart management functions
  const addToCart = useCallback(
    async (itemId, size) => {
      try {
        if (!itemId) {
          toast.error("Invalid product");
          return;
        }

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
        localStorage.setItem("cartItems", JSON.stringify(cartData));
        toast.success("Item added to cart");

        if (token) {
          setIsLoading(true);
          await axios.post(
            `${backendUrl}/api/cart/add`,
            { itemId, size },
            { headers: getAuthHeader() }
          );
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
        toast.error(
          error?.response?.data?.message || "Error adding item to cart"
        );
        // Revert local cart on failure
        const storedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
        setCartItems(storedCart);
      } finally {
        setIsLoading(false);
      }
    },
    [cartItems, token, backendUrl]
  );

  const getCartCount = useCallback(() => {
    try {
      if (!cartItems || Object.keys(cartItems).length === 0) {
        return 0;
      }

      let totalCount = 0;
      for (const itemId in cartItems) {
        const itemSizes = cartItems[itemId];
        if (!itemSizes) continue;

        for (const size in itemSizes) {
          const quantity = Number(itemSizes[size]);
          if (!isNaN(quantity) && quantity > 0) {
            totalCount += quantity;
          }
        }
      }
      return totalCount;
    } catch (error) {
      console.error("Error calculating cart count:", error);
      return 0;
    }
  }, [cartItems]);

  const updateQuantity = useCallback(
    async (itemId, size, quantity) => {
      try {
        if (!itemId || !size || quantity === undefined || quantity < 0) {
          toast.error("Invalid update parameters");
          return;
        }

        let cartData = cloneCartItems(cartItems);

        if (!cartData[itemId]) {
          cartData[itemId] = {};
        }

        cartData[itemId][size] = quantity;
        if (quantity === 0) {
          delete cartData[itemId][size];
          if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId];
          }
        }

        setCartItems(cartData);
        localStorage.setItem("cartItems", JSON.stringify(cartData));

        if (token) {
          setIsLoading(true);
          await axios.post(
            `${backendUrl}/api/cart/update`,
            { itemId, size, quantity },
            { headers: getAuthHeader() }
          );
        }
      } catch (error) {
        console.error("Error updating item quantity:", error);
        toast.error(
          error?.response?.data?.message || "Error updating item quantity"
        );
        // Revert local cart on failure
        const storedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
        setCartItems(storedCart);
      } finally {
        setIsLoading(false);
      }
    },
    [cartItems, token, backendUrl]
  );

  const getCartAmount = useCallback(() => {
    try {
      if (
        !cartItems ||
        Object.keys(cartItems).length === 0 ||
        !products ||
        products.length === 0
      ) {
        return 0;
      }

      let totalAmount = 0;
      for (const itemId in cartItems) {
        const productInfo = products.find((product) => product?._id === itemId);
        const itemSizes = cartItems[itemId];

        if (productInfo && itemSizes) {
          for (const size in itemSizes) {
            const quantity = Number(itemSizes[size]);
            if (!isNaN(quantity) && quantity > 0 && productInfo.price) {
              totalAmount += productInfo.price * quantity;
            }
          }
        }
      }
      return totalAmount;
    } catch (error) {
      console.error("Error calculating cart amount:", error);
      return 0;
    }
  }, [cartItems, products]);

  const clearCart = useCallback(async () => {
    try {
      setCartItems({});
      localStorage.removeItem("cartItems");

      if (token) {
        await axios.post(
          `${backendUrl}/api/cart/clear`,
          {},
          { headers: getAuthHeader() }
        );
      }
    } catch (error) {
      console.error("Error clearing cart on server:", error);
      toast.error(
        error?.response?.data?.message || "Error clearing cart on server"
      );
    }
  }, [token, backendUrl]);

  // Wishlist management functions
  const toggleWishlistItem = useCallback(
    (itemId) => {
      try {
        if (!itemId) {
          toast.error("Invalid item ID");
          return;
        }

        const updatedWishlist = wishlistItems.includes(itemId)
          ? wishlistItems.filter((id) => id !== itemId)
          : [...wishlistItems, itemId];

        setWishlistItems(updatedWishlist);
        localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
      } catch (error) {
        console.error("Error toggling wishlist item:", error);
        toast.error("Failed to update wishlist");
      }
    },
    [wishlistItems]
  );

  // API Functions
  const getProductsData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response?.data?.success) {
        setProducts(response.data.products || []);
      } else {
        throw new Error(response?.data?.message || "Failed to fetch products");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Failed to load products";
      console.error("Error fetching products:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  const getUserCart = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: getAuthHeader() }
      );
      if (response?.data?.success) {
        const serverCartData = response.data.cartData || {};
        setCartItems(serverCartData);
        localStorage.setItem("cartItems", JSON.stringify(serverCartData));
      } else {
        throw new Error(response?.data?.message || "Failed to load cart");
      }
    } catch (error) {
      console.error("Error fetching user cart:", error);
      toast.error(error?.response?.data?.message || "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl]);

  // Auth functions
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${backendUrl}/api/auth/login`, credentials);
      const { token: authToken, user: userData } = response.data;
      
      // Store the raw token without "Bearer " prefix
      localStorage.setItem("token", authToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      
      setToken(authToken);
      setUser(userData);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, navigate]);

  const logout = useCallback(() => {
    try {
      setToken(null);
      setUser(null);
      setCartItems({});
      setWishlistItems([]);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("wishlistItems");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to logout properly");
    }
  }, [navigate]);

  // Load products on initial render
  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  // Initialize state from localStorage on mount
  useEffect(() => {
    const initializeState = () => {
      try {
        setIsLoading(true);
        const storedToken = localStorage.getItem("token");
        const cleanedToken = cleanToken(storedToken);
        
        if (cleanedToken) {
          setToken(cleanedToken);
          const userData = localStorage.getItem("userData");
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }

        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }

        const storedWishlist = localStorage.getItem("wishlistItems");
        if (storedWishlist) {
          setWishlistItems(JSON.parse(storedWishlist));
        }
      } catch (error) {
        console.error("Error initializing state from localStorage:", error);
        setError("Failed to initialize state");
        toast.error("Failed to initialize state");
      } finally {
        setIsLoading(false);
      }
    };

    initializeState();
  }, []);

  // Refresh cart when token changes
  useEffect(() => {
    if (token) {
      getUserCart();
    }
  }, [token, getUserCart]);

  // Combine all values and functions to be provided by context
  const contextValue = {
    // Config
    currency,
    delivery_fee,
    backendUrl,

    // Auth state
    token,
    setToken,
    user,
    setUser,

    // Shop state
    products,
    cartItems,
    wishlistItems,
    search,
    showSearch,
    isLoading,
    error,

    // State setters
    setCartItems,
    setWishlistItems,
    setSearch,
    setShowSearch,

    // Cart functions
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    clearCart,

    // Wishlist functions
    toggleWishlistItem,

    // Auth functions
    login,
    logout,

    // Navigation
    navigate,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ShopContextProvider;