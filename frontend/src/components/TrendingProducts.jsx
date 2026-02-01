import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem.jsx";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const TrendingProducts = () => {
  const { products } = useContext(ShopContext);
  const [trendingProducts, setTrendingProducts] = useState([]);

  useEffect(() => {
    // Get products and sort by a trending metric (can be by date, popularity, etc.)
    // For now, we'll just get the latest products or filter by a trending flag
    const trending = products.filter((item) => item.trending || item.isNew).slice(0, 5);
    setTrendingProducts(trending.length > 0 ? trending : products.slice(0, 5));
  }, [products]);

  return (
    <section className="my-10 px-4 md:px-6 max-w-7xl mx-auto">
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-red-600" />
          <span className="text-xs sm:text-sm font-semibold text-red-600 uppercase tracking-wider">
            Trending Now
          </span>
        </div>
        <Title text1={"TRENDING"} text2={"COLLECTION"} />
        <p className="w-full md:w-3/4 lg:w-2/3 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-3">
          Discover what&apos;s hot right now – the latest styles everyone is talking about.
        </p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, staggerChildren: 0.1 }}
      >
        {trendingProducts.map((item, index) => (
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

      {/* View All Button */}
      <motion.div 
        className="flex justify-center mt-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <a
          href="/collection"
          className="px-6 py-3 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          View All Trending
        </a>
      </motion.div>
    </section>
  );
};

export default TrendingProducts;
