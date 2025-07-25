import { memo } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
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
            className="text-stone-600 hover:text-stone-900 transition-colors duration-300 flex items-center gap-2 group font-medium"
        >
            {Icon && <Icon size={16} className="group-hover:text-stone-900" />}
            {children}
        </a>
    </motion.li>
));

FooterLink.displayName = "FooterLink";
FooterLink.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    icon: PropTypes.elementType,
};

const SocialIcon = memo(({ href, icon: Icon, label }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={animations.socialHover}
        whileTap={animations.tap}
        className="text-stone-500 hover:text-stone-900 transition-colors duration-300 p-3 bg-stone-50 rounded-xl border border-stone-200 hover:bg-stone-100 hover:shadow-md"
        aria-label={label}
    >
        <Icon size={20} />
    </motion.a>
));

SocialIcon.displayName = "SocialIcon";
SocialIcon.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
};

const ScrollToTop = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <motion.button
            onClick={scrollToTop}
            className="fixed bottom-20 md:bottom-8 right-4 md:right-8 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 text-white p-3 rounded-xl shadow-lg z-50 border border-stone-200"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="Scroll to top"
        >
            <ArrowUp size={20} />
        </motion.button>
    );
};

const Newsletter = memo(() => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add newsletter subscription logic here
    };

    return (
        <div className="mb-8 max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-stone-900 font-outfit">Subscribe to Our Newsletter</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-3 rounded-xl border-2 border-stone-200 focus:outline-none focus:ring-4 focus:ring-stone-100 focus:border-stone-400 flex-grow bg-stone-50 text-stone-800 placeholder-stone-500 font-outfit transition-all duration-300"
                    required
                />
                <motion.button
                    type="submit"
                    whileHover={animations.hover}
                    whileTap={animations.tap}
                    className="bg-gradient-to-r from-stone-800 via-stone-900 to-stone-950 text-white px-6 py-3 rounded-xl hover:from-stone-900 hover:to-black transition-all duration-300 font-semibold shadow-lg"
                >
                    Subscribe
                </motion.button>
            </form>
        </div>
    );
});

Newsletter.displayName = "Newsletter";

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
        { href: "/support", label: "FAQ" },
    ];

    const socialLinks = [
        { href: "#", icon: Facebook, label: "Facebook" },
        { href: "#", icon: Instagram, label: "Instagram" },
        { href: "#", icon: Twitter, label: "Twitter" },
        { href: "#", icon: Linkedin, label: "LinkedIn" },
        { href: "#", icon: Youtube, label: "YouTube" },
    ];

    return (
        <footer className="bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50 pt-16 pb-32 md:pb-8 relative">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <motion.img
                                src={assets.logo}
                                alt="Zero Fashion logo"
                                className="w-12 sm:w-16"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            />
                            <div className="flex flex-col">
                                <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-stone-800 to-stone-950 font-outfit">
                                    ZERO FASHION
                                </span>
                                <span className="text-xs sm:text-sm text-stone-600 font-medium">
                                    Style Meets Sustainability
                                </span>
                            </div>
                        </div>

                        <p className="text-stone-700 mb-6 sm:mb-8 max-w-md leading-relaxed font-outfit text-sm sm:text-base">
                            Welcome to Zero Fashion–where style meets sustainability. Discover
                            trendy, eco-friendly apparel designed to elevate your wardrobe
                            while caring for the planet. Join us in making fashion more
                            sustainable, one piece at a time.
                        </p>

                        <Newsletter />

                        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
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

                    <div className="order-2 sm:order-none">
                        <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-stone-900 font-outfit">Company</h3>
                        <ul className="space-y-2 sm:space-y-3">
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

                    <div className="order-3 sm:order-none">
                        <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-stone-900 font-outfit">Get in Touch</h3>
                        <ul className="space-y-3 sm:space-y-4 text-stone-700">
                            <li className="flex items-center space-x-3">
                                <div className="p-2 bg-stone-200 rounded-lg flex-shrink-0">
                                    <Phone size={14} className="text-stone-800 sm:w-4 sm:h-4" />
                                </div>
                                <motion.span whileHover={{ x: 5 }} className="inline-block font-medium text-sm sm:text-base">
                                    +91-9918572513
                                </motion.span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <div className="p-2 bg-stone-200 rounded-lg flex-shrink-0">
                                    <Mail size={14} className="text-stone-800 sm:w-4 sm:h-4" />
                                </div>
                                <motion.a
                                    href="mailto:VipinYadav9m@gmail.com"
                                    whileHover={{ x: 5 }}
                                    className="inline-block text-stone-700 hover:text-stone-900 transition-colors duration-300 font-medium text-sm sm:text-base break-all"
                                >
                                    VipinYadav9m@gmail.com
                                </motion.a>
                            </li>
                            <li className="flex items-start space-x-3">
                                <div className="p-2 bg-stone-200 rounded-lg flex-shrink-0">
                                    <MapPin size={14} className="text-stone-800 mt-0.5 sm:w-4 sm:h-4" />
                                </div>
                                <motion.span whileHover={{ x: 5 }} className="inline-block font-medium text-sm sm:text-base">
                                    123 Fashion Street,
                                    <br />
                                    Design District, 12345
                                </motion.span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-200 pt-6 sm:pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-xs sm:text-sm text-stone-600 text-center sm:text-left">
                            <p className="font-medium mb-1">&copy; {currentYear} zerofashion.vercel.app - All Rights Reserved.</p>
                            <p className="flex items-center justify-center sm:justify-start gap-1">Designed with <Heart size={12} className="inline text-red-500" /> by {" "}
                                <span className="text-stone-800 font-semibold">vipinyadav01</span>
                            </p>
                        </div>
                        <div className="text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-lg whitespace-nowrap">
                            Last updated: {currentDate.split(',')[0]} UTC
                        </div>
                    </div>
                </div>
            </div>
            <ScrollToTop />
        </footer>
    );
};

export default memo(Footer);
