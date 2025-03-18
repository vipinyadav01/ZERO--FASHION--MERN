import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

const ProductItem = ({ id, image, name, price, category, isNew, rating }) => {
  const { currency, addToCart, addToWishlist } = useContext(ShopContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart && addToCart(id);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist && addToWishlist(id);
  };

  return (
    <Link
      className="group flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      to={`/product/${id}`}
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={image?.[0] ?? "fallback_image_url"}
          alt={name}
          loading="lazy"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-10"></div>

        {/* Quick action buttons */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            onClick={handleAddToWishlist}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors hover:bg-gray-100"
            aria-label="Add to wishlist"
          >
            <Heart size={20} />
          </button>
          <button
            onClick={handleAddToCart}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors hover:bg-gray-100"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>

        {/* Tags */}
        {isNew && (
          <span className="absolute left-4 top-4 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
            New
          </span>
        )}
        {category && (
          <span className="absolute bottom-4 left-4 rounded-full bg-black bg-opacity-50 px-3 py-1 text-xs font-medium text-white">
            {category}
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 truncate text-base font-medium text-gray-800">
          {name}
        </h3>

        {rating && (
          <div className="mb-2 flex items-center">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">({rating})</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900">
            {currency}
            {price}
          </p>
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            In Stock
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
