import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../constants";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, Shield } from "lucide-react";
import logo from "../assets/logo.png";

const Login = ({ setToken }) => {
    const navigate = useNavigate();
    
    // Internal state for managing token with expiry logic
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

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) setError(null);
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

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
            const response = await axios.post(`${backendUrl}/api/user/admin-login`, formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response?.data?.success) {
                setTokenWithExpiry(response.data.token);
                toast.success("Welcome back!");
                navigate("/dashboard");
            } else {
                throw new Error(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-[#050508] p-4 relative overflow-hidden">
            <div className="flex w-full max-w-4xl bg-[#0f111a] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
                {/* Branding Panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800 flex-col justify-between p-12">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                             <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">Z</span>
                             </div>
                             <span className="text-2xl font-bold text-white">ZeroFashion</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Admin Portal
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Manage your products, orders, and users from a single verified dashboard.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-slate-500 text-sm">
                        <Shield className="h-4 w-4" />
                        <span>Secure Admin Access</span>
                    </div>
                </div>

                {/* Login Form Panel */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16">
                    <div className="mb-8 lg:hidden">
                        <img src={logo} alt="Zero Fashion" className="h-10 w-10 mb-4 rounded-lg" />
                        <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                    </div>
                    
                    <div className="hidden lg:block mb-10">
                        <h1 className="text-2xl font-bold text-white mb-2">Sign In</h1>
                        <p className="text-slate-400">Enter your credentials to access the admin panel.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-slate-400 text-xs font-bold uppercase tracking-wide" htmlFor="email">Email Address</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                    placeholder="admin@zerofashion.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-400 text-xs font-bold uppercase tracking-wide" htmlFor="password">Password</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            className={`w-full py-3 px-6 rounded-xl text-white bg-indigo-600 font-semibold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2 ${
                                isLoading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <LogIn className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};

export default Login;