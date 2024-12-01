import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import { Facebook, Instagram, Twitter } from "lucide-react";

const FooterLink = ({ href, children }) => (
  <motion.li
    whileHover={{ x: 5 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <a
      href={href}
      className="text-gray-600 hover:text-black transition-colors duration-300"
    >
      {children}
    </a>
  </motion.li>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 pt-6 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <motion.img
              src={assets.logo}
              alt="Zero Fashion logo"
              className="w-16 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
            <p className="text-gray-600 mb-8 max-w-md">
              Welcome to Zero Fashion–where style meets sustainability. Discover
              trendy, eco-friendly apparel designed to elevate your wardrobe
              while caring for the planet.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-black"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-black"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-black"
              >
                <Twitter size={20} />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/about">About us</FooterLink>
              <FooterLink href="/TrackOrder">Delivery</FooterLink>
              <FooterLink href="/privacy-policy">Privacy policy</FooterLink>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <motion.span whileHover={{ x: 5 }} className="inline-block">
                  +91-9918572513
                </motion.span>
              </li>
              <li className="flex items-center">
                <motion.a
                  href="mailto:VipinYadav9m@gmail.com"
                  whileHover={{ x: 5 }}
                  className="inline-block text-gray-600 hover:text-black transition-colors duration-300"
                >
                  VipinYadav9m@gmail.com
                </motion.a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} zerofashion.vercel.app - All Rights Reserved.
            <span className="block sm:inline sm:ml-1">
              Designed by Vipin Yadav
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
