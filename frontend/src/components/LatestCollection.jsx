import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(() => {
        setLatestProducts(products.slice(0, 10));
    }, [products]);
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
            },
        },
    };
    return (
        <section className="py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10 sm:mb-12"
                >
                    <Title text1={"Latest"} text2={"Collections"} />
                    <p className="mt-2 max-w-xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                        Explore our newest arrivals – fresh, bold, and designed for the trendsetters.
                    </p>
                </motion.div>

                {/* Products Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
                >
                    {latestProducts.map((item, index) => (
                        <motion.div
                            key={item._id || index}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="bg-white  shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
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
                                imageClassName="w-full h-48 sm:h-56 md:h-64 object-cover"
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {latestProducts.length === 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-gray-500 mt-12 text-sm sm:text-base"
                    >
                        No new collections available yet. Stay tuned!
                    </motion.p>
                )}
            </div>
        </section>
    );
};
export default LatestCollection;
