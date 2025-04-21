import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HeroStats = ({ icon: Icon, label, value }) => (
    <motion.div
        className="flex items-center gap-3 rounded-full px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, transition: { type: "spring", stiffness: 400 } }}
    >
        <div className="rounded-full bg-gray-100 p-2">
            <Icon className="w-4 h-4 text-black" />
        </div>
        <div className="text-sm">
            <span className="font-semibold text-black">{value}</span>
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
        <div className="relative w-full overflow-hidden lg:pt-20  sm:pt-12">
            <div className="absolute top-0 left-0 w-full h-full bg-white" style={{ zIndex: -1 }} />
            <div className="flex flex-col lg:flex-row">
                {/* Left content section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white">
                    <motion.div
                        className="text-black max-w-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs rounded-full bg-gray-200 text-black"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Clock size={12} />
                            <span className="tracking-wide font-medium">NEW COLLECTION</span>
                        </motion.div>

                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={currentImageIndex}
                                className="font-sans text-4xl lg:text-5xl font-bold leading-tight mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {featuredProducts[currentImageIndex].title}
                                <motion.span
                                    className="block text-xl lg:text-2xl text-gray-700 mt-2 font-normal"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {featuredProducts[currentImageIndex].subtitle}
                                </motion.span>
                            </motion.h1>
                        </AnimatePresence>

                        <motion.p
                            className="text-gray-600 mb-8 max-w-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Discover our curated selection of premium designs that combine style, comfort, and sustainability.
                        </motion.p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <motion.button
                                className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-900 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Shop Now <ArrowRight size={16} />
                            </motion.button>

                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <HeroStats icon={ShoppingBag} label="Products" value="2000+" />
                            <HeroStats icon={Heart} label="Happy Customers" value="10k+" />
                        </div>
                    </motion.div>
                </div>

                {/* Right image section */}
                <div
                    className="w-full lg:w-1/2 relative overflow-hidden"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            className="relative w-full h-[350px] sm:h-[400px] lg:h-screen max-h-[600px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.img
                                src={featuredProducts[currentImageIndex].image}
                                alt={featuredProducts[currentImageIndex].title}
                                className="w-full h-full object-cover"
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 1.1 }}
                                transition={{ duration: 0.8 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        {featuredProducts.map((_, idx) => (
                                            <motion.button
                                                key={idx}
                                                className={`w-12 h-1 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                whileHover={{ scaleX: 1.2 }}
                                                whileTap={{ scale: 0.95 }}
                                            />
                                        ))}
                                    </div>

                                    <motion.div
                                        className="flex items-center gap-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <motion.button
                                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentImageIndex(prev => prev === 0 ? featuredProducts.length - 1 : prev - 1)}
                                        >
                                            <ArrowRight className="w-5 h-5 text-white rotate-180" />
                                        </motion.button>

                                        <motion.button
                                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentImageIndex(prev => (prev === featuredProducts.length - 1 ? 0 : prev + 1))}
                                        >
                                            <ArrowRight className="w-5 h-5 text-white" />
                                        </motion.button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Hero;
