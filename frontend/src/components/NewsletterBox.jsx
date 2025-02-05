import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { Mail, Clock, Bell, X, Check, AlertCircle, Timer } from "lucide-react";

const animations = {
    container: {
        hidden: {
            opacity: 0,
            scale: 0.8,
            rotateX: 45
        },
        visible: {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.5
            }
        }
    },
    item: {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6
            }
        }
    },
    notification: {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    }
};

const CountdownTimer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(endTime).getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft("EXPIRED");
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return (
        <motion.div
            className="flex items-center gap-2 text-indigo-600 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <Timer size={16} />
            <span>{timeLeft}</span>
        </motion.div>
    );
};

const NewsletterBox = () => {
    const ref = useRef(null);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [notification, setNotification] = useState(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [isInView, controls]);

    const currentDate = "2025-02-05 17:37:19";
    const currentUser = "vipinyadav01";
    const saleEndTime = "2025-02-06 17:37:19"; // 24 hours from current time

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setStatus("loading");

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (email.includes("@")) {
                setStatus("success");
                showNotification("Successfully subscribed to newsletter!", "success");
                setEmail("");
            } else {
                throw new Error("Invalid email address");
            }
        } catch (error) {
            setStatus("error");
            showNotification(error.message, "error");
        }
    };

    return (
        <div className="relative min-h-1/2 flex items-center justify-center p-6" ref={ref}>
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        className={`absolute top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === "success" ? "bg-green-100" : "bg-red-100"
                            }`}
                        variants={animations.notification}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {notification.type === "success" ? (
                            <Check className="text-green-600" size={20} />
                        ) : (
                            <AlertCircle className="text-red-600" size={20} />
                        )}
                        <span className={notification.type === "success" ? "text-green-600" : "text-red-600"}>
                            {notification.message}
                        </span>
                        <button
                            onClick={() => setNotification(null)}
                            className="ml-2 hover:opacity-75"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial="hidden"
                animate={controls}
                variants={animations.container}
                className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full transform-gpu"
            >
                {/* Header */}
                <motion.div
                    variants={animations.item}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <motion.p variants={animations.item} className="text-3xl font-bold text-gray-800">
                            Limited-Time Sale!
                        </motion.p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={16} />
                            <span>{currentDate} UTC</span>
                        </div>
                    </div>

                    <motion.p variants={animations.item} className="text-lg text-gray-600 mb-4">
                        Save big on our hottest styles. Shop now before it's too late!
                    </motion.p>

                    <CountdownTimer endTime={saleEndTime} />
                </motion.div>

                {/* Subscription Form */}
                <motion.form
                    variants={animations.item}
                    onSubmit={onSubmitHandler}
                    className="mt-6 space-y-4"
                >
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === "loading"}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={status === "loading"}
                        className={`
                            w-full bg-indigo-600 text-white font-medium px-8 py-3 rounded-lg
                            transition-all duration-200 flex items-center justify-center gap-2
                            ${status === "loading" ? "opacity-75 cursor-not-allowed" : "hover:bg-indigo-700"}
                        `}
                    >
                        {status === "loading" ? (
                            <>
                                <motion.div
                                    className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <span>SUBSCRIBING...</span>
                            </>
                        ) : (
                            <>
                                <Bell size={20} />
                                <span>SUBSCRIBE NOW</span>
                            </>
                        )}
                    </motion.button>

                    <motion.p
                        variants={animations.item}
                        className="text-xs text-gray-500 text-center mt-4"
                    >
                        By subscribing, you agree to receive marketing communications from us.
                        <br />
                        You can unsubscribe at any time.
                    </motion.p>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default NewsletterBox;
