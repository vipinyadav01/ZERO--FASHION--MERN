import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../constants";
import { 
    ShieldCheck, 
    Mail, 
    Lock, 
    User, 
    ArrowRight,
    ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateAdmin = ({ token }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const authToken = token || sessionStorage.getItem("token");
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/admin-create`,
        { name: form.name.trim(), email: form.email.trim(), password: form.password },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (res.data?.success) {
        toast.success("Admin created successfully");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-10 font-sans text-slate-100 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Admin</h1>
            <p className="text-slate-400 text-sm">Grant administrative privileges to a new user.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0f111a] border border-slate-800 rounded-xl p-8 shadow-xl">
          
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wider pl-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                  placeholder="Enter full name"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wider pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                  placeholder="admin@example.com"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-medium uppercase tracking-wider pl-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                            placeholder="Min. 8 characters"
                            disabled={submitting}
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-slate-400 text-xs font-medium uppercase tracking-wider pl-1">Confirm Password</label>
                    <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                            placeholder="Confirm password"
                            disabled={submitting}
                        />
                    </div>
                </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? "Creating..." : "Create Admin"}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <button onClick={() => navigate(-1)} className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
        </button>
      </div>
    </div>
  );
};

import PropTypes from 'prop-types';

CreateAdmin.propTypes = {
  token: PropTypes.string.isRequired
};

export default CreateAdmin;
