import React, { useState, useRef } from 'react';
import {
    FiHelpCircle,
    FiMail,
    FiMessageCircle,
    FiPhone,
    FiPlus,
    FiMinus,
    FiSend,
    FiClock,
    FiCheckCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Support = () => {
    const [activeTab, setActiveTab] = useState('faq');
    const [activeFaq, setActiveFaq] = useState(null);
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        category: '',
        description: '',
        priority: 'medium',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const formRef = useRef(null);

    const faqData = [
        {
            question: "How do I track my order?",
            answer: "You can track your order by going to 'My Orders' section and clicking on 'Track Order' button next to your order. You'll be able to see real-time updates about your package's location and estimated delivery date."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for most items. Products must be unused and in their original packaging. To initiate a return, go to 'My Orders' and select 'Return Item' next to the relevant order."
        },
        {
            question: "How can I change my delivery address?",
            answer: "If your order hasn't been shipped yet, you can modify the delivery address from 'My Orders'. For shipped orders, please contact our support team immediately for assistance."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and various digital payment methods including Apple Pay and Google Pay."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) is available for select locations. International shipping times vary by destination."
        }
    ];

    const supportCategories = [
        "Order Issues",
        "Payment Problems",
        "Product Inquiries",
        "Shipping Questions",
        "Returns & Refunds",
        "Technical Support",
        "Account Issues",
        "Other"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitSuccess(true);
            setTicketForm({
                subject: '',
                category: '',
                description: '',
                priority: 'medium',
                email: '',
            });
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error) {
            console.error('Error submitting ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTicketForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 mt-24 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
                    <p className="text-lg text-gray-600">
                        Get help with your orders, products, and account
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="flex space-x-4 bg-white rounded-lg p-1 shadow-sm">
                        <button
                            onClick={() => setActiveTab('faq')}
                            className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2
                ${activeTab === 'faq'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <FiHelpCircle />
                            FAQ
                        </button>
                        <button
                            onClick={() => setActiveTab('contact')}
                            className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2
                ${activeTab === 'contact'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <FiMessageCircle />
                            Contact Support
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'faq' ? (
                            <motion.div
                                key="faq"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                {faqData.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                                        >
                                            <span className="font-medium text-gray-900">{faq.question}</span>
                                            {activeFaq === index ? <FiMinus /> : <FiPlus />}
                                        </button>
                                        <AnimatePresence>
                                            {activeFaq === index && (
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: "auto" }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 py-4 text-gray-600 bg-gray-50">
                                                        {faq.answer}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="contact"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Subject
                                                </label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={ticketForm.subject}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Category
                                                </label>
                                                <select
                                                    name="category"
                                                    value={ticketForm.category}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="">Select a category</option>
                                                    {supportCategories.map(category => (
                                                        <option key={category} value={category}>
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                value={ticketForm.description}
                                                onChange={handleInputChange}
                                                required
                                                rows={4}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Priority
                                                </label>
                                                <select
                                                    name="priority"
                                                    value={ticketForm.priority}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={ticketForm.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`flex items-center gap-2 px-6 py-2 rounded-md text-white
                          ${isSubmitting
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-blue-500 hover:bg-blue-600'}`}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <FiClock className="animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiSend />
                                                        Submit Ticket
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Success Message */}
                                    <AnimatePresence>
                                        {submitSuccess && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700"
                                            >
                                                <FiCheckCircle />
                                                Your support ticket has been submitted successfully. We'll get back to you soon!
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Additional Contact Information */}
                                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                                        <FiPhone className="text-blue-500 text-xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Phone Support</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Available Mon-Fri, 9AM-6PM EST
                                                <br />
                                                1234567890
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                                        <FiMail className="text-blue-500 text-xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Email Support</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                24/7 Support
                                                <br />
                                                vipinxdev@gmail.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                                        <FiMessageCircle className="text-blue-500 text-xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Live Chat</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Available 24/7
                                                <br />
                                                Average response time: 5 minutes
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Support;
