import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle,Shield } from "lucide-react";

const useTokenExpiration = (setToken) => {
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            // Optional: Add token expiration check if token includes expiry (e.g., JWT decode)
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
            // sessionStorage.removeItem("token");
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
                toast.success("Welcome back! Login successful!");
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
                return "border-[#ff6200]/50 focus:ring-[#ff6200] focus:border-[#ff6200]";
            }
            if (field === "password" && formData.password.length < 6) {
                return "border-[#ff6200]/50 focus:ring-[#ff6200] focus:border-[#ff6200]";
            }
        }
        return "border-[#939393]/20 focus:ring-[#ff6200] focus:border-[#ff6200]";
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-[#131313] px-4">
            <div className="flex overflow-hidden rounded-3xl shadow-2xl max-w-4xl w-full bg-gradient-to-br from-[#1a1a1a] to-[#131313] border border-[#939393]/20">
                {/* Left Panel - Decorative */}
                <div className="hidden lg:block lg:w-1/2 text-white p-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff6200]/10 to-[#131313] opacity-90"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">ZeroFashion Admin</h2>
                            <p className="text-[#939393] mb-8">
                                Manage your inventory, track orders, and boost your sales with our powerful admin dashboard.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-[#ff6200]/20 p-2 rounded-full">
                                    <Shield className="h-6 w-6 text-[#ff6200]" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Secure Access</h3>
                                    <p className="text-[#939393] text-sm">End-to-end encrypted connection</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-[#ff6200]/20 p-2 rounded-full">
                                    <LogIn className="h-6 w-6 text-[#ff6200]" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Easy Management</h3>
                                    <p className="text-[#939393] text-sm">Control your store from anywhere</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 p-8 lg:p-12">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-[#939393]">
                                Please enter your credentials to continue
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#939393]" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ff6200]">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("email")}
                                        className={`w-full pl-10 pr-3 py-3 bg-[#1a1a1a] text-white border rounded-xl shadow-sm focus:outline-none transition-all duration-300 hover:border-[#ff6200]/50 ${getInputErrorClass("email")}`}
                                        placeholder="admin@example.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {touched.email && !validateEmail(formData.email) && (
                                    <p className="text-[#ff6200] text-sm mt-1 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        Please enter a valid email address
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-[#939393]" htmlFor="password">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="text-sm text-[#ff6200] hover:text-[#ff4500] font-medium focus:outline-none transition-colors duration-300"
                                        onClick={() => toast.info("Contact your administrator to reset your password.")}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ff6200]">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        className={`w-full pl-10 pr-10 py-3 bg-[#1a1a1a] text-white border rounded-xl shadow-sm focus:outline-none transition-all duration-300 hover:border-[#ff6200]/50 ${getInputErrorClass("password")}`}
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#939393] hover:text-[#ff6200] focus:outline-none transition-colors duration-300"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {touched.password && formData.password.length < 6 && (
                                    <p className="text-[#ff6200] text-sm mt-1 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        Password must be at least 6 characters
                                    </p>
                                )}
                            </div>

                            {error && (
                                <div className="text-sm text-[#ff6200] bg-[#ff6200]/10 rounded-xl p-4 flex items-start">
                                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                className={`w-full py-3 px-4 rounded-xl text-white bg-[#ff6200] flex items-center justify-center space-x-2 transition-all duration-300 ${isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-[#ff4500] hover:shadow-[#ff6200]/50 hover:-translate-y-1 active:scale-[0.98]"}`}
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
                                <p className="text-sm text-[#939393] mt-6">
                                    Having trouble logging in?{" "}
                                    <button
                                        type="button"
                                        className="text-[#ff6200] hover:text-[#ff4500] font-medium focus:outline-none transition-colors duration-300"
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