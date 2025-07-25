import { useState,  memo, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types'; // Import PropTypes
import {
    ShoppingCart,
    Trash2,
    Share2,
    AlertCircle,
    ChevronLeft,
    SlidersHorizontal,
    X,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Title from '../components/Title'; // Assuming this path is correct

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const Badge = ({ children, variant = "primary" }) => {
    const variantClasses = {
        primary: "bg-indigo-100 text-indigo-800",
        discount: "bg-red-100 text-red-800",
        outOfStock: "bg-gray-800 bg-opacity-80 text-white"
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${variantClasses[variant]}`}>
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(["primary", "discount", "outOfStock"]),
};

const WishlistItem = memo(({ item, onRemove, onAddToCart }) => {
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: item.name,
                    text: `Check out ${item.name} on Zero Fashion!`,
                    url: window.location.href // Consider making this item-specific if possible
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(window.location.href); // Copies current page URL
                alert('Link copied to clipboard!'); // Simple fallback notification
            }
        } catch (error) {
            console.error('Error sharing:', error);
            // Optionally, show an error toast
        }
    };

    return (
        <motion.div
            layout
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
        >
            <div className="relative group">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-56 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {item.discount > 0 && (
                    <div className="absolute top-3 left-3">
                        <Badge variant="discount">{item.discount}% OFF</Badge>
                    </div>
                )}

                {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[3px] z-10">
                        <Badge variant="outOfStock">Out of Stock</Badge>
                    </div>
                )}

                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge variant="primary">{item.category}</Badge>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{item.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-indigo-600">
                        ${item.discountedPrice.toFixed(2)}
                    </span>
                    {item.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            ${item.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAddToCart(item)}
                        disabled={!item.inStock}
                        className={`
                            flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium
                            ${item.inStock
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/20'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                            transition-all duration-200 transform hover:-translate-y-0.5
                        `}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Add to Cart</span>
                    </motion.button>

                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onRemove(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            aria-label="Remove from wishlist"
                        >
                            <Trash2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            onClick={handleShare}
                            aria-label="Share item"
                        >
                            <Share2 className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

WishlistItem.displayName = 'WishlistItem';

WishlistItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        originalPrice: PropTypes.number.isRequired,
        discountedPrice: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
        inStock: PropTypes.bool.isRequired,
        category: PropTypes.string.isRequired,
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
    onAddToCart: PropTypes.func.isRequired,
};

const SortButton = ({ active, label, onClick, sortDirection }) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${active
                ? 'bg-indigo-600 text-white shadow-md' // Stronger active state
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
            transform hover:-translate-y-0.5
        `}
    >
        {label}
        {active && (sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />)}
    </button>
);

SortButton.propTypes = {
    active: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    sortDirection: PropTypes.oneOf(['asc', 'desc']),
};

const FilterButton = ({ active, label, onClick }) => (
    <button
        onClick={onClick}
        className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${active
                ? 'bg-indigo-600 text-white shadow-md' // Stronger active state
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
            transform hover:-translate-y-0.5
        `}
    >
        {label}
    </button>
);

FilterButton.propTypes = {
    active: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

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
    const [sortType, setSortType] = useState('default');
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
    const [showFilters, setShowFilters] = useState(false);

    const categories = useMemo(() => ['All', 'Clothing', 'Accessories'], []);

    const handleRemoveItem = useCallback((itemId) => {
        setWishlistItems(items => items.filter(item => item.id !== itemId));
    }, []);

    const handleAddToCart = useCallback((item) => {
        console.log('Added to cart:', item);
        // In a real application, you would dispatch an action or call a context function here
        // e.g., addToCart(item);
    }, []);

    const handleSortChange = useCallback((newSortType) => {
        if (newSortType === sortType) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortType(newSortType);
            setSortDirection('asc'); // Default to ascending when changing sort type
        }
    }, [sortType]);

    const sortedAndFilteredItems = useMemo(() => {
        let items = [...wishlistItems];

        if (selectedCategory !== 'All') {
            items = items.filter(item => item.category === selectedCategory);
        }

        switch (sortType) {
            case 'price':
                items.sort((a, b) => {
                    return sortDirection === 'asc'
                        ? a.discountedPrice - b.discountedPrice
                        : b.discountedPrice - a.discountedPrice;
                });
                break;
            case 'discount':
                items.sort((a, b) => {
                    return sortDirection === 'asc'
                        ? a.discount - b.discount
                        : b.discount - a.discount;
                });
                break;
            default:
                // No specific sort, maintain original order or a default stable sort if needed
                break;
        }
        return items;
    }, [wishlistItems, selectedCategory, sortType, sortDirection]);

    return (
        <section className="min-h-screen pt-28 pb-16 bg-gray-50 antialiased px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 md:mb-12">
                    <div className="flex items-center gap-4">
                        <motion.button
                            onClick={() => navigate(-1)}
                            whileHover={{ x: -3 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                        >
                            <ChevronLeft className="w-6 h-6" />
                            <span className="text-sm font-medium sr-only md:not-sr-only">Back</span>
                        </motion.button>
                        <Title text1="My" text2="Wishlist" />
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm">{sortedAndFilteredItems.length} items</span>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 ml-auto md:ml-0 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow text-gray-700 transition-all duration-200 border border-gray-200"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="text-sm font-medium">Filters & Sort</span>
                        </motion.button>
                    </div>
                </div>

                {/* Filters & Sort Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }} // Add margin-top for spacing
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden border border-gray-200" // Stronger shadow, added border
                        >
                            <div className="p-4 md:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Filter & Sort Options</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-3">Category</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(category => (
                                                <FilterButton
                                                    key={category}
                                                    label={category}
                                                    active={selectedCategory === category}
                                                    onClick={() => setSelectedCategory(category)}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-3">Sort By</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <SortButton
                                                label="Price"
                                                active={sortType === 'price'}
                                                sortDirection={sortDirection}
                                                onClick={() => handleSortChange('price')}
                                            />
                                            <SortButton
                                                label="Discount"
                                                active={sortType === 'discount'}
                                                sortDirection={sortDirection}
                                                onClick={() => handleSortChange('discount')}
                                            />
                                            {/* Add a default/relevance sort if applicable */}
                                            <SortButton
                                                label="Default"
                                                active={sortType === 'default'}
                                                sortDirection={sortDirection} // Direction won't matter for default, but keep for consistency
                                                onClick={() => handleSortChange('default')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Wishlist Items Grid */}
                {sortedAndFilteredItems.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        <AnimatePresence>
                            {sortedAndFilteredItems.map(item => (
                                <WishlistItem
                                    key={item.id}
                                    item={item}
                                    onRemove={handleRemoveItem}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-16 md:py-24"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200"> {/* Enhanced styling */}
                                <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Your Wishlist is Empty!
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    It looks like you haven't added any items to your wishlist yet. Start exploring your favorite products!
                                </p>
                                <Link
                                    to="/collection"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default memo(Wishlist);