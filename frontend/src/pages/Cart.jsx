import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";

const Cart = () => {
    const { products = [], currency = "$", updateQuantity } = useContext(ShopContext);
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login");
            return;
        }
        loadCartData();
    }, [products]);

    const loadCartData = () => {
        try {
            if (!Array.isArray(products)) {
                throw new Error("Products data is not in the correct format");
            }

            const savedCart = localStorage.getItem('cartItems');
            const cartItems = savedCart ? JSON.parse(savedCart) : {};

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
            setIsLoading(false);
        } catch (err) {
            console.error('Error loading cart data:', err);
            setError("Failed to load cart items. Please try again.");
            setIsLoading(false);
        }
    };

    const handleQuantityChange = async (itemId, size, newQuantity) => {
        try {
            const validQuantity = Math.max(0, Math.min(99, parseInt(newQuantity) || 0));

            if (isNaN(validQuantity)) {
                throw new Error("Invalid quantity value");
            }

            setAddingToCart(prev => ({ ...prev, [`${itemId}-${size}`]: true }));

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setCartData(prev => {
                const updated = prev.map(item =>
                    item._id === itemId && item.size === size
                        ? { ...item, quantity: validQuantity }
                        : item
                ).filter(item => item.quantity > 0);

                return updated;
            });

            // Update localStorage
            const savedCart = JSON.parse(localStorage.getItem('cartItems') || '{}');
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

            localStorage.setItem('cartItems', JSON.stringify(savedCart));
            if (typeof updateQuantity === 'function') {
                updateQuantity(itemId, size, validQuantity);
            }
        } catch (err) {
            console.error('Error updating quantity:', err);
            setError("Failed to update quantity. Please try again.");
        } finally {
            setAddingToCart(prev => ({ ...prev, [`${itemId}-${size}`]: false }));
        }
    };

    const handleDeleteItem = async (itemId, size) => {
        try {
            setDeletingFromCart(prev => ({ ...prev, [`${itemId}-${size}`]: true }));
            await handleQuantityChange(itemId, size, 0);
        } catch (err) {
            console.error('Error deleting item:', err);
            setError("Failed to delete item. Please try again.");
        } finally {
            setDeletingFromCart(prev => ({ ...prev, [`${itemId}-${size}`]: false }));
        }
    };

    const calculateTotal = () => {
        return cartData.reduce((total, item) => {
            const product = products.find(p => p?._id === item._id);
            const price = product?.price || 0;
            const quantity = parseInt(item.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
                <p className="text-red-700">{error}</p>
                <button
                    onClick={loadCartData}
                    className="mt-2 text-red-600 hover:text-red-800 underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="border-t mt-24">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Your Cart</h2>
                <span className="text-sm text-gray-500">
                    {cartData.length} {cartData.length === 1 ? 'item' : 'items'}
                </span>
            </div>

            {cartData.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <button
                        onClick={() => navigate("/Collection")}
                        className="bg-black text-white text-sm px-6 py-2 hover:bg-gray-800 transition-colors"
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

                            if (!productData) {
                                return null;
                            }

                            const itemPrice = (productData.price || 0) * (parseInt(item.quantity) || 0);
                            const itemKey = `${item._id}-${item.size}`;

                            return (
                                <motion.div
                                    key={itemKey}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="relative w-16 sm:w-20 aspect-square">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={productData.image?.[0] || "/api/placeholder/80/80"}
                                                alt={productData.name || "Product"}
                                                onError={(e) => {
                                                    e.target.src = "/api/placeholder/80/80";
                                                }}
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
                                                <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 text-sm">
                                                    Size: {item.size}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <input
                                            className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-black"
                                            type="number"
                                            min="1"
                                            max="99"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                                            aria-label={`Quantity for ${productData.name || "Product"}`}
                                        />
                                        {addingToCart[itemKey] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
                                                <Loader className="w-4 h-4 animate-spin" />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleDeleteItem(item._id, item.size)}
                                        className="group p-1 hover:bg-red-50 rounded transition-colors"
                                        aria-label="Remove item"
                                        disabled={deletingFromCart[itemKey]}
                                    >
                                        {deletingFromCart[itemKey] ? (
                                            <Loader className="w-4 h-4 text-red-500 animate-spin" />
                                        ) : (
                                            <svg
                                                className="w-4 h-4 text-gray-600 group-hover:text-red-500"
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
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">
                                        {currency}
                                        {calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-right">
                                        Calculated at checkout
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-4">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-lg font-semibold">
                                        {currency}
                                        {calculateTotal().toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate("/place-order")}
                                className="w-full bg-black text-white text-sm my-8 px-8 py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
