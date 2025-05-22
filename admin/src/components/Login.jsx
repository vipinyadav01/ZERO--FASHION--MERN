import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, Shield } from "lucide-react";

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
                return "border-red-400 focus:ring-red-400 focus:border-red-400";
            }
            if (field === "password" && formData.password.length < 6) {
                return "border-red-400 focus:ring-red-400 focus:border-red-400";
            }
        }
        return "border-gray-700 focus:ring-indigo-500 focus:border-indigo-500";
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 md:p-8">
            <div className="flex overflow-hidden rounded-3xl shadow-2xl max-w-5xl w-full bg-slate-800 border border-slate-700 backdrop-blur-sm">
                {/* Left Panel - Decorative */}
                <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-slate-900 text-white p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1887')] bg-cover bg-center opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 to-slate-900/90"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                                <span className="text-2xl font-bold text-white">ZF</span>
                            </div>
                            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">ZeroFashion Admin</h2>
                            <p className="text-slate-300 mb-8 text-lg">
                                Manage your inventory, track orders, and boost your sales with our powerful admin dashboard.
                            </p>
                        </div>
                        
                        <div className="space-y-6 backdrop-blur-sm bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50">
                            <div className="flex items-center space-x-4">
                                <div className="bg-indigo-500/20 p-3 rounded-xl">
                                    <Shield className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Secure Access</h3>
                                    <p className="text-slate-300 text-sm">End-to-end encrypted connection</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-500/20 p-3 rounded-xl">
                                    <LogIn className="h-6 w-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Easy Management</h3>
                                    <p className="text-slate-300 text-sm">Control your store from anywhere</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                Welcome Back
                            </h1>
                            <p className="text-slate-400 text-lg">
                                Please enter your credentials to continue
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("email")}
                                        className={`w-full pl-10 pr-3 py-3.5 bg-slate-700 text-white border rounded-xl outline-none transition-all duration-300 hover:bg-slate-600 ${getInputErrorClass("email")}`}
                                        placeholder="admin@example.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {touched.email && !validateEmail(formData.email) && (
                                    <p className="text-red-400 text-sm mt-1.5 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        Please enter a valid email address
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-slate-300" htmlFor="password">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium focus:outline-none transition-colors duration-300"
                                        onClick={() => toast.info("Contact your administrator to reset your password.")}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        className={`w-full pl-10 pr-10 py-3.5 bg-slate-700 text-white border rounded-xl outline-none transition-all duration-300 hover:bg-slate-600 ${getInputErrorClass("password")}`}
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-indigo-300 focus:outline-none transition-colors duration-300"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {touched.password && formData.password.length < 6 && (
                                    <p className="text-red-400 text-sm mt-1.5 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        Password must be at least 6 characters
                                    </p>
                                )}
                            </div>

                            {error && (
                                <div className="text-sm text-red-400 bg-red-400/10 rounded-xl p-4 flex items-start">
                                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                className={`w-full py-3.5 px-4 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg shadow-indigo-500/20 ${
                                    isLoading 
                                    ? "opacity-75 cursor-not-allowed" 
                                    : "hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]"
                                }`}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-5 w-5" />
                                        <span>Sign in to Dashboard</span>
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-slate-400 mt-6">
                                    Having trouble logging in?{" "}
                                    <button
                                        type="button"
                                        className="text-indigo-400 hover:text-indigo-300 font-medium focus:outline-none transition-colors duration-300"
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