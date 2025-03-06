import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HeroStats = ({ icon: Icon, label, value }) => (
    <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
    >
        <Icon className="w-4 h-4 text-indigo-600" />
        <div className="text-sm">
            <span className="font-semibold text-gray-900">{value}</span>
            <span className="text-gray-500 ml-1">{label}</span>
        </div>
    </motion.div>
);

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const featuredProducts = [
        {
            id: 1,
            image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            title: "Summer Collection",
            subtitle: "Latest Arrivals"
        },
        {
            id: 2,
            image: "https://images.pexels.com/photos/5868722/pexels-photo-5868722.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            title: "Winter Essentials",
            subtitle: "Cozy Comfort"
        },
        {
            id: 3,
            image: assets?.hero_img || "https://via.placeholder.com/600",
            title: "Autumn Styles",
            subtitle: "Trending Now"
        }
    ];

    useEffect(() => {
        if (!isHovered) {
            const timer = setInterval(() => {
                setCurrentImageIndex((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [isHovered, featuredProducts.length]);

    const currentDate = new Date().toUTCString();

    return (
        <div className="relative w-full">
            <div className="flex flex-col sm:flex-row border border-gray-200 pt-20">
                <div className="w-full sm:w-1/2 flex items-center justify-center py-12 px-4 sm:px-8 bg-gradient-to-br from-gray-50 to-indigo-50">
                    <motion.div className="text-gray-900 max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}>
                        <motion.div className="flex items-center gap-2 mb-4 text-xs sm:text-sm text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}>
                            <Clock size={14} />
                            <span>{currentDate}</span>
                        </motion.div>

                        <motion.div className="flex items-center gap-3 mb-4 sm:mb-6"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.8, delay: 0.2 }}>
                            <div className="h-px bg-indigo-200 flex-grow"></div>
                            <p className="font-medium text-xs sm:text-sm tracking-wider text-indigo-600">
                                OUR BESTSELLERS
                            </p>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={currentImageIndex}
                                className="font-serif text-2xl sm:text-4xl leading-snug sm:leading-tight mb-4 sm:mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}>
                                {featuredProducts[currentImageIndex].title}
                                <span className="block text-lg sm:text-2xl text-gray-500 mt-2">
                                    {featuredProducts[currentImageIndex].subtitle}
                                </span>
                            </motion.h1>
                        </AnimatePresence>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <HeroStats icon={ShoppingBag} label="Products" value="2000+" />
                            <HeroStats icon={Heart} label="Happy Customers" value="10k+" />
                        </div>
                    </motion.div>
                </div>

                <div className="w-full sm:w-1/2 relative overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={featuredProducts[currentImageIndex].image}
                            alt={featuredProducts[currentImageIndex].title}
                            className="w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[750px] object-cover"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.6 }}
                        />
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Hero;
