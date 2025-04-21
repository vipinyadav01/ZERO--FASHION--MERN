import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProductItem = ({ id, image, name, price, category, isNew, rating }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link to={`/product/${id}`} className="block h-full">
      <motion.div
        className="group flex flex-col h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
        whileHover={{ y: -5, transition: { duration: 0.3 } }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={image?.[0] ?? "https://via.placeholder.com/300"}
            alt={name}
            loading="lazy"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20"></div>

          {/* Tags */}
          {isNew && (
            <span className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-blue-600 px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium text-white">
              New
            </span>
          )}
          {category && (
            <span className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 rounded-full bg-black/70 px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium text-white">
              {category}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <h3 className="mb-1 truncate text-sm sm:text-base font-semibold text-gray-900">
            {name}
          </h3>

          {rating && (
            <div className="mb-2 flex items-center">
              <div className="flex text-yellow-400 text-xs sm:text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-1 text-xs text-gray-500">({rating.toFixed(1)})</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between">
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {currency}
              {typeof price === 'number' ? price.toLocaleString() : price}
            </p>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
              In Stock
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductItem;
