import { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { motion } from "framer-motion";

const ProfileInfo = () => {
    const { backendUrl } = useContext(ShopContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserDetails = async (authToken) => {
        if (!authToken) return;
        try {
            setLoading(true);
            const res = await fetch(`${backendUrl}/api/user/user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) throw new Error('Failed to fetch user details');
            const result = await res.json();
            if (result.success) {
                setUser(result.user);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && backendUrl) {
            getUserDetails(token);
        } else {
            setLoading(false);
        }
    }, [backendUrl]);
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="relative w-[320px] h-[480px] bg-black rounded-2xl shadow-2xl border border-white/10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-black">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-8">
                        <div className="w-24 h-24 rounded-full bg-white/5 animate-pulse"></div>
                        <div className="space-y-4 w-full">
                            <div className="h-6 bg-white/5 w-3/4 mx-auto rounded animate-pulse"></div>
                            <div className="h-4 bg-white/5 w-1/2 mx-auto rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (!user) {
        return (
            <motion.div 
                className="flex justify-center items-center min-h-screen bg-black p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="relative w-[320px] h-[480px] bg-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                        <h2 className="text-white/80 text-xl mb-4">No User Found</h2>
                        <p className="text-white/60 text-center mb-6">Please log in to view your profile</p>
                        <button 
                            onClick={() => window.location.href = '/login'}
                            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white/90 rounded-lg transition-all duration-300"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }
    return (
        <motion.div 
            className="flex justify-center items-center min-h-screen bg-white p-4 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <motion.div 
                    className="absolute -top-16 left-1/2 -translate-x-1/2 w-16 flex flex-col items-center"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <div className="w-8 h-4 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-t-lg flex items-center justify-center shadow-md">
                        <div className="w-4 h-2 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-sm border border-zinc-500/40 shadow-inner"></div>
                    </div>
                    <div className="relative w-12 h-24 mt-1 rounded-lg overflow-hidden shadow-lg border border-neutral-700">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(255,255,255,0.04)_2px,rgba(255,255,255,0.05)_4px)] opacity-50 pointer-events-none"></div>
                        <div className="w-full h-full bg-gradient-to-b from-neutral-700 via-neutral-800 to-neutral-900 flex items-center justify-center">
                            <span className="text-white/80 text-[10px] rotate-90 whitespace-nowrap tracking-widest font-semibold select-none">
                                ZERO FASHION
                            </span>
                        </div>
                    </div>
                </motion.div>
                <motion.div 
                    className="w-[320px] h-[480px] bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative w-full h-full flex flex-col items-center p-8">
                        <motion.div 
                            className="mb-12 mt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
                            <div className="relative h-32 w-32">
                                <motion.span 
                                    className="absolute top-0 left-0 text-7xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                >
                                    Z
                                </motion.span>
                                <motion.span 
                                    className="absolute top-6 left-8 text-7xl font-extrabold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                >
                                    E
                                </motion.span>
                                <motion.span 
                                    className="absolute top-12 left-16 text-7xl font-extrabold bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                >
                                    R
                                </motion.span>
                                <motion.span 
                                    className="absolute top-16 left-20 text-7xl font-extrabold bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                >
                                    O
                                </motion.span>
                            </div>
                            <div
                                className="absolute left-1/2 -translate-x-1/2 w-0 h-0
                                    border-l-[12px] border-l-transparent
                                    border-r-[12px] border-r-transparent
                                    border-b-[12px] border-b-white/20"
                            ></div>
                        </motion.div>
                        <motion.div 
                            className="relative w-28 h-28 rounded-full border-4 border-gradient-to-r from-white/40 to-white/20 overflow-hidden mb-6 shadow-lg"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {user.avatar ? (
                                <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-400 via-gray-500 to-black flex items-center justify-center">
                                    <span className="text-2xl text-white/70">{user.name?.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                        </motion.div>
                        <motion.div 
                            className="text-center space-y-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                        >
                            <h1 className="text-xl font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-wide">{user.name}</h1>
                            <p className="text-sm text-white/60 tracking-wider">{user.role || "MEMBER"}</p>
                            <p className="text-xs text-white/40 mt-4">{user.email}</p>
                        </motion.div>
                        <motion.div 
                            className="absolute bottom-4 left-0 w-full text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4, duration: 0.5 }}
                        >
                            <p className="text-sm bg-gradient-to-r from-white/40 to-white/20 bg-clip-text text-transparent tracking-widest">Zero Fashion</p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
export default ProfileInfo;