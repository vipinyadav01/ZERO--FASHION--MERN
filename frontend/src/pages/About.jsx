import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="text-3xl text-center mt-10 border-t pt-10"
      >
        <Title text1={"ABOUT"} text2={"US"} />
      </motion.div>

      <motion.div
        className="my-16 flex flex-col md:flex-row gap-16 items-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-full md:max-w-[450px] rounded-lg shadow-xl"
          src={assets.about_img}
          alt="About Zero Fashion"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-700">
          <p className="leading-relaxed">
            Welcome to Zero Fashion — where style meets sustainability. We are
            an eco-conscious fashion brand dedicated to bringing you the latest
            trends with zero compromise on quality and the environment. At Zero
            Fashion, we believe that looking good should also mean feeling good
            about the choices we make. That's why every piece in our collection
            is crafted with care, keeping sustainability and affordability in
            mind.
          </p>
          <p className="leading-relaxed">
            Our journey started with a simple vision: to make fashion accessible
            without the heavy environmental cost. We partner with ethical
            manufacturers, use responsibly sourced materials, and are constantly
            working to reduce our footprint. From packaging to production, we're
            committed to practices that respect the planet and the people who
            live on it.
          </p>
          <p className="leading-relaxed">
            Join us as we build a future of fashion that's both stylish and
            sustainable. Discover our collections and find your perfect style —
            without compromise. Because at Zero Fashion, zero waste and zero
            harm means 100% style.
          </p>
          <h3 className="text-2xl font-bold text-gray-900 mt-6">Our Mission</h3>
          <p className="leading-relaxed">
            At Zero Fashion, our mission is to redefine the fashion industry by
            making sustainability stylish and accessible for everyone. We're
            committed to reducing waste, promoting ethical practices, and
            empowering our customers to make choices that reflect their values.
            By embracing innovative materials and responsible production
            methods, we aim to minimize our environmental impact and set a new
            standard in eco-friendly fashion.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-2xl py-8 text-center"
      >
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8 mb-20"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {[
          {
            title: "Quality Assurance",
            description:
              "At Zero Fashion, quality is our promise. We know that sustainable fashion shouldn't mean compromising on durability or style. That's why each item undergoes rigorous quality checks at every stage, from design to delivery. Our commitment to excellence ensures that you receive a product that's not only stylish but also crafted to last.",
          },
          {
            title: "Convenience",
            description:
              "At Zero Fashion, we make sustainable shopping simple. Enjoy a streamlined online experience, fast shipping, and dedicated customer support for a hassle-free journey from browsing to delivery. Fashion that fits your lifestyle, effortlessly.",
          },
          {
            title: "Exceptional Customer Service",
            description:
              "At Zero Fashion, we're here for you. Our friendly support team is dedicated to quick responses, personalized assistance, and ensuring your satisfaction at every step. Because your experience matters.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="border border-gray-200 rounded-lg px-8 py-10 shadow-lg bg-white"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              {item.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <NewsletterBox />
      </motion.div>
    </div>
  );
};

export default About;
