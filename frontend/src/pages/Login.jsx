import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";

const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
            ))}
        </div>
    </div>
);

const Login = () => {
    const [authMode, setAuthMode] = useState("login");
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
    });

    const isLoginMode = authMode === "login";

    useEffect(() => {
        if (token) {
            navigate("/");
        }

        // Check for stored token
        const storedToken = localStorage.getItem("token");
        if (!token && storedToken) {
            setToken(storedToken);
        }

        // Simulate initial loading
        setTimeout(() => setIsPageLoading(false), 600);
    }, [token, setToken, navigate]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: "", email: "", password: "" };

        // Name validation (only for signup)
        if (!isLoginMode && !formData.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (!isLoginMode && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const endpoint = isLoginMode
                ? `${backendUrl}/api/user/login`
                : `${backendUrl}/api/user/register`;

            const payload = isLoginMode
                ? { email: formData.email, password: formData.password }
                : formData;

            const { data } = await axios.post(endpoint, payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (data.success) {
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(isLoginMode ? "Welcome back!" : "Account created successfully!");
                navigate("/");
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            let message = "Something went wrong. Please try again.";

            if (error.response) {
                if (error.response.status === 409) {
                    message = "Email already exists. Please use a different email.";
                } else if (error.response.status === 401) {
                    message = "Invalid email or password.";
                } else {
                    message = error.response.data.message || message;
                }
            } else if (error.request) {
                message = "Unable to connect to server. Please check your connection.";
            }

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setAuthMode(prev => prev === "login" ? "signup" : "login");
        setFormData({ name: "", email: "", password: "" });
        setErrors({ name: "", email: "", password: "" });
    };

    if (isPageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                    <LoadingSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLoginMode ? "Welcome Back" : "Join Us"}
                        </h1>
                        <p className="text-gray-500">
                            {isLoginMode ? "Sign in to your account" : "Create a new account"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLoginMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                {isLoginMode && (
                                    <button
                                        type="button"
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-6 group"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                                    <span>Please wait...</span>
                                </>
                            ) : (
                                <>
                                    <span>{isLoginMode ? "Sign In" : "Create Account"}</span>
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                            {" "}
                            <button
                                type="button"
                                onClick={toggleAuthMode}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {isLoginMode ? "Sign up here" : "Sign in here"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
