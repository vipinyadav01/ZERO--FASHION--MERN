import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { Clock, Users, Award, Leaf, Target, Heart, ChevronDown, Mail } from "lucide-react";

// Animation variants
const animations = {
    fadeIn: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    },
    stagger: {
        visible: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    },
    scale: {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
    }
};

// Stats data
const companyStats = [
    { value: "50K+", label: "Happy Customers", icon: Users },
    { value: "1000+", label: "Products", icon: Award },
    { value: "98%", label: "Satisfaction Rate", icon: Heart },
    { value: "24/7", label: "Support", icon: Mail }
];

const About = () => {
    const [expandedSection, setExpandedSection] = useState(null);
    const currentDate = "2025-02-05 17:26:08";
    const currentUser = "vipinyadav01";

    const milestones = [
        { year: 2020, title: "Founded", description: "Zero Fashion was established" },
        { year: 2021, title: "Expansion", description: "Launched sustainable collection" },
        { year: 2022, title: "Growth", description: "Reached 50,000 customers" },
        { year: 2023, title: "Innovation", description: "Introduced eco-friendly packaging" }
    ];

    const values = [
        {
            title: "Sustainability",
            description: "Our commitment to eco-friendly fashion and sustainable practices.",
            icon: Leaf,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Quality",
            description: "Rigorous quality control for long-lasting fashion pieces.",
            icon: Award,
            color: "bg-indigo-100 text-indigo-600"
        },
        {
            title: "Innovation",
            description: "Continuously evolving with sustainable fashion technology.",
            icon: Target,
            color: "bg-purple-100 text-purple-600"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto py-16">
            {/* Header Section with Current Time */}
            <motion.div
                className="text-center mb-8"
                variants={animations.fadeIn}
                initial="hidden"
                animate="visible"
            >
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock size={16} />
                    <span>{currentDate} UTC</span>
                </div>
                <Title text1="ABOUT" text2="US" accent="gradient" size="xl" />
            </motion.div>

            {/* Main Content Section */}
            <motion.div
                className="my-16 flex flex-col md:flex-row gap-16 items-center"
                variants={animations.fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <motion.div className="relative w-full md:max-w-[450px]">
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="rounded-lg shadow-xl"
                        src={assets.about_img}
                        alt="About Zero Fashion"
                    />
                    <motion.div
                        className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg"
                        whileHover={{ scale: 1.1 }}
                    >
                        <p className="text-sm font-medium text-gray-600">
                            Designed by {currentUser}
                        </p>
                    </motion.div>
                </motion.div>

                <div className="flex flex-col justify-center gap-6 md:w-2/4">
                    {/* Company Stats */}
                    <motion.div
                        className="grid grid-cols-2 gap-4 mb-6"
                        variants={animations.stagger}
                        initial="hidden"
                        animate="visible"
                    >
                        {companyStats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                variants={animations.scale}
                                whileHover={{ scale: 1.05 }}
                            >
                                <stat.icon className="w-6 h-6 text-indigo-600 mb-2" />
                                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* About Text */}
                    <motion.div
                        variants={animations.fadeIn}
                        className="space-y-6 text-gray-700"
                    >
                        <p className="leading-relaxed">
                            Welcome to Zero Fashion — where style meets sustainability. We are
                            an eco-conscious fashion brand dedicated to bringing you the latest
                            trends with zero compromise on quality and the environment.
                        </p>
                        <p className="leading-relaxed">
                            Our journey started with a simple vision: to make fashion accessible
                            without the heavy environmental cost. We partner with ethical
                            manufacturers and use responsibly sourced materials.
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Timeline Section */}
            <motion.div
                className="my-20"
                variants={animations.fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
            >
                <Title text1="OUR" text2="JOURNEY" accent="indigo" className="mb-12" />
                <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200" />
                    {milestones.map((milestone, index) => (
                        <motion.div
                            key={index}
                            className={`flex items-center mb-8 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                                }`}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <div className="w-1/2 px-4">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <div className="text-2xl font-bold text-indigo-600">
                                        {milestone.year}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {milestone.title}
                                    </h3>
                                    <p className="text-gray-600">{milestone.description}</p>
                                </div>
                            </div>
                            <div className="w-4 h-4 bg-indigo-600 rounded-full absolute left-1/2 transform -translate-x-1/2" />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Values Section */}
            <motion.div
                className="my-20"
                variants={animations.fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.6 }}
            >
                <Title text1="OUR" text2="VALUES" accent="purple" className="mb-12" />
                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-lg shadow-lg p-6"
                            whileHover={{ scale: 1.03 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className={`p-3 rounded-full w-fit ${value.color} mb-4`}>
                                <value.icon size={24} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                            <p className="text-gray-600">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
                className="my-20"
                variants={animations.fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
            >
                <Title text1="FREQUENTLY" text2="ASKED QUESTIONS" accent="indigo" className="mb-12" />
                <div className="space-y-4">
                    {[
                        {
                            question: "What makes Zero Fashion sustainable?",
                            answer: "We use eco-friendly materials and ethical manufacturing processes..."
                        },
                        {
                            question: "How do you ensure quality?",
                            answer: "Every piece undergoes rigorous quality checks..."
                        },
                        {
                            question: "What is your return policy?",
                            answer: "We offer hassle-free returns within 30 days..."
                        }
                    ].map((faq, index) => (
                        <motion.div
                            key={index}
                            className="border border-gray-200 rounded-lg"
                            initial={false}
                        >
                            <motion.button
                                className="w-full px-6 py-4 flex items-center justify-between text-left"
                                onClick={() => setExpandedSection(
                                    expandedSection === index ? null : index
                                )}
                            >
                                <span className="font-semibold">{faq.question}</span>
                                <ChevronDown
                                    className={`transform transition-transform ${expandedSection === index ? "rotate-180" : ""
                                        }`}
                                />
                            </motion.button>
                            <AnimatePresence>
                                {expandedSection === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-4 text-gray-600">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Newsletter Section */}
            <motion.div
                variants={animations.fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 1 }}
            >
                <NewsletterBox />
            </motion.div>
        </div>
    );
};

export default About;
