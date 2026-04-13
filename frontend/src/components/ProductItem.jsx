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
  discount,
  discountPercent,
  loading = "lazy",
}) => {
  const { currency } = useContext(ShopContext);
  const [imageError, setImageError] = useState(false);

  const getImageSrc = useCallback(() => {
    if (!image || imageError) return "/placeholder.svg";
    if (Array.isArray(image)) {
      const valid = image.find((img) => img && typeof img === "string" && img.trim());
      return valid || "/placeholder.svg";
    }
    if (typeof image === "string" && image.trim()) return image;
    return "/placeholder.svg";
  }, [image, imageError]);

  const effectiveDiscount =
    typeof discount === "number" && discount > 0
      ? discount
      : typeof discountPercent === "number" && discountPercent > 0
      ? discountPercent
      : 0;

  const currentPrice =
    effectiveDiscount > 0
      ? Math.round((Number(price || 0) * (100 - effectiveDiscount)) / 100)
      : Number(price || 0);

  const stars = rating ? Math.round(rating) : 0;

  return (
    <div className="group">
      <Link
        to={`/product/${id}`}
        className="flex flex-col bg-white border border-brand-border overflow-hidden transition-all duration-200 hover:border-[#1A1A1A] hover:shadow-sm focus:outline-none"
        aria-label={`View ${name}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F8F8F6]">
          <LazyImage
            src={getImageSrc()}
            alt={name || "Product"}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading={loading}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />

          {/* Tags */}
          <div className="absolute inset-0 pointer-events-none">
            {isNew && (
              <div className="absolute top-2 left-2 bg-[#1A1A1A] text-white text-[8px] font-black uppercase tracking-widest px-2 py-1">
                New
              </div>
            )}
            {effectiveDiscount > 0 && (
              <div className="absolute top-2 right-10 bg-white border border-brand-border text-[8px] font-black text-brand-text-primary uppercase tracking-widest px-2 py-1">
                -{effectiveDiscount}%
              </div>
            )}
            {category && (
              <div className="absolute bottom-2 left-2 bg-white/90 text-brand-text-secondary text-[8px] font-black uppercase tracking-widest px-2 py-1 border border-brand-border">
                {category}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="absolute top-2 right-2 pointer-events-auto z-20">
            <WishlistButton productId={id} size="sm" />
          </div>
        </div>

        {/* Details */}
        <div className="p-3 sm:p-4 flex flex-col gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-brand-text-primary uppercase tracking-tight line-clamp-2 leading-snug">
            {name}
          </h3>

          {/* Stars */}
          {stars > 0 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-[10px] ${i < stars ? "text-[#1A1A1A]" : "text-brand-border"}`}
                >
                  ★
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-auto pt-1">
            <span className="text-sm sm:text-base font-black text-brand-text-primary">
              {currency}{currentPrice.toLocaleString()}
            </span>
            {effectiveDiscount > 0 && (
              <span className="text-xs text-brand-text-secondary line-through">
                {currency}{Number(price || 0).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string,
  isNew: PropTypes.bool,
  rating: PropTypes.number,
  discount: PropTypes.number,
  discountPercent: PropTypes.number,
  loading: PropTypes.oneOf(["lazy", "eager"]),
};

export default ProductItem;
