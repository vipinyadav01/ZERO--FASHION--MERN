import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    ShoppingCart,
    Trash2,
    Share2,
    AlertCircle,
    ChevronLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Title from '../components/Title';

const WishlistItem = memo(({ item, onRemove, onAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            whileHover={{ y: -5 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="relative group">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                        {item.discount}% OFF
                    </div>
                )}
                {!item.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-indigo-600">
                        ${item.discountedPrice}
                    </span>
                    {item.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            ${item.originalPrice}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAddToCart(item)}
                        disabled={!item.inStock}
                        className={`
                            flex-1 mr-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium
                            ${item.inStock
                                ? 'bg-black text-white hover:bg-gray-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        `}
                    >
                        <ShoppingCart size={16} />
                        Add to Cart
                    </motion.button>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onRemove(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        >
                            <Trash2 size={18} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"
                            onClick={() => {
                                navigator.share({
                                    title: item.name,
                                    text: `Check out ${item.name}`,
                                    url: window.location.href
                                });
                            }}
                        >
                            <Share2 size={18} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

const Wishlist = () => {
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: "Premium Cotton T-Shirt",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3",
            originalPrice: 29.99,
            discountedPrice: 23.99,
            discount: 20,
            inStock: true,
            category: "Clothing"
        },
        {
            id: 2,
            name: "Leather Crossbody Bag",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3",
            originalPrice: 89.99,
            discountedPrice: 89.99,
            discount: 0,
            inStock: true,
            category: "Accessories"
        },
        {
            id: 3,
            name: "Slim Fit Denim Jeans",
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3",
            originalPrice: 59.99,
            discountedPrice: 47.99,
            discount: 20,
            inStock: false,
            category: "Clothing"
        },
        {
            id: 4,
            name: "Classic Leather Watch",
            image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3",
            originalPrice: 129.99,
            discountedPrice: 97.49,
            discount: 25,
            inStock: true,
            category: "Accessories"
        },
        {
            id: 5,
            name: "Summer Floral Dress",
            image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3",
            originalPrice: 49.99,
            discountedPrice: 34.99,
            discount: 30,
            inStock: true,
            category: "Clothing"
        }
    ]);

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('default');

    const categories = ['All', 'Clothing', 'Accessories'];

    const handleRemoveItem = (itemId) => {
        setWishlistItems(items => items.filter(item => item.id !== itemId));
    };

    const handleAddToCart = (item) => {
        // Add to cart logic here
        console.log('Added to cart:', item);
    };

    const getSortedItems = () => {
        let items = [...wishlistItems];

        // Filter by category
        if (selectedCategory !== 'All') {
            items = items.filter(item => item.category === selectedCategory);
        }

        // Sort items
        switch (sortBy) {
            case 'price-low':
                return items.sort((a, b) => a.discountedPrice - b.discountedPrice);
            case 'price-high':
                return items.sort((a, b) => b.discountedPrice - a.discountedPrice);
            case 'discount':
                return items.sort((a, b) => b.discount - a.discount);
            default:
                return items;
        }
    };

    const sortedItems = getSortedItems();

    return (
        <div className="flex justify-center items-center min-h-screen bg-white p-4 mt-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-indigo-600 mb-4"
                        >
                            <ChevronLeft size={20} />
                            <span>Back</span>
                        </button>
                        <Title
                            text1="My"
                            text2="Wishlist"
                            size="xl"
                            accent="gradient"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>

                        {/* Sort Options */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            <option value="default">Sort by</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="discount">Biggest Discount</option>
                        </select>
                    </div>
                </div>

                {/* Rest of the code remains the same */}
                {sortedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {sortedItems.map(item => (
                                <WishlistItem
                                    key={item.id}
                                    item={item}
                                    onRemove={handleRemoveItem}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <AlertCircle size={48} className="text-gray-400" />
                            <h3 className="text-xl font-semibold text-gray-700">
                                Your wishlist is empty
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Start adding items to your wishlist while shopping
                            </p>
                            <Link
                                to="/collection"
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default memo(Wishlist);
