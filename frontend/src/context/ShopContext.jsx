import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";

// Create context
const ShopContext = createContext();

// Create provider component
const ShopContextProvider = ({ children }) => {
  // Configuration constants
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

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
  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

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

        setCartItems(prevCartItems => {
          let cartData = cloneCartItems(prevCartItems);

          if (cartData[itemId]) {
            if (cartData[itemId][size]) {
              cartData[itemId][size] += 1;
            } else {
              cartData[itemId][size] = 1;
            }
          } else {
            cartData[itemId] = { [size]: 1 };
          }

          localStorage.setItem("cartItems", JSON.stringify(cartData));
          return cartData;
        });

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
    [token, backendUrl, getAuthHeader]
  );

  // Add multiple sizes to cart at once
  const addMultipleSizesToCart = useCallback(
    async (itemId, sizes) => {
      try {
        if (!itemId || !sizes || sizes.length === 0) {
          toast.error("Invalid product or sizes");
          return;
        }

        setCartItems(prevCartItems => {
          let cartData = cloneCartItems(prevCartItems);

          if (!cartData[itemId]) {
            cartData[itemId] = {};
          }

          sizes.forEach(size => {
            if (cartData[itemId][size]) {
              cartData[itemId][size] += 1;
            } else {
              cartData[itemId][size] = 1;
            }
          });

          localStorage.setItem("cartItems", JSON.stringify(cartData));
          return cartData;
        });

        // Show success message
        const sizeText = sizes.length === 1 ? 'size' : 'sizes';
        toast.success(`${sizes.length} ${sizeText} added to cart`);

        // Sync with backend if authenticated
        if (token) {
          setIsLoading(true);
          try {
            // Add each size to backend
            await Promise.all(
              sizes.map(size =>
                axios.post(
                  `${backendUrl}/api/cart/add`,
                  { itemId, size },
                  { headers: getAuthHeader() }
                )
              )
            );
          } catch (error) {
            console.error("Error syncing cart with backend:", error);
            // Don't show error toast as local cart is already updated
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error adding multiple sizes to cart:", error);
        toast.error("Error adding items to cart");
        // Revert local cart on failure
        const storedCart = JSON.parse(localStorage.getItem("cartItems") || "{}");
        setCartItems(storedCart);
      }
    },
    [token, backendUrl, getAuthHeader]
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

        if (typeof itemSizes === "object") {
          for (const size in itemSizes) {
            const quantity = Number(itemSizes[size]);
            if (!isNaN(quantity) && quantity > 0) {
              totalCount += quantity;
            }
          }
        } else if (typeof itemSizes === "number") {
          const quantity = Number(itemSizes);
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

        setCartItems(prevCartItems => {
          let cartData = cloneCartItems(prevCartItems);

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

          localStorage.setItem("cartItems", JSON.stringify(cartData));
          return cartData;
        });

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
    [token, backendUrl, getAuthHeader]
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
          if (typeof itemSizes === "object") {
            for (const size in itemSizes) {
              const quantity = Number(itemSizes[size]);
              if (!isNaN(quantity) && quantity > 0 && productInfo.price) {
                totalAmount += productInfo.price * quantity;
              }
            }
          } else if (typeof itemSizes === "number") {
            const quantity = Number(itemSizes);
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
      // Don't show error toast for cart clearing as it's not critical
      // The local cart is already cleared
    }
  }, [token, backendUrl, getAuthHeader]);

  // Wishlist management functions
  const addToWishlist = useCallback(async (productId) => {
    try {
      if (!token) {
        toast.error("Please login to add items to wishlist");
        return;
      }

      if (!productId) {
        toast.error("Invalid product ID");
        return;
      }

      // Optimistically update UI
      setWishlistItems(prev => [...prev, { productId, addedAt: new Date().toISOString() }]);

      setIsLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/wishlist/add`,
        { productId },
        { headers: getAuthHeader() }
      );

      if (response?.data?.message) {
        // Refresh wishlist data to get complete product info
        try {
          const wishlistResponse = await axios.get(
            `${backendUrl}/api/wishlist`,
            { headers: getAuthHeader() }
          );
          if (wishlistResponse?.data?.wishlist) {
            setWishlistItems(wishlistResponse.data.wishlist);
          }
        } catch (wishlistError) {
          console.error("Error refreshing wishlist:", wishlistError);
        }
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      const errorMessage = error?.response?.data?.message || "Failed to add to wishlist";
      toast.error(errorMessage);
      // Revert optimistic update on error
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl, getAuthHeader]);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      if (!token) {
        toast.error("Please login to manage wishlist");
        return;
      }

      if (!productId) {
        toast.error("Invalid product ID");
        return;
      }

      // Optimistically update UI
      setWishlistItems(prev => prev.filter(item => item.productId !== productId));

      setIsLoading(true);
      const response = await axios.delete(
        `${backendUrl}/api/wishlist/remove/${productId}`,
        { headers: getAuthHeader() }
      );

      if (response?.data?.message) {
        // Refresh wishlist data to ensure consistency
        try {
          const wishlistResponse = await axios.get(
            `${backendUrl}/api/wishlist`,
            { headers: getAuthHeader() }
          );
          if (wishlistResponse?.data?.wishlist) {
            setWishlistItems(wishlistResponse.data.wishlist);
          }
        } catch (wishlistError) {
          console.error("Error refreshing wishlist:", wishlistError);
        }
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      const errorMessage = error?.response?.data?.message || "Failed to remove from wishlist";
      toast.error(errorMessage);
      // Revert optimistic update on error
      try {
        const wishlistResponse = await axios.get(
          `${backendUrl}/api/wishlist`,
          { headers: getAuthHeader() }
        );
        if (wishlistResponse?.data?.wishlist) {
          setWishlistItems(wishlistResponse.data.wishlist);
        }
      } catch (wishlistError) {
        console.error("Error refreshing wishlist:", wishlistError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl, getAuthHeader]);

  const getUserWishlist = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/wishlist`,
        { headers: getAuthHeader() }
      );

      if (response?.data?.wishlist) {
        setWishlistItems(response.data.wishlist);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl, getAuthHeader]);

  // Helper function to check if a product is in wishlist (using local data)
  const isProductInWishlist = useCallback((productId) => {
    if (!productId || !wishlistItems || wishlistItems.length === 0) {
      return false;
    }
    return wishlistItems.some(item => item.productId === productId);
  }, [wishlistItems]);

  const clearWishlist = useCallback(async () => {
    if (!token) {
      toast.error("Please login to manage wishlist");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${backendUrl}/api/wishlist/clear`,
        { headers: getAuthHeader() }
      );

      if (response?.data?.message) {
        toast.success("Wishlist cleared successfully");
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      toast.error("Failed to clear wishlist");
    } finally {
      setIsLoading(false);
    }
  }, [token, backendUrl, getAuthHeader]);

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
  }, [token, backendUrl, getAuthHeader]);

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

  // Update user data in context
  const updateUserData = useCallback((newUserData) => {
    setUser(newUserData);
    localStorage.setItem("userData", JSON.stringify(newUserData));
  }, []);



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

  useEffect(() => {
    if (token) {
      getUserCart();
      getUserWishlist();
    }
  }, [token, getUserCart, getUserWishlist]);

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
    addMultipleSizesToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    clearCart,

    // Wishlist functions
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
    isProductInWishlist,
    clearWishlist,

    // Auth functions
    login,
    logout,
    updateUserData,

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

export { ShopContext };
export default ShopContextProvider;