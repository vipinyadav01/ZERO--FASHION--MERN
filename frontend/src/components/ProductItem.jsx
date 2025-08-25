import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";

const ProductItem = ({ id, image, name, price, category, isNew, rating }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="block h-full group">
      <div className="flex flex-col h-full border border-gray-200 bg-white transition-all duration-300 hover:border-black">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={image?.[0] ?? "https://via.placeholder.com/300"}
            alt={name}
            loading="lazy"
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

export default ProductItem;