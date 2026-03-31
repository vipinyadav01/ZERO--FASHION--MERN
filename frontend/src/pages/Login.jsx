import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Truck, RotateCcw, Shield, Zap } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-md p-8 bg-gray-100 rounded-lg animate-pulse space-y-6">
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-400 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Left Section - Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-accent flex-col justify-center items-start p-12 text-white relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full -ml-36 -mb-36"></div>
        
        <div className="relative z-10">
          {/* Logo Section */}
          <div className="mb-16">
            <div className="w-12 h-12 bg-white flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-brand-accent">Z</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight uppercase">ZERO Fashion</h2>
            <p className="text-white/80 mt-2 text-lg">Your Style, Your Way</p>
          </div>

          {/* Benefits List */}
          <div className="space-y-8 mb-16">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 border border-white/20 bg-white/5 backdrop-blur-md">
                  <Truck className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-wide">Fast Shipping</h3>
                <p className="text-white/70 mt-1">Free delivery on orders above ₹499</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 border border-white/20 bg-white/5 backdrop-blur-md">
                  <RotateCcw className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-wide">Easy Returns</h3>
                <p className="text-white/70 mt-1">30-day return policy, hassle-free</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 border border-white/20 bg-white/5 backdrop-blur-md">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-wide">Secure Payment</h3>
                <p className="text-white/70 mt-1">SSL encrypted, 100% safe transactions</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 border border-white/20 bg-white/5 backdrop-blur-md">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-wide">Exclusive Deals</h3>
                <p className="text-white/70 mt-1">Members get up to 50% off</p>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-white/60 mb-4 uppercase tracking-widest font-medium">Trusted by 1M+ customers</p>
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                  ★
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-12 bg-brand-bg">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Header Logo */}
          <div className="lg:hidden mb-8 flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-accent flex items-center justify-center">
              <span className="text-lg font-bold text-white">Z</span>
            </div>
            <span className="text-xl font-bold text-brand-text-primary tracking-tight">ZERO</span>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-text-primary mb-2 uppercase tracking-tight">
              {isLoginMode ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-brand-text-secondary">
              {isLoginMode 
                ? "Welcome back! Sign in to continue shopping" 
                : "Join millions of shoppers at ZERO Fashion"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-brand-text-primary mb-2 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-brand-text-secondary" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-none focus:outline-none focus:ring-1 transition-all ${
                      errors.name 
                        ? "border-red-500 focus:ring-red-100 bg-red-50" 
                        : "border-brand-border focus:ring-brand-accent focus:border-brand-accent bg-white"
                    } placeholder-brand-text-secondary`}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-text-primary mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-brand-text-secondary" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-none focus:outline-none focus:ring-1 transition-all ${
                    errors.email 
                      ? "border-red-500 focus:ring-red-100 bg-red-50" 
                      : "border-brand-border focus:ring-brand-accent focus:border-brand-accent bg-white"
                  } placeholder-brand-text-secondary`}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-brand-text-primary uppercase tracking-wide">
                  Password
                </label>
                {isLoginMode && (
                  <button
                    type="button"
                    className="text-sm text-brand-text-secondary hover:text-brand-text-primary font-medium transition"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-brand-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-11 py-3 border rounded-none focus:outline-none focus:ring-1 transition-all ${
                    errors.password 
                      ? "border-red-500 focus:ring-red-100 bg-red-50" 
                      : "border-brand-border focus:ring-brand-accent focus:border-brand-accent bg-white"
                  } placeholder-brand-text-secondary`}
                  placeholder="••••••••"
                  autoComplete={isLoginMode ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-brand-text-secondary hover:text-brand-text-primary transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 mt-8 bg-brand-accent text-white font-semibold rounded-none hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-brand-accent flex items-center justify-center space-x-2 uppercase tracking-widest text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLoginMode ? "Sign In" : "Create Account"}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-8 mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-brand-bg text-brand-text-secondary uppercase tracking-widest text-[10px] font-bold">
                {isLoginMode ? "New customer?" : "Have an account?"}
              </span>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            type="button"
            onClick={toggleAuthMode}
            className="w-full py-4 px-4 border border-brand-border text-brand-text-primary font-semibold rounded-none hover:bg-brand-surface transition-all focus:outline-none focus:ring-1 focus:ring-brand-accent uppercase tracking-widest text-sm"
          >
            {isLoginMode ? "Create new account" : "Sign in instead"}
          </button>

          {/* Footer Text */}
          <p className="mt-8 text-center text-[10px] text-brand-text-secondary uppercase tracking-widest">
            By continuing, you agree to our{" "}
            <button className="text-brand-text-primary hover:underline font-bold">Terms of Service</button>
            {" "}and{" "}
            <button className="text-brand-text-primary hover:underline font-bold">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;