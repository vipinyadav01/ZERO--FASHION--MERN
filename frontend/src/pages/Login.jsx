import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, User } from "lucide-react";

const LoginSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
        <div className="space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);

const Login = () => {
    const [currentState, setCurrentState] = useState("Login");
    const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        password: "",
    });

    const validateForm = () => {
        let isValid = true;
        const errors = {
            name: "",
            email: "",
            password: "",
        };

        // Name validation (only for Sign Up)
        if (currentState === "Sign Up" && !formData.name.trim()) {
            errors.name = "Name is required";
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = "Please enter a valid email address";
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            errors.password = "Password is required";
            isValid = false;
        } else if (currentState === "Sign Up" && formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters long";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setFormErrors(prev => ({
            ...prev,
            [name]: ""
        }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const endpoint = currentState === "Sign Up"
                ? `${backendUrl}/api/user/register`
                : `${backendUrl}/api/user/login`;

            const payload = currentState === "Sign Up"
                ? formData
                : { email: formData.email, password: formData.password };

            const response = await axios.post(endpoint, payload, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                toast.success(currentState === "Sign Up"
                    ? "Account created successfully!"
                    : "Welcome back!");
                navigate("/");
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            let errorMessage = "Something went wrong. Please try again.";

            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data.message || errorMessage;

                // Handle specific error cases
                if (error.response.status === 409) {
                    errorMessage = "Email already exists. Please use a different email.";
                } else if (error.response.status === 401) {
                    errorMessage = "Invalid email or password.";
                }
            } else if (error.request) {
                // Request made but no response
                errorMessage = "Unable to connect to server. Please check your internet connection.";
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            navigate("/");
        }
        // Simulate loading delay
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [token, navigate]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!token && storedToken) {
            setToken(storedToken);
        }
    }, [token, setToken]);

    const toggleForm = () => {
        setCurrentState(prev => prev === "Login" ? "Sign Up" : "Login");
        setFormData({ name: "", email: "", password: "" });
        setFormErrors({ name: "", email: "", password: "" });
    };

    if (isPageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
                    <LoginSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentState === "Login" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <p className="text-gray-600">
                        {currentState === "Login"
                            ? "Please sign in to your account"
                            : "Sign up for a new account"}
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-6">
                    {currentState === "Sign Up" && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                                        } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {formErrors.name && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="your@email.com"
                            />
                        </div>
                        {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-10 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
                        </div>
                        {formErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                        )}
                    </div>

                    {currentState === "Login" && (
                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                {currentState === "Login" ? (
                                    <LogIn className="h-5 w-5" />
                                ) : (
                                    <UserPlus className="h-5 w-5" />
                                )}
                                <span>{currentState === "Login" ? "Sign In" : "Create Account"}</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        {currentState === "Login" ? (
                            <>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Sign up here
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Sign in here
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
