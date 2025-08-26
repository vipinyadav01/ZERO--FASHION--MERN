import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, Shield, Zap } from "lucide-react";

const useTokenExpiration = (setToken) => {
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            setToken(token); 
        }
    }, [setToken]);

    const setTokenWithExpiry = (token) => {
        sessionStorage.setItem("token", token);
        setToken(token);
    };

    return setTokenWithExpiry;
};

const Login = ({ setToken }) => {
    const navigate = useNavigate();
    const setTokenWithExpiry = useTokenExpiration(setToken);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({
        email: false,
        password: false,
    });

    useEffect(() => {
        const handleBeforeUnload = () => {
            // Optional: Only clear token on explicit logout, not refresh
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError(null);
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({
            ...prev,
            [field]: true,
        }));
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        setTouched({
            email: true,
            password: true,
        });

        if (!validateEmail(formData.email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/user/admin/login`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response?.data?.success) {
                setTokenWithExpiry(response.data.token);
                toast.success("Welcome back");
                navigate("/dashboard");
            } else {
                throw new Error(response.data.message || "Login failed");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getInputErrorClass = (field) => {
        if (touched[field]) {
            if (field === "email" && !validateEmail(formData.email)) {
                return "border-red-500/50 focus:ring-red-500/30 focus:border-red-500 bg-red-500/5";
            }
            if (field === "password" && formData.password.length < 6) {
                return "border-red-500/50 focus:ring-red-500/30 focus:border-red-500 bg-red-500/5";
            }
        }
        return "border-white/10 focus:ring-emerald-500/30 focus:border-emerald-400 bg-white/5 hover:bg-white/10";
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-black p-4 sm:p-6 md:p-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="flex overflow-hidden rounded-3xl shadow-2xl max-w-6xl w-full bg-white/5 backdrop-blur-xl border border-white/10 relative z-10">
                {/* Left Panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-black text-white p-12 relative overflow-hidden flex-col justify-between">
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_52%)]"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-300 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                            <img 
                                src="/logo.png" 
                                alt="ZeroFashion Logo" 
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                        </div>
                        
                        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            ZeroFashion
                        </h2>
                        <h3 className="text-2xl font-light mb-4 text-emerald-400">Admin Portal</h3>
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            Experience next-generation fashion management with our sophisticated admin dashboard. 
                            Streamline operations, analyze trends, and drive growth.
                        </p>
                    </div>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center space-x-4 group">
                            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 p-4 rounded-2xl border border-emerald-500/20 group-hover:border-emerald-400/40 transition-all duration-300">
                                <Shield className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Enterprise Security</h3>
                                <p className="text-gray-400 text-sm">Bank-grade encryption & protection</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 group">
                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-2xl border border-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300">
                                <Zap className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Lightning Fast</h3>
                                <p className="text-gray-400 text-sm">Real-time data & instant updates</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-bold text-white mb-4">
                                Welcome Back
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Sign in to continue to your dashboard
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("email")}
                                        className={`w-full pl-12 pr-4 py-4 bg-black/20 backdrop-blur-sm text-white border rounded-2xl outline-none transition-all duration-300 placeholder-gray-500 ${getInputErrorClass("email")}`}
                                        placeholder="admin@zerofashion.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {touched.email && !validateEmail(formData.email) && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center bg-red-500/10 rounded-lg p-2">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Please enter a valid email address
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-300" htmlFor="password">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="text-sm text-emerald-400 hover:text-emerald-300 font-medium focus:outline-none transition-colors duration-300"
                                        onClick={() => toast.info("Contact your administrator to reset your password.")}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-300">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        className={`w-full pl-12 pr-12 py-4 bg-black/20 backdrop-blur-sm text-white border rounded-2xl outline-none transition-all duration-300 placeholder-gray-500 ${getInputErrorClass("password")}`}
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-300 focus:outline-none transition-colors duration-300"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {touched.password && formData.password.length < 6 && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center bg-red-500/10 rounded-lg p-2">
                                        <AlertCircle className="h-4 w-4 mr-2" />
                                        Password must be at least 6 characters
                                    </p>
                                )}
                            </div>

                            {error && (
                                <div className="text-sm text-red-400 bg-red-500/10 backdrop-blur-sm rounded-2xl p-4 flex items-start border border-red-500/20">
                                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                className={`w-full py-4 px-6 rounded-2xl text-black bg-gradient-to-r from-white to-gray-200 flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg font-semibold ${
                                    isLoading 
                                    ? "opacity-75 cursor-not-allowed" 
                                    : "hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] hover:from-emerald-400 hover:to-emerald-300"
                                }`}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-t-2 border-b-2 border-black rounded-full animate-spin"></div>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-5 w-5" />
                                        <span>Sign in to Dashboard</span>
                                    </>
                                )}
                            </button>

                            <div className="text-center pt-6">
                                <p className="text-sm text-gray-400">
                                    Having trouble logging in?{" "}
                                    <button
                                        type="button"
                                        className="text-emerald-400 hover:text-emerald-300 font-medium focus:outline-none transition-colors duration-300"
                                        onClick={() => toast.info("Please contact your administrator for assistance.")}
                                    >
                                        Get Help
                                    </button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;