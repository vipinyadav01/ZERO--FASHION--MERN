import Wishlist from '../models/wishlistModel.js';
import Product from '../models/productModel.js';

// Add item to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        // Validate productId
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if item already exists in wishlist
        const existingWishlistItem = await Wishlist.findOne({ userId, productId });
        if (existingWishlistItem) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }

        // Add to wishlist
        const wishlistItem = new Wishlist({
            userId,
            productId
        });

        await wishlistItem.save();

        res.status(201).json({
            message: 'Item added to wishlist successfully',
            wishlistItem
        });

    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        // Validate productId
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Find and remove the wishlist item
        const wishlistItem = await Wishlist.findOneAndDelete({ userId, productId });
        
        if (!wishlistItem) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        res.json({
            message: 'Item removed from wishlist successfully',
            removedItem: wishlistItem
        });

    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user's wishlist with product details
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get wishlist items with populated product details
        const wishlistItems = await Wishlist.find({ userId })
            .populate({
                path: 'productId',
                select: 'name image price discountPercent category subCategory description sizes'
            })
            .sort({ addedAt: -1 }); // Sort by most recently added

        // Transform the data to match frontend expectations
        const transformedWishlist = wishlistItems
            .filter(item => item.productId) // Filter out items with deleted products
            .map(item => ({
                id: item._id,
                productId: item.productId._id,
                name: item.productId.name,
                image: item.productId.image && item.productId.image.length > 0 ? item.productId.image[0] : '/placeholder.jpg',
                originalPrice: item.productId.price,
                discountedPrice: Math.round((item.productId.price * (100 - (item.productId.discountPercent || 0))) / 100),
                discount: item.productId.discountPercent || 0,
                inStock: true, // Assuming all products are in stock
                category: item.productId.category,
                subCategory: item.productId.subCategory,
                description: item.productId.description,
                sizes: item.productId.sizes,
                addedAt: item.addedAt
            }));

        res.json({
            message: 'Wishlist retrieved successfully',
            wishlist: transformedWishlist,
            count: transformedWishlist.length
        });

    } catch (error) {
        console.error('Error getting wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Check if product is in user's wishlist
export const checkWishlistStatus = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        // Validate productId
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if item exists in wishlist
        const wishlistItem = await Wishlist.findOne({ userId, productId });
        
        res.json({
            isInWishlist: !!wishlistItem,
            wishlistItem: wishlistItem || null
        });

    } catch (error) {
        console.error('Error checking wishlist status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        // Remove all wishlist items for the user
        const result = await Wishlist.deleteMany({ userId });

        res.json({
            message: 'Wishlist cleared successfully',
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Error clearing wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
