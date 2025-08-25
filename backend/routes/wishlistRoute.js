import express from 'express';
import auth from '../middleware/auth.js';
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    checkWishlistStatus,
    clearWishlist
} from '../controllers/wishlistController.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Add item to wishlist
router.post('/add', addToWishlist);

// Remove item from wishlist
router.delete('/remove/:productId', removeFromWishlist);

// Get user's wishlist
router.get('/', getWishlist);

// Check if product is in wishlist
router.get('/check/:productId', checkWishlistStatus);

// Clear entire wishlist
router.delete('/clear', clearWishlist);

export default router;
