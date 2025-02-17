import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock, Shield, AlertCircle } from "lucide-react";

const useTokenExpiration = (setToken) => {
    useEffect(() => {
        const existingToken = sessionStorage.getItem("token");
        if (existingToken) {
            sessionStorage.removeItem("token");
            setToken(null);
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
            sessionStorage.removeItem("token");
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

            if (response && response.data && response.data.success) {
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
                return "border-red-500 focus:ring-red-500 focus:border-red-500";
            }
            if (field === "password" && formData.password.length < 6) {
                return "border-red-500 focus:ring-red-500 focus:border-red-500";
            }
        }
        return "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500";
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 px-4">
            <div className="flex overflow-hidden rounded-2xl shadow-2xl max-w-4xl w-full">
                {/* Left Panel - Decorative */}
                <div className="hidden lg:block lg:w-1/2 bg-indigo-600 text-white p-12 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">ZeroFashion Admin</h2>
                            <p className="text-indigo-100 mb-8">
                                Manage your inventory, track orders, and boost your sales with our powerful admin dashboard.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Secure Access</h3>
                                    <p className="text-indigo-100 text-sm">End-to-end encrypted connection</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <LogIn className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-white">Easy Management</h3>
                                    <p className="text-indigo-100 text-sm">Control your store from anywhere</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600">
                                Please enter your credentials to continue
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label
                                    className="block text-sm font-medium text-gray-700"
                                    htmlFor="email"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("email")}
                                        className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none text-gray-700 ${getInputErrorClass(
                                            "email"
                                        )}`}
                                        placeholder="admin@example.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {touched.email && !validateEmail(formData.email) && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        Please enter a valid email address
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label
                                        className="block text-sm font-medium text-gray-700"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
                                        onClick={() =>
                                            toast.info("Contact your administrator to reset your password.")
                                        }
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        className={`w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm focus:outline-none text-gray-700 ${getInputErrorClass(
                                            "password"
                                        )}`}
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {touched.password && formData.password.length < 6 && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        Password must be at least 6 characters
                                    </p>
                                )}
                            </div>

                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4 flex items-start">
                                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                className={`w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${isLoading ? "opacity-75 cursor-not-allowed" : ""
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
                                <p className="text-sm text-gray-600 mt-6">
                                    Having trouble logging in?{" "}
                                    <button
                                        type="button"
                                        className="text-indigo-600 hover:text-indigo-700 font-medium focus:outline-none"
                                        onClick={() =>
                                            toast.info("Please contact your administrator for assistance.")
                                        }
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
