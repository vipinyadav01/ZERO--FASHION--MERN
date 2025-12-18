import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../constants";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, Shield, Sparkles } from "lucide-react";

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
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        setTouched({ email: true, password: true });

        if (!validateEmail(formData.email)) {
            setError("Identity node invalid");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Security key criteria not met");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/user/admin-login`, formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response?.data?.success) {
                setTokenWithExpiry(response.data.token);
                toast.success("Identity Verified. Portal Open.");
                navigate("/dashboard");
            } else {
                throw new Error(response.data.message || "Credential rejection");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Autonomous security rejection";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getInputClass = (field) => {
        const base = "w-full pl-14 pr-12 py-5 bg-black/40 border rounded-2xl outline-none transition-all duration-500 placeholder-slate-600 font-black tracking-tight uppercase";
        if (touched[field]) {
            if (field === "email" && !validateEmail(formData.email)) return `${base} border-rose-500/50 bg-rose-500/5 text-rose-200`;
            if (field === "password" && formData.password.length < 6) return `${base} border-rose-500/50 bg-rose-500/5 text-rose-200`;
        }
        return `${base} border-slate-800 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 text-white`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-[#050508] p-4 sm:p-6 md:p-8 relative overflow-hidden font-['Montserrat']">
            {/* Dynamic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)]"></div>
            </div>

            <div className="flex flex-col lg:flex-row overflow-hidden rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] max-w-6xl w-full bg-[#0a0a0f]/80 backdrop-blur-3xl border border-slate-800 relative z-10 transition-all duration-1000">
                {/* Branding Panel */}
                <div className="lg:w-1/2 bg-gradient-to-br from-indigo-950 via-[#0a0a0f] to-slate-950 text-white p-12 lg:p-20 relative overflow-hidden flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-[2rem] border border-white/10 flex items-center justify-center mb-12 backdrop-blur-xl shadow-2xl">
                             <Sparkles className="w-10 h-10 text-indigo-400" />
                        </div>
                        
                        <h2 className="text-6xl font-black mb-6 tracking-tighter uppercase italic">
                            Zero<span className="text-indigo-500">Fashion</span>
                        </h2>
                        <h3 className="text-sm font-black tracking-[0.4em] uppercase text-indigo-400 mb-8 px-1">Management Node</h3>
                        <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-md">
                            Welcome to the executive nexus. Quantify and command your fashion empire through high-fidelity data streams.
                        </p>
                    </div>
                    
                    <div className="space-y-8 relative z-10 mt-12 lg:mt-0">
                        <div className="flex items-center space-x-5 group">
                            <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all duration-500">
                                <Shield className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-black text-white uppercase text-xs tracking-widest">Enclave Security</h3>
                                <p className="text-slate-500 text-sm font-medium">Identity verified via secure protocols</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Form Panel */}
                <div className="w-full lg:w-1/2 p-10 sm:p-14 lg:p-20 bg-[#0a0a0f]">
                    <div className="max-w-md mx-auto">
                        <div className="mb-12">
                            <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase whitespace-nowrap italic">
                                Identity <span className="text-indigo-500 font-black italic">Sync</span>
                            </h1>
                            <p className="text-slate-500 font-medium tracking-tight">Verify credentials to bypass enclave security.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1" htmlFor="email">Identity Node</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("email")}
                                        className={getInputClass("email")}
                                        placeholder="ADMIN_NODE@ZEROFASHION.COM"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1" htmlFor="password">Security Key</label>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        className={getInputClass("password")}
                                        placeholder="********"
                                        required
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                className={`w-full py-5 px-6 rounded-[2rem] text-white bg-indigo-600 flex items-center justify-center gap-4 transition-all duration-500 shadow-xl shadow-indigo-600/20 font-black uppercase tracking-[0.2em] group italic text-xs ${
                                    isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]"
                                }`}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        <span>Syncing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Access Portal</span>
                                        <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="text-center pt-8 border-t border-slate-800/50">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                                    ZeroFashion Enclave Security Active © 2024
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};

export default Login;