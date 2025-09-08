import { useState, useEffect, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Heart, 
    Trash2, 
    ShoppingCart, 
    Share2, 
    Filter,
    SortAsc,
    SortDesc,
    X,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const WishlistItem = ({ item, onRemove, onAddToCart, isLoading }) => {
    const navigate = useNavigate();

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: item.name,
                    text: `Check out ${item.name} on Zero Fashion!`,
                    url: `${window.location.origin}/product/${item.productId}`
                });
            } else {
                await navigator.clipboard.writeText(`${window.location.origin}/product/${item.productId}`);
                // You can add a toast notification here
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleViewProduct = () => {
        navigate(`/product/${item.productId}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden group">
            {/* Reuse ProductItem design */}
            <ProductItem
                id={item.productId}
                image={item.image}
                name={item.name}
                price={item.discountedPrice}
                discountPercent={item.discount}
                category={item.category}
                rating={item.rating || 0}
                imageClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Wishlist actions */}
            <div className="px-4 pb-4 -mt-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onAddToCart(item)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <ShoppingCart className="w-4 h-4" />
                        )}
                        Add to Cart
                    </button>

                    <button
                        onClick={() => onRemove(item.productId)}
                        disabled={isLoading}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Remove from wishlist"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                        onClick={handleShare}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Share product"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Wishlist = () => {
    const navigate = useNavigate();
    const { 
        wishlistItems, 
        removeFromWishlist, 
        addToCart, 
        isLoading,
        clearWishlist,
        getUserWishlist,
        token
    } = useContext(ShopContext);

    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('recent');
    const [showFilters, setShowFilters] = useState(false);

    // Load wishlist when component mounts
    useEffect(() => {
        if (token) {
            getUserWishlist();
        }
    }, [token, getUserWishlist]);



    // Get unique categories from wishlist items
    const categories = ['All', ...new Set(wishlistItems.map(item => item.category))];

    // Filter and sort items
    useEffect(() => {
        let items = [...wishlistItems];

        // Filter by category
        if (selectedCategory !== 'All') {
            items = items.filter(item => item.category === selectedCategory);
        }

        // Sort items
        switch (sortBy) {
            case 'price-low':
                items.sort((a, b) => a.discountedPrice - b.discountedPrice);
                break;
            case 'price-high':
                items.sort((a, b) => b.discountedPrice - a.discountedPrice);
                break;
            case 'name':
                items.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'recent':
            default:
                items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
                break;
        }

        setFilteredItems(items);
    }, [wishlistItems, selectedCategory, sortBy]);

    const handleRemoveItem = useCallback(async (productId) => {
        await removeFromWishlist(productId);
    }, [removeFromWishlist]);

    const handleAddToCart = useCallback(async (item) => {
        // Add the first available size to cart
        if (item.sizes && item.sizes.length > 0) {
            await addToCart(item.productId, item.sizes[0]);
        } else {
            // If no sizes available, add without size
            await addToCart(item.productId, 'default');
        }
    }, [addToCart]);

    const handleClearWishlist = async () => {
        if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
            await clearWishlist();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Title text1="My" text2="Wishlist" />
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
                        </span>

                        {wishlistItems.length > 0 && (
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-medium text-gray-900">Filter & Sort</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {categories.map(category => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sort Options */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Sort By
                                        </label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="recent">Most Recent</option>
                                            <option value="price-low">Price: Low to High</option>
                                            <option value="price-high">Price: High to Low</option>
                                            <option value="name">Name: A to Z</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Clear Wishlist Button */}
                                {wishlistItems.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <button
                                            onClick={handleClearWishlist}
                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                        >
                                            Clear All Items
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>



                {/* Wishlist Items */}
                {isLoading && wishlistItems.length === 0 ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : filteredItems.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8"
                    >
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id || index}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="w-full"
                            >
                                <WishlistItem
                                    item={item}
                                    onRemove={handleRemoveItem}
                                    onAddToCart={handleAddToCart}
                                    isLoading={isLoading}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
                                <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Your Wishlist is Empty
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Start adding your favorite products to your wishlist to keep track of items you love!
                                </p>
                                <Link
                                    to="/collection"
                                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;