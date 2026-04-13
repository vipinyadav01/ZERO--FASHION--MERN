import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { ArrowRight, Award } from "lucide-react";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const best = products.filter((p) => p.bestseller);
    setBestSellers(best.length > 0 ? best.slice(0, 5) : products.slice(0, 5));
  }, [products]);

  return (
    <section className="bg-[#F8F8F6] border-y border-brand-border">
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
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-3.5 h-3.5 text-brand-text-secondary" />
              <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-[0.3em]">
                Customer Favourites
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-text-primary uppercase tracking-tight leading-none">
              Best <span className="text-brand-text-secondary">Sellers</span>
            </h2>
          </div>
          <Link
            to="/collection"
            className="flex items-center gap-2 text-[10px] font-black text-brand-text-secondary uppercase tracking-widest hover:text-brand-text-primary transition-colors group"
          >
            Shop All
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {bestSellers.map((item, i) => (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.08, 0.4) }}
            >
              <ProductItem
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                discountPercent={item.discountPercent}
                category={item.category}
                isNew={item.isNew || false}
                rating={item.rating || 0}
              />
            </motion.div>
          ))}
        </div>

        {bestSellers.length === 0 && (
          <div className="py-20 text-center border border-dashed border-brand-border">
            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
              No bestsellers yet — products will appear here as they gain popularity.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;
