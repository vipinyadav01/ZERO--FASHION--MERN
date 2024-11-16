import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

const NewsletterBox = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateX: 45
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-1/2 flex items-center justify-center p-6" ref={ref}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full transform-gpu"
      >
        <motion.div
          variants={itemVariants}
          className="bg-gray-50 p-6 rounded-t-lg border-b border-gray-100"
        >
          <motion.p
            variants={itemVariants}
            className="text-3xl font-bold text-gray-800 mb-2"
          >
            Limited-Time Sale!
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600"
          >
            Save big on our hottest styles. Shop now before it's too late!
          </motion.p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          onSubmit={onSubmitHandler}
          className="mt-6 flex flex-col sm:flex-row gap-4"
        >
          <input
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-gray-50"
            type="email"
            placeholder="Enter your email"
            required
          />

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#1F2937" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="bg-gray-800 text-white font-medium px-8 py-3 rounded-md transition-colors duration-200"
          >
            SUBSCRIBE
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default NewsletterBox;