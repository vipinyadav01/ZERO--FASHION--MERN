import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div
        className="overflow-hidden"
        style={{ width: "200px", height: "250px" }}
      >
        <img
          className="relative w-full h-full object-cover rounded-lg bg-gray-200 mb-4 hover:scale-110 transition ease-out"
          src={image && image[0] ? image[0] : "fallback_image_url"}
          alt="product_img"
        />
      </div>

      <p className="text-sm text-gray-700 mb-1 line-clamp-2 group-hover:text-gray-900 transition-colors duration-200">
        {name}
      </p>
      <p className="text-lg font-medium text-gray-900">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
