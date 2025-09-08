import { useContext, useState, useCallback } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import LazyImage from "./LazyImage";
import PropTypes from "prop-types";

const ProductItem = ({ 
  id, 
  image, 
  name, 
  price, 
  category, 
  isNew = false, 
  rating, 
  imageClassName,
  discount,
  originalPrice,
  discountPercent
}) => {
  const { currency } = useContext(ShopContext);
  const [imageError, setImageError] = useState(false);

  // Helper function to get the first valid image URL
  const getImageSrc = useCallback(() => {
    if (!image || imageError) {
      return "/placeholder.svg";
    }
    
    // Handle both array and string formats
    if (Array.isArray(image)) {
      if (image.length === 0) {
        return "/placeholder.svg";
      }
      // Find first non-empty image URL
      const validImage = image.find(img => img && typeof img === 'string' && img.trim() !== "");
      return validImage || "/placeholder.svg";
    }
    
    // Handle string format
    if (typeof image === 'string' && image.trim() !== "") {
      return image;
    }
    
    return "/placeholder.svg";
  }, [image, imageError]);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const formatPrice = useCallback((priceValue) => {
    if (typeof priceValue === 'number') {
      return priceValue.toLocaleString();
    }
    return priceValue || '0';
  }, []);

  const renderRating = useCallback(() => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="mb-2 flex items-center gap-1">
        <div className="flex text-amber-400 text-sm">
          {/* Full stars */}
          {Array.from({ length: fullStars }).map((_, i) => (
            <span key={`full-${i}`}>★</span>
          ))}
          {/* Half star */}
          {hasHalfStar && <span className="relative">
            <span className="text-gray-300">★</span>
            <span className="absolute left-0 top-0 overflow-hidden w-1/2 text-amber-400">★</span>
          </span>}
          {/* Empty stars */}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300">★</span>
          ))}
        </div>
        <span className="ml-1 text-xs text-gray-500 font-medium">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  }, [rating]);

  const effectiveDiscount = typeof discount === 'number' && discount > 0
    ? discount
    : (typeof discountPercent === 'number' && discountPercent > 0 ? discountPercent : 0);
  const currentPrice = effectiveDiscount > 0
    ? Math.round((Number(price || 0) * (100 - effectiveDiscount)) / 100)
    : Number(price || 0);

  return (
    <div className="group h-full">
      <Link 
        to={`/product/${id}`} 
        className="flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`View details for ${name}`}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          <LazyImage
            src={getImageSrc()}
            alt={name || "Product Image"}
            className={`${
              imageClassName || 
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
          
          {/* Tags Container */}
          <div className="absolute inset-0 pointer-events-none">
            {/* New Tag */}
            {isNew && (
              <div className="absolute left-2 top-2 bg-green-600 text-white px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded-sm shadow-sm">
                New
              </div>
            )}
            
            {/* Discount Tag */}
            {effectiveDiscount > 0 && (
              <div className="absolute right-2 top-10 sm:top-12 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-sm shadow-sm">
                -{effectiveDiscount}%
              </div>
            )}
            
            {/* Category Tag */}
            {category && (
              <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 text-xs font-medium uppercase tracking-wide rounded-sm shadow-sm">
                {category}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 pointer-events-auto z-20">
            <WishlistButton productId={id} size="sm" />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {/* Product Name */}
          <h3 className="mb-2 text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          {renderRating()}

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {currency}{formatPrice(currentPrice)}
                </p>
                {effectiveDiscount > 0 && (
                  <p className="text-sm text-gray-500 line-through">
                    {currency}{formatPrice(price)}
                  </p>
                )}
              </div>
              
              {/* View Link */}
              <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                <span className="text-xs sm:text-sm font-medium uppercase tracking-wide border-b border-current transition-all duration-200 group-hover:border-b-2">
                  View
                </span>
                <svg 
                  className="ml-1 w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string), 
    PropTypes.string
  ]),
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string,
  isNew: PropTypes.bool,
  rating: PropTypes.number,
  imageClassName: PropTypes.string,
  discount: PropTypes.number,
  originalPrice: PropTypes.number,
};

export default ProductItem;