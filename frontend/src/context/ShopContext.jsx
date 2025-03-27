import { createContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
    const currency = "₹";
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cartItems");
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    // Persist token in localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    // Filtered products based on search
    const filteredProducts = useMemo(() => {
        if (!search) return products;

        const searchTerm = search.toLowerCase().trim();
        return products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm)
        );
    }, [products, search]);

    // Fetch products data
    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message || "Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        }
    };

    // Search handler with debounce
    const handleSearch = (searchValue) => {
        setSearch(searchValue);
    };

    // Clear search
    const clearSearch = () => {
        setSearch("");
    };

    // Fetch user cart data if token exists
    const getUserCart = async () => {
        try {
            const savedCart = localStorage.getItem("cartItems");
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error("Error loading cart from local storage:", error);
            toast.error("Failed to load cart from local storage");
        }
    };

    // Load products on mount
    useEffect(() => {
        getProductsData();
    }, []);

    // Load user cart when token is present
    useEffect(() => {
        if (token) {
            getUserCart();
        }
    }, [token]);

    const addToCart = async (product, size) => {
        if (!size) {
            toast.error("Please select a size", { position: "bottom-right" });
            return;
        }

        const existingItemIndex = cartItems.findIndex(
            (item) => item.id === product.id && item.size === size
        );

        let updatedCart = [...cartItems];
        if (existingItemIndex > -1) {
            updatedCart[existingItemIndex].quantity += 1;
        } else {
            updatedCart.push({ ...product, size, quantity: 1 });
        }

        setCartItems(updatedCart);
        toast.success("Item added to cart", { position: "bottom-right" });

        if (token) {
            try {
                await axios.post(
                    `${backendUrl}/api/cart/add`,
                    { itemId: product.id, size },
                    { headers: { token } }
                );
            } catch (error) {
                console.error("Error adding item to cart:", error);
                toast.error("Error adding item to cart", { position: "bottom-right" });
            }
        }
    };

    const updateQuantity = async (productId, size, quantity) => {
        const updatedCart = cartItems
            .map((item) =>
                item.id === productId && item.size === size
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            );

        setCartItems(updatedCart);

        if (token) {
            try {
                await axios.post(
                    `${backendUrl}/api/cart/update`,
                    { itemId: productId, size, quantity },
                    { headers: { token } }
                );
            } catch (error) {
                console.error("Error updating item quantity:", error);
                toast.error("Error updating item quantity", { position: "bottom-right" });
            }
        }
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartAmount = () => {
        return cartItems.reduce((total, item) => {
            const productInfo = products.find((product) => product._id === item.id);
            return productInfo ? total + productInfo.price * item.quantity : total;
        }, 0);
    };

    const value = {
        products,
        filteredProducts,
        currency,
        delivery_fee,
        search,
        setSearch: handleSearch,
        clearSearch,
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

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ShopContextProvider;