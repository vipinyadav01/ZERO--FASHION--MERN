import { useState, useEffect, useContext } from 'react';
import { Heart } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const WishlistButton = ({ productId, className = "", size = "md" }) => {
    const { addToWishlist, removeFromWishlist, checkWishlistStatus, isLoading } = useContext(ShopContext);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Check wishlist status on mount
    useEffect(() => {
        const checkStatus = async () => {
            if (productId) {
                try {
                    setIsChecking(true);
                    const status = await checkWishlistStatus(productId);
                    setIsInWishlist(status);
                } catch (error) {
                    console.error('Error checking wishlist status:', error);
                } finally {
                    setIsChecking(false);
                }
            }
        };

        checkStatus();
    }, [productId, checkWishlistStatus]);

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
            disabled={isLoading || isChecking}
            className={`
                ${buttonSizeClasses[size]}
                rounded-full transition-all duration-200
                ${isInWishlist
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-md"
                    : "bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white shadow-sm"
                }
                ${isLoading || isChecking ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
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
