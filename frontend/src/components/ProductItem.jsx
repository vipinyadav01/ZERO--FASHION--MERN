import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import PropTypes from "prop-types";

const ProductItem = ({ id, image, name, price, category, isNew, rating, imageClassName }) => {
  const { currency } = useContext(ShopContext);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Helper function to get the first valid image URL
  const getImageSrc = () => {
    if (!image || !Array.isArray(image) || image.length === 0) {
      return "/placeholder.svg";
    }    
  // Find first non-empty image URL
    const validImage = image.find(img => img && img.trim() !== "");
    return validImage || "/placeholder.svg";
  };
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  return (
    <Link to={`/product/${id}`} className="block h-full group">
      <div className="flex flex-col h-full border border-gray-200 bg-white transition-all duration-300 hover:border-black">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          {/* Loading Spinner */}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          <img
            src={imageError ? "/placeholder.svg" : getImageSrc()}
            alt={name || "Product Image"}
            className={imageClassName || "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: isImageLoading ? 'none' : 'block' }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-10"></div>
          {/* Tags */}
          {isNew && (
            <div className="absolute left-0 top-0 bg-black py-1 px-3">
              <span className="text-xs uppercase tracking-wider font-medium text-white">
                New
              </span>
            </div>
          )}
          {category && (
            <div className="absolute bottom-0 left-0 bg-white py-1 px-3">
              <span className="text-xs uppercase tracking-wider font-medium text-black">
                {category}
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2">
            <WishlistButton productId={id} size="sm" />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 text-sm font-medium text-black line-clamp-1">
            {name}
          </h3>

          {rating && (
            <div className="mb-3 flex items-center">
              <div className="flex text-black text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`${i < Math.floor(rating) ? "text-black" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-1 text-xs text-gray-500">({rating.toFixed(1)})</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between">
            <p className="text-base font-bold text-black">
              {currency}
              {typeof price === 'number' ? price.toLocaleString() : price}
            </p>
            
            <div className="inline-block border-b border-black transition-all duration-200 group-hover:border-b-2">
              <span className="text-xs uppercase tracking-wider font-medium">
                View
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string,
  isNew: PropTypes.bool,
  rating: PropTypes.number,
  imageClassName: PropTypes.string,
};

export default ProductItem;