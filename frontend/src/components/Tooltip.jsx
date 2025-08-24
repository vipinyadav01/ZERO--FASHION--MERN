import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const Tooltip = ({ text }) => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute left-1/2 -translate-x-1/2 font-['Asterion'] tracking-tight bottom-full mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg hidden group-hover:block whitespace-nowrap"
        >
            {text}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </motion.div>
    </AnimatePresence>
)
