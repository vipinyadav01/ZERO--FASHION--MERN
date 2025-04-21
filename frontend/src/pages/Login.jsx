import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="flex flex-col items-center space-y-2">
      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
      <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
    <div className="h-12 bg-gray-200 rounded-lg mt-6"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
  </div>
);

const Login = () => {
  const [authMode, setAuthMode] = useState("login");
  const { token, setToken, setUser, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
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
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userData");

    if (storedToken && !token) {
      setToken(storedToken);
    }

    if (storedUser && !token) {
      setUser(JSON.parse(storedUser));
    }

    if (token) {
      navigate("/");
    }

    setTimeout(() => setIsPageLoading(false), 600);
  }, [token, setToken, setUser, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!isLoginMode && !formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        // Store token and user data
        setToken(data.token);
        localStorage.setItem("token", data.token);
        
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("userData", JSON.stringify(data.user));
        }

        toast.success(
          isLoginMode 
            ? "Welcome back!" 
            : "Account created successfully!",
          {
            icon: "👋",
            position: "top-center",
            theme: "colored",
            style: {
              backgroundColor: "#4f46e5",
              color: "white",
            }
          }
        );
        navigate("/");
      } else {
        throw new Error(data.message || "Operation failed");
      }
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error.response) {
        if (error.response.status === 500) {
          message = "Server error. Please try again later.";
        } else if (error.response.status === 409) {
          message = "Email already exists. Please use a different email.";
        } else if (error.response.status === 401) {
          message = "Invalid email or password.";
        } else {
          message = error.response.data.message || message;
        }
      } else if (error.request) {
        message = "Unable to connect to server. Please check your connection.";
      }

      toast.error(message, {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
    setFormData({ name: "", email: "", password: "" });
    setErrors({ name: "", email: "", password: "" });
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Decorative header */}
          <div className="bg-indigo-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-indigo-100 mt-1">
              {isLoginMode 
                ? "Sign in to continue to your account" 
                : "Get started with your free account"}
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.name 
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                          : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none transition-colors`}
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      errors.email 
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none transition-colors`}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border ${
                      errors.password 
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none transition-colors`}
                    placeholder="••••••••"
                    autoComplete={isLoginMode ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-6 group"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {isLoginMode ? "Sign in" : "Sign up"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isLoginMode ? "New to our platform?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleAuthMode}
                className="w-full mt-6 flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {isLoginMode ? "Create new account" : "Sign in instead"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;