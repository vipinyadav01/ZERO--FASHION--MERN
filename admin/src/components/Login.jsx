import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";

const useTokenExpiration = (setToken) => {
  useEffect(() => {
    // Clear any existing timeouts when the component mounts
    const existingToken = localStorage.getItem("token");
    if (existingToken) {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [setToken]);

  const setTokenWithExpiry = (token) => {
    localStorage.setItem("token", token);
    setToken(token);

    // Set timeout to clear token after 3 minutes
    setTimeout(() => {
      localStorage.removeItem("token");
      setToken(null);
      toast.info("Session expired. Please login again.");
    }, 3 * 60 * 1000); 
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
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

      if (response.data.success) {
        setTokenWithExpiry(response.data.token);
        toast.success("Welcome back! Login successful!");
        navigate("/add");
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
      if (field === 'email' && !validateEmail(formData.email)) {
        return 'border-red-500 focus:ring-red-500 focus:border-red-500';
      }
      if (field === 'password' && formData.password.length < 6) {
        return 'border-red-500 focus:ring-red-500 focus:border-red-500';
      }
    }
    return 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl px-8 py-8 w-full max-w-md transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to ZeroFashion</h1>
          <p className="text-gray-600">Please enter your credentials to login</p>
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
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm focus:outline-none ${getInputErrorClass('email')}`}
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>
            {touched.email && !validateEmail(formData.email) && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg shadow-sm focus:outline-none ${getInputErrorClass('password')}`}
                placeholder="••••••••"
                required
                disabled={isLoading}
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
            {touched.password && formData.password.length < 6 && (
              <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4 flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          <button
            className={`w-full py-2.5 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Login to AdminPanel</span>
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Having trouble logging in?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => toast.info("Please contact your administrator for assistance.")}
            >
              Get Help
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;