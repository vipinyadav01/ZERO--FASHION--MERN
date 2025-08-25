import { useState, useEffect, useContext, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const WishlistButton = ({ productId, className = "", size = "md" }) => {
    const { addToWishlist, removeFromWishlist, wishlistItems, isLoading } = useContext(ShopContext);
    const [isInWishlist, setIsInWishlist] = useState(false);

    // Check if product is in wishlist using existing wishlist data
    const checkWishlistStatus = useMemo(() => {
        if (!productId || !wishlistItems || wishlistItems.length === 0) {
            return false;
        }
        return wishlistItems.some(item => item.productId === productId);
    }, [productId, wishlistItems]);

    // Update local state when wishlist data changes
    useEffect(() => {
        setIsInWishlist(checkWishlistStatus);
    }, [checkWishlistStatus]);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!productId || isLoading) return;

        try {
            if (isInWishlist) {
                await removeFromWishlist(productId);
                setIsInWishlist(false);
            } else {
                await addToWishlist(productId);
                setIsInWishlist(true);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    // Size classes
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    const buttonSizeClasses = {
        sm: "p-1.5",
        md: "p-2",
        lg: "p-2.5"
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`
                ${buttonSizeClasses[size]}
                rounded-full transition-all duration-200
                ${isInWishlist
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-md"
                    : "bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white shadow-sm"
                }
                ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
                ${className}
            `}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart 
                className={`${sizeClasses[size]} ${isInWishlist ? "fill-current" : ""}`}
            />
        </button>
    );
};

export default WishlistButton;
