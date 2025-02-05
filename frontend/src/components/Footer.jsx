import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Heart,
    ArrowUp
} from "lucide-react";

const animations = {
    hover: {
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: {
        scale: 0.95
    },
    socialHover: {
        y: -3,
        scale: 1.1,
        transition: { type: "spring", stiffness: 400, damping: 10 }
    }
};
const FooterLink = memo(({ href, children, icon: Icon }) => (
    <motion.li
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
        <a
            href={href}
            className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2 group"
        >
            {Icon && <Icon size={16} className="group-hover:text-indigo-600" />}
            {children}
        </a>
    </motion.li>
));

const SocialIcon = memo(({ href, icon: Icon, label }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={animations.socialHover}
        whileTap={animations.tap}
        className="text-gray-400 hover:text-indigo-600 transition-colors duration-300"
        aria-label={label}
    >
        <Icon size={22} />
    </motion.a>
));

const ScrollToTop = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="Scroll to top"
        >
            <ArrowUp size={24} />
        </motion.button>
    );
};

const Newsletter = memo(() => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add newsletter subscription logic here
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 flex-grow"
                    required
                />
                <motion.button
                    type="submit"
                    whileHover={animations.hover}
                    whileTap={animations.tap}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                    Subscribe
                </motion.button>
            </form>
        </div>
    );
});

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const currentDate = new Date().toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const companyLinks = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us", icon: Heart },
        { href: "/TrackOrder", label: "Track Order", icon: MapPin },
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/faq", label: "FAQ" },
    ];

    const socialLinks = [
        { href: "#", icon: Facebook, label: "Facebook" },
        { href: "#", icon: Instagram, label: "Instagram" },
        { href: "#", icon: Twitter, label: "Twitter" },
        { href: "#", icon: Linkedin, label: "LinkedIn" },
        { href: "#", icon: Youtube, label: "YouTube" },
    ];

    return (
        <footer className="bg-gray-50 pt-12 pb-6 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <motion.img
                                src={assets.logo}
                                alt="Zero Fashion logo"
                                className="w-16"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            />
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                    ZERO FASHION
                                </span>
                                <span className="text-sm text-gray-500">
                                    Style Meets Sustainability
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
                            Welcome to Zero Fashion–where style meets sustainability. Discover
                            trendy, eco-friendly apparel designed to elevate your wardrobe
                            while caring for the planet. Join us in making fashion more
                            sustainable, one piece at a time.
                        </p>

                        <Newsletter />

                        <div className="flex space-x-4 mb-8">
                            {socialLinks.map((link) => (
                                <SocialIcon
                                    key={link.label}
                                    href={link.href}
                                    icon={link.icon}
                                    label={link.label}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Company</h3>
                        <ul className="space-y-3">
                            {companyLinks.map((link) => (
                                <FooterLink
                                    key={link.label}
                                    href={link.href}
                                    icon={link.icon}
                                >
                                    {link.label}
                                </FooterLink>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-center space-x-3">
                                <Phone size={16} className="text-indigo-600" />
                                <motion.span whileHover={{ x: 5 }} className="inline-block">
                                    +91-9918572513
                                </motion.span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={16} className="text-indigo-600" />
                                <motion.a
                                    href="mailto:VipinYadav9m@gmail.com"
                                    whileHover={{ x: 5 }}
                                    className="inline-block text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                                >
                                    VipinYadav9m@gmail.com
                                </motion.a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin size={16} className="text-indigo-600 mt-1" />
                                <motion.span whileHover={{ x: 5 }} className="inline-block">
                                    123 Fashion Street,
                                    <br />
                                    Design District, 12345
                                </motion.span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-500 mb-4 md:mb-0">
                            <p>&copy; {currentYear} zerofashion.vercel.app - All Rights Reserved.</p>
                            <p>Designed with <Heart size={12} className="inline text-red-500" /> by {" "}
                                <span className="text-indigo-600">vipinyadav01</span>
                            </p>
                        </div>
                        <div className="text-xs text-gray-400">
                            Last updated: {currentDate} UTC
                        </div>
                    </div>
                </div>
            </div>
            <ScrollToTop />
        </footer>
    );
};

export default memo(Footer);
