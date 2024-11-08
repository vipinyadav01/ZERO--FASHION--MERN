import React, { useContext, useState, useEffect } from "react"; // Added useEffect import
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem"; // Assuming ProductItem is a separate component

export const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter(
        (item) => subCategory === item.subCategory
      );

      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]); // Added category and subCategory to dependencies

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2 ">
        {" "}
        {/* Corrected text-center */}
        <h2>RELATED PRODUCTS</h2> {/* Replaced title with h2 */}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          <ProductItem // Capitalized ProductItem
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
