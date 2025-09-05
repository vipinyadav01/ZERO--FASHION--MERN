import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem"; 

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
  }, [products, category, subCategory]); 

  return (
    <div className="my-24">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          <ProductItem 
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
            category={item.category}
            isNew={item.isNew || false}
            rating={item.rating || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
