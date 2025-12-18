import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../constants";
import { 
    Users, 
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
      toast.error("Security credentials incomplete");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password complexity requirements not met");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Password synchronization failed");
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
        toast.success("Security principal established");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8">
        
        {/* Teams Header */}
        <div className="text-center space-y-4 mb-10">
            <div className="inline-flex p-4 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 mb-4">
                <ShieldCheck className="w-10 h-10 text-indigo-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">
                Establish <span className="text-indigo-500">Authority</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-sm mx-auto">
                Provision new administrative access for your executive team.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1">Legal Identity</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white font-bold placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                  placeholder="FULL NAME"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1">Communication Node</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white font-bold placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all font-mono"
                  placeholder="ADMIN@ZEROFASHION.COM"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1">Access Key</label>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white font-bold placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                            placeholder="********"
                            disabled={submitting}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1">Key Verification</label>
                    <div className="relative group">
                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white font-bold placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                            placeholder="********"
                            disabled={submitting}
                        />
                    </div>
                </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {submitting ? "PROVISIONING..." : "ESTABLISH AUTHORITY"}
              {!submitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>

        <button onClick={() => navigate(-1)} className="mx-auto flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <ChevronLeft className="w-4 h-4" />
            Back to Team Operations
        </button>
      </div>
    </div>
  );
};

export default CreateAdmin;
