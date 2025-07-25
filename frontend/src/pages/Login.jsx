import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="flex flex-col items-center space-y-3">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-stone-200 to-stone-300"></div>
      <div className="h-7 bg-gradient-to-r from-stone-200 to-stone-300 rounded-lg w-3/4"></div>
      <div className="h-4 bg-stone-200 rounded w-1/2"></div>
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-stone-200 rounded w-1/3"></div>
          <div className="h-12 bg-gradient-to-r from-stone-100 to-stone-200 rounded-xl"></div>
        </div>
      ))}
    </div>
    <div className="h-12 bg-gradient-to-r from-stone-800 to-stone-900 rounded-xl mt-6"></div>
    <div className="h-4 bg-stone-200 rounded w-1/2 mx-auto"></div>
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
              backgroundColor: "#1c1917",
              color: "white",
              fontFamily: "Outfit",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
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
        style: {
          backgroundColor: "#dc2626",
          color: "white",
          fontFamily: "Outfit",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
        }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50 p-4">
        <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-stone-200/50">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-stone-100 to-amber-50 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-stone-200/30 to-amber-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-stone-300/20 to-stone-100/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-amber-100/20 rounded-full blur-xl"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-stone-200/50 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] group">
          {/* Modern header with gradient */}
          <div className="relative bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-8 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-stone-200 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-stone-800" />
              </div>
              <h1 className="text-2xl font-bold text-white font-outfit">
                {isLoginMode ? "Welcome Back" : "Join Us"}
              </h1>
              <p className="text-stone-300 mt-2 text-sm">
                {isLoginMode 
                  ? "Continue your fashion journey" 
                  : "Begin your style adventure"}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLoginMode && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-stone-600">
                      <User className="h-5 w-5 text-stone-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-12 pr-4 py-4 border-2 ${
                        errors.name 
                          ? "border-red-300 focus:ring-red-100 focus:border-red-400 bg-red-50/50" 
                          : "border-stone-200 focus:ring-amber-50 focus:border-stone-400 bg-stone-50/50 focus:bg-white"
                      } rounded-xl shadow-sm placeholder-stone-400 focus:outline-none transition-all duration-300 hover:border-stone-300 font-outfit`}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-stone-600">
                    <Mail className="h-5 w-5 text-stone-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-4 py-4 border-2 ${
                      errors.email 
                        ? "border-red-300 focus:ring-red-100 focus:border-red-400 bg-red-50/50" 
                        : "border-stone-200 focus:ring-amber-50 focus:border-stone-400 bg-stone-50/50 focus:bg-white"
                    } rounded-xl shadow-sm placeholder-stone-400 focus:outline-none transition-all duration-300 hover:border-stone-300 font-outfit`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-stone-700">
                    Password
                  </label>
                  {isLoginMode && (
                    <button
                      type="button"
                      className="text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors duration-200"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-stone-600">
                    <Lock className="h-5 w-5 text-stone-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-12 py-4 border-2 ${
                      errors.password 
                        ? "border-red-300 focus:ring-red-100 focus:border-red-400 bg-red-50/50" 
                        : "border-stone-200 focus:ring-amber-50 focus:border-stone-400 bg-stone-50/50 focus:bg-white"
                    } rounded-xl shadow-sm placeholder-stone-400 focus:outline-none transition-all duration-300 hover:border-stone-300 font-outfit`}
                    placeholder="Enter your password"
                    autoComplete={isLoginMode ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors hover:text-stone-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-stone-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-stone-400" />
                    )}
                  </button>
                  {errors.password && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-stone-800 via-stone-900 to-stone-950 hover:from-stone-900 hover:via-stone-950 hover:to-black focus:outline-none focus:ring-4 focus:ring-stone-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-8 group transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <span>{isLoginMode ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-stone-500 font-medium">
                    {isLoginMode ? "New to ZERO Fashion?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleAuthMode}
                className="w-full mt-6 flex justify-center items-center py-3 px-6 border-2 border-stone-200 rounded-xl shadow-sm text-sm font-semibold text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-300 focus:outline-none focus:ring-4 focus:ring-stone-100 transition-all duration-300 group transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{isLoginMode ? "Create new account" : "Sign in instead"}</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;