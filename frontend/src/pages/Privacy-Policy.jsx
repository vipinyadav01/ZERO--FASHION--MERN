import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-white py-12 pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.h1
                    className="text-3xl font-extrabold text-gray-900 text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Privacy Policy
                </motion.h1>

                <motion.div
                    className="bg-white shadow overflow-hidden sm:rounded-lg"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            1. Introduction
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Welcome to ZeroFashion&apos;s Privacy Policy. We respect your
                            privacy and are committed to protecting your personal data. This
                            privacy policy will inform you about how we look after your
                            personal data when you visit our website and tell you about your
                            privacy rights and how the law protects you.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white shadow overflow-hidden sm:rounded-lg mt-6"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            2. Data We Collect
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            We may collect, use, store and transfer different kinds of
                            personal data about you which we have grouped together as follows:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                            <li>
                                Identity Data: includes first name, last name, username or
                                similar identifier
                            </li>
                            <li>
                                Contact Data: includes billing address, delivery address, email
                                address and telephone numbers
                            </li>
                            <li>
                                Financial Data: includes payment card details (processed
                                securely by our payment providers)
                            </li>
                            <li>
                                Transaction Data: includes details about payments to and from
                                you and other details of products you have purchased from us
                            </li>
                            <li>
                                Technical Data: includes internet protocol (IP) address, your
                                login data, browser type and version, time zone setting and
                                location, browser plug-in types and versions, operating system
                                and platform, and other technology on the devices you use to
                                access this website
                            </li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white shadow overflow-hidden sm:rounded-lg mt-6"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            3. How We Use Your Data
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            We use your personal data for the following purposes:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                            <li>To process and deliver your order</li>
                            <li>To manage your relationship with us</li>
                            <li>
                                To improve our website, products/services, marketing or customer
                                relationships
                            </li>
                            <li>
                                To recommend products or services which may be of interest to
                                you
                            </li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white shadow overflow-hidden sm:rounded-lg mt-6"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            4. Payment Information
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            We offer various payment methods for your convenience:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                            <li>
                                Razorpay: When you pay using Razorpay, your payment information
                                is securely processed by Razorpay. We do not store your full
                                payment card details.
                            </li>
                            <li>
                                Stripe: Payments made through Stripe are securely handled by
                                their platform. We do not have access to your full payment card
                                information.
                            </li>
                            <li>
                                Cash on Delivery: For Cash on Delivery orders, we collect only
                                the necessary information to process your order and do not store
                                any payment information.
                            </li>
                        </ul>
                        <p className="mt-4 text-sm text-gray-600">
                            All online payments are encrypted using SSL technology. We
                            implement appropriate data collection, storage and processing
                            practices and security measures to protect against unauthorized
                            access, alteration, disclosure or destruction of your personal
                            information.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="bg-white shadow overflow-hidden sm:rounded-lg mt-6"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ duration: 0.5, delay: 1 }}
                >
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            5. Your Rights
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Under certain circumstances, you have rights under data protection
                            laws in relation to your personal data, including the right to:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                            <li>Request access to your personal data</li>
                            <li>Request correction of your personal data</li>
                            <li>Request erasure of your personal data</li>
                            <li>Object to processing of your personal data</li>
                            <li>Request restriction of processing your personal data</li>
                            <li>Request transfer of your personal data</li>
                            <li>Right to withdraw consent</li>
                        </ul>
                    </div>
                </motion.div>
                <motion.p
                    className="mt-8 mb-8 text-center text-sm text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                >
                    Last updated: {new Date().toLocaleDateString()}
                </motion.p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
