import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem.jsx";
import { motion } from "framer-motion";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    // Filter products to get only bestsellers
    const bestProduct = products.filter((item) => item.bestseller); // assuming `bestseller` is a boolean
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  // Added `products` as a dependency to re-run if `products` changes

  return (
    <section className="my-10 px-4 md:px-6 max-w-7xl mx-auto">
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-full md:w-3/4 lg:w-2/3 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-3">
          Shop the favorites everyone loves – timeless styles that never go out of trend.
        </p>
      </motion.div>

      {/* Rendering best products */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, staggerChildren: 0.1 }}
      >
        {bestSeller.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="transform transition-all duration-300"
          >
            <ProductItem
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BestSeller;
