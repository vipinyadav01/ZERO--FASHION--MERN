import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";

const Cart = () => {
    const { 
        products = [], 
        currency = "₹", 
        updateQuantity, 
        navigate: navigateRoute 
    } = useContext(ShopContext);
    
    const [cartData, setCartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState({});
    const [deletingFromCart, setDeletingFromCart] = useState({});

    const navigate = (path) => {
        if (typeof window !== "undefined") {
            window.location.href = path;
        }
    };

    // Function to extract user ID from JWT token or fallback
    const getUserIdFromToken = (token) => {
        if (!token) return null;
        try {
            // Handle JWT token
            const parts = token.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                return payload.userId || payload.id || null;
            }
            // Fallback for non-JWT tokens
            return token;
        } catch (err) {
            console.error("Token parsing error:", err);
            return null;
        }
    };

    // Load cart data from local storage
    const loadCartData = () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const userId = getUserIdFromToken(token);

            if (!userId) {
                navigate("/login");
                return;
            }

            const cartKey = `cartItems_${userId}`;
            const savedCart = localStorage.getItem(cartKey);

            if (!savedCart) {
                setCartData([]);
                setIsLoading(false);
                return;
            }

            try {
                const cartItems = JSON.parse(savedCart);
                const tempData = Object.entries(cartItems).flatMap(([itemId, sizes]) =>
                    Object.entries(sizes)
                        .filter(([_, quantity]) => quantity > 0)
                        .map(([size, quantity]) => ({
                            _id: itemId,
                            size,
                            quantity: parseInt(quantity)
                        }))
                );

                setCartData(tempData);
            } catch (parseError) {
                console.error('Cart data parsing error:', parseError);
                localStorage.removeItem(cartKey);
                setCartData([]);
            }
        } catch (err) {
            console.error('Cart loading error:', err);
            setError("Unable to load cart. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load and product change effect
    useEffect(() => {
        loadCartData();
    }, [products]);

    // Handle quantity change
    const handleQuantityChange = async (itemId, size, newQuantity) => {
        const token = localStorage.getItem('token');
        const userId = getUserIdFromToken(token);
        if (!userId) {
            setError("User authentication failed. Please log in again.");
            navigate("/login");
            return;
        }

        try {
            const validQuantity = Math.max(0, Math.min(99, parseInt(newQuantity) || 0));
            const itemKey = `${itemId}-${size}`;
            setAddingToCart(prev => ({ ...prev, [itemKey]: true }));

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setCartData(prev => {
                const updated = prev.map(item =>
                    item._id === itemId && item.size === size
                        ? { ...item, quantity: validQuantity }
                        : item
                ).filter(item => item.quantity > 0);

                return updated;
            });

            // Update localStorage
            const cartKey = `cartItems_${userId}`;
            const savedCart = JSON.parse(localStorage.getItem(cartKey) || '{}');
            if (validQuantity > 0) {
                savedCart[itemId] = {
                    ...savedCart[itemId],
                    [size]: validQuantity
                };
            } else {
                if (savedCart[itemId]) {
                    delete savedCart[itemId][size];
                    if (Object.keys(savedCart[itemId]).length === 0) {
                        delete savedCart[itemId];
                    }
                }
            }

            localStorage.setItem(cartKey, JSON.stringify(savedCart));
            if (typeof updateQuantity === 'function') {
                updateQuantity(itemId, size, validQuantity);
            }
        } catch (err) {
            console.error('Quantity update error:', err);
            setError("Failed to update quantity. Please try again.");
        } finally {
            setAddingToCart(prev => ({ ...prev, [`${itemId}-${size}`]: false }));
        }
    };

    // Handle item deletion
    const handleDeleteItem = async (itemId, size) => {
        const itemKey = `${itemId}-${size}`;
        try {
            setDeletingFromCart(prev => ({ ...prev, [itemKey]: true }));
            await handleQuantityChange(itemId, size, 0);
        } catch (err) {
            console.error('Item deletion error:', err);
            setError("Failed to delete item. Please try again.");
        } finally {
            setDeletingFromCart(prev => ({ ...prev, [itemKey]: false }));
        }
    };

    // Calculate total cart value
    const calculateTotal = () => {
        return cartData.reduce((total, item) => {
            const product = products.find(p => p?._id === item._id);
            const price = product?.price || 0;
            const quantity = parseInt(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    };

    // Retry cart loading
    const handleRetry = () => {
        setError(null);
        loadCartData();
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="animate-pulse border-t mt-24">
                {/* Loading skeleton UI */}
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 w-32 bg-white/20 rounded"></div>
                    <div className="h-4 w-20 bg-white/20 rounded"></div>
                </div>
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="py-4 border-t border-b border-white/20 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 mb-4"
                    >
                        <div className="flex items-start gap-6">
                            <div className="w-16 sm:w-20 aspect-square bg-white/20 rounded"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-40 bg-white/20 rounded"></div>
                                <div className="h-4 w-24 bg-white/20 rounded"></div>
                                <div className="h-4 w-32 bg-white/20 rounded"></div>
                            </div>
                        </div>
                        <div className="h-8 w-20 bg-white/20 rounded"></div>
                        <div className="h-8 w-8 bg-white/20 rounded"></div>
                    </div>
                ))}
                <div className="flex justify-end my-20">
                    <div className="w-full sm:w-[450px] space-y-4">
                        <div className="h-4 w-full bg-white/20 rounded"></div>
                        <div className="h-4 w-full bg-white/20 rounded"></div>
                        <div className="h-8 w-full bg-white/20 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-24">
                <p className="text-red-700">{error}</p>
                <div className="flex space-x-4 mt-2">
                    <button
                        onClick={handleRetry}
                        className="text-red-600 hover:text-red-800 underline"
                    >
                        Retry Loading
                    </button>
                    <button
                        onClick={() => navigate("/collection")}
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    // Main cart render
    return (
        <div className="border-t border-white/20 mt-24 text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Your Cart</h2>
                <span className="text-sm text-black/70">
                    {cartData.length} {cartData.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {cartData.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-black/70 mb-4">Your cart is empty</p>
                    <button
                        onClick={() => navigate("/collection")}
                        className="bg-blue-500 text-white text-sm px-6 py-2 hover:bg-blue-600 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {cartData.map((item) => {
                            const productData = products.find(p => p?._id === item._id);
                            if (!productData) return null;

                            const itemPrice = (productData.price || 0) * (parseInt(item.quantity) || 0);
                            const itemKey = `${item._id}-${item.size}`;

                            return (
                                <motion.div
                                    key={itemKey}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="py-4 border-t border-b border-white/20 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="relative w-16 sm:w-20 aspect-square">
                                            <img
                                                className="w-full h-full object-cover rounded"
                                                src={productData.image?.[0] || "/api/placeholder/80/80"}
                                                alt={productData.name || "Product"}
                                                onError={(e) => (e.target.src = "/api/placeholder/80/80")}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-lg font-medium">
                                                {productData.name || "Product Name Unavailable"}
                                            </p>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 mt-2">
                                                <p className="font-medium">
                                                    {currency}
                                                    {itemPrice.toLocaleString()}
                                                </p>
                                                <p className="px-2 sm:px-3 sm:py-1 border border-white/20 bg-black/50 text-sm">
                                                    Size: {item.size}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <input
                                            className="border border-white/20 max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                                            aria-label={`Quantity for ${productData.name || "Product"}`}
                                        />
                                        {addingToCart[itemKey] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                                <Loader className="w-4 h-4 animate-spin text-blue-500" />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleDeleteItem(item._id, item.size)}
                                        className="group p-1 hover:bg-red-500/20 rounded transition-colors"
                                        aria-label="Remove item"
                                        disabled={deletingFromCart[itemKey]}
                                    >
                                        {deletingFromCart[itemKey] ? (
                                            <Loader className="w-4 h-4 text-red-500 animate-spin" />
                                        ) : (
                                            <svg
                                                className="w-4 h-4 text-white group-hover:text-red-500"
                                                fill="none"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <div className="flex justify-end my-20">
                        <div className="w-full sm:w-[450px]">
                            <div className="border-t border-white/20 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white/70">Subtotal</span>
                                    <span className="font-medium">
                                        {currency}
                                        {calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-white/70">Shipping</span>
                                    <span className="font-medium text-right">
                                        Calculated at checkout
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t border-white/20 pt-4">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-lg font-semibold">
                                        {currency}
                                        {calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/place-order")}
                                className="w-full bg-blue-500 text-white text-sm my-8 px-8 py-3 hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                                disabled={cartData.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default Cart;