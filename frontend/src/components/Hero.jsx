import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { assets } from "./../assets/assets";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400 pt-20">
      {/* Hero left side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-16 sm:py-24 px-6 sm:px-12 bg-gradient-to-br from-stone-100 to-stone-200">
        <motion.div
          className="text-stone-800 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="h-px bg-stone-400 flex-grow"></div>
            <p className="font-medium text-sm tracking-wider">
              OUR BESTSELLERS
            </p>
          </motion.div>

          <motion.h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Latest Arrivals
          </motion.h1>

          <motion.div
            className="inline-flex items-center gap-3 group cursor-pointer"
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <p className="font-semibold text-sm tracking-wider group-hover:underline">
              SHOP NOW
            </p>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.div>
        </motion.div>
      </div>

      {/* Hero right side */}
      <div className="w-full sm:w-1/2 relative aspect-[4/3] sm:aspect-auto">
        <img src={assets.hero_img} alt="Hero_img" className="w-full sm:w-2/1" />
      </div>
    </div>
  );
};

export default Hero;
