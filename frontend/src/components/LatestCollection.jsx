import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { ArrowRight } from "lucide-react";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    setLatest(products.slice(0, 10));
  }, [products]);

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-12 pb-6 border-b border-brand-border"
        >
          <div>
            <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.3em] mb-2">
              Just Arrived
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-text-primary uppercase tracking-tight leading-none">
              Latest <span className="text-brand-text-secondary">Collections</span>
            </h2>
          </div>
          <Link
            to="/collection"
            className="flex items-center gap-2 text-[10px] font-black text-brand-text-secondary uppercase tracking-widest hover:text-brand-text-primary transition-colors group"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Grid */}
        {latest.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {latest.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
              >
                <ProductItem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  discountPercent={item.discountPercent}
                  category={item.category}
                  isNew={item.isNew || false}
                  rating={item.rating || 0}
                  loading={i < 4 ? "eager" : "lazy"}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-brand-border">
            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
              No collections available yet — check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestCollection;
