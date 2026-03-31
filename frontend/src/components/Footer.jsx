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
import axios from "axios";

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
        whileHover={{ x: 6 }} 
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
        <a
            href={href}
            className="text-stone-700 hover:text-stone-900 transition-colors duration-300 flex items-center gap-2 group font-medium" // Darker initial text, bolder hover
        >
            {Icon && <Icon size={16} className="text-stone-600 group-hover:text-stone-900 transition-colors duration-300" />} {/* Icon color adjusted */}
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
        className="text-brand-text-secondary hover:text-brand-text-primary transition-colors duration-300 p-3 bg-brand-surface border border-brand-border hover:bg-white hover:shadow-sm" // Minimalist palette
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
            className="fixed bottom-24 md:bottom-10 right-4 md:right-8 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 text-white p-3.5 rounded-xl shadow-xl z-50 border border-stone-600" // Elevated position, stronger gradient & shadow
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="Scroll to top"
        >
            <ArrowUp size={22} />
        </motion.button>
    );
};

const Newsletter = memo(() => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api/newsletter/subscribe`,
                { email }
            );
            if (response.data.success) {
                alert("Subscribed successfully! Check your email.");
            } else {
                alert(response.data.message || "Subscription failed.");
            }
        } catch (error) {
            alert("Failed to subscribe. Please try again later.");
        }
        e.target.reset();
    };

    return (
        <div className="mb-8 max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-brand-text-primary">Subscribe to Our Newsletter</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-3.5 rounded-none border border-brand-border focus:outline-none focus:ring-1 focus:ring-brand-accent flex-grow bg-white text-brand-text-primary placeholder-brand-text-secondary transition-all duration-300"
                    required
                    name="email"
                />
                <motion.button
                    type="submit"
                    whileHover={animations.hover}
                    whileTap={animations.tap}
                    className="bg-brand-accent text-white px-8 py-3.5 rounded-none hover:bg-black transition-all duration-300 font-semibold shadow-none uppercase text-xs tracking-wider" // Bloom style buttons are often flat and sharp
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
    const currentUTCTime = new Date().toLocaleString('en-US', {
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
        { href: "/track-order", label: "Track Order", icon: MapPin },
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
        <footer className="bg-gradient-to-b from-white to-stone-50 pt-16 pb-32 md:pb-12 relative border-t border-stone-100"> 
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-12"> 
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <div className="flex items-center space-x-4 mb-6">
                            <motion.img
                                src={assets.logo}
                                alt="Zero Fashion logo"
                                className="w-14 sm:w-18" 
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            />
                            <div className="flex flex-col">
                                <span className="text-lg sm:text-xl font-bold text-brand-text-primary tracking-tight">
                                    ZERO
                                </span>
                                <span className="text-[10px] sm:text-xs text-brand-text-secondary tracking-widest -mt-1 uppercase">
                                    FASHION
                                </span>
                            </div>
                        </div>

                        <p className="text-brand-text-secondary mb-8 sm:mb-10 max-w-md leading-relaxed text-sm sm:text-base">
                            Welcome to Zero Fashion–where style meets sustainability. Discover
                            trendy, eco-friendly apparel designed to elevate your wardrobe
                            while caring for the planet. Join us in making fashion more
                            sustainable, one piece at a time.
                        </p>

                        <Newsletter />

                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-6">
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
                        <h3 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-7 text-brand-text-primary">Company</h3>
                        <ul className="space-y-3 sm:space-y-4">
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
                        <h3 className="text-lg sm:text-xl font-semibold mb-5 sm:mb-7 text-brand-text-primary">Get in Touch</h3>
                        <ul className="space-y-4 sm:space-y-5 text-brand-text-secondary"> 
                            <li className="flex items-center gap-4">
                                <div className="p-2.5 bg-brand-surface rounded-none flex-shrink-0 border border-brand-border">
                                    <Phone size={15} className="text-brand-text-primary" />
                                </div>
                                <motion.span whileHover={{ x: 5 }} className="inline-block font-medium text-sm sm:text-base">
                                    +91-9918572513
                                </motion.span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="p-2.5 bg-brand-surface rounded-none flex-shrink-0 border border-brand-border">
                                    <Mail size={15} className="text-brand-text-primary" />
                                </div>
                                <a
                                    href="mailto:VipinYadav9m@gmail.com"
                                    whileHover={{ x: 5 }}
                                    className="inline-block text-brand-text-secondary hover:text-brand-text-primary transition-colors duration-300 font-medium text-sm sm:text-base break-all"
                                >
                                    VipinYadav9m@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2.5 bg-brand-surface rounded-none flex-shrink-0 border border-brand-border">
                                    <MapPin size={15} className="text-brand-text-primary mt-0.5" />
                                </div>
                                <motion.span whileHover={{ x: 5 }} className="inline-block font-medium text-sm sm:text-base">
                                    123 Fashion Street,
                                    <br />
                                    Design District, 12345, India
                                </motion.span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-brand-border pt-6 sm:pt-8 mt-8">
                    <div className="bg-brand-surface p-4 sm:p-5 rounded-none border border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-xs sm:text-sm text-stone-600 text-center sm:text-left">
                            <p className="font-medium mb-1">&copy; {currentYear} zerofashion.vercel.app - All Rights Reserved.</p>
                            <p className="flex items-center justify-center sm:justify-start gap-1">Designed with <Heart size={12} className="inline text-red-500" /> by {" "}
                                <span className="text-stone-800 font-semibold">vipinyadav01</span>
                            </p>
                        </div>
                        <div className="text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium border border-stone-200 shadow-sm"> {/* Refined last updated badge */}
                            Last updated: {currentUTCTime.split(',')[0]} UTC
                        </div>
                    </div>
                </div>
            </div>
            <ScrollToTop />
        </footer>
    );
};

export default memo(Footer);