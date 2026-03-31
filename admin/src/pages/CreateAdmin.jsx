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
    <div className="min-h-screen p-6 lg:p-10 font-sans text-brand-text-primary bg-brand-bg flex items-center justify-center">
      <div className="max-w-xl w-full space-y-10">
        
        {/* Header */}
        <div className="text-center mb-10 border-b border-brand-border pb-10">
            <h1 className="text-3xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">Access Provisioning</h1>
            <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Grant administrative clearance to a new operator</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-none p-10 space-y-8">
          
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest block pl-1">Full Designation</label>
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/30"
                  placeholder="ENTER FULL NAME..."
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest block pl-1">Electronic Mail Address</label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/30"
                  placeholder="OPERATOR@ZERO-FASHION.COM"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest block pl-1">Access Credentials</label>
                    <div className="relative group">
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/30"
                            placeholder="MIN. 8 CHARACTERS"
                            disabled={submitting}
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest block pl-1">Verify Credentials</label>
                    <div className="relative group">
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/30"
                            placeholder="CONFIRM ACCESS CODE"
                            disabled={submitting}
                        />
                    </div>
                </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-4 px-6 bg-brand-accent hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-none transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {submitting ? "SYNCHRONIZING..." : "INITIALIZE PROVISIONING"}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <button onClick={() => navigate(-1)} className="w-full flex items-center justify-center gap-3 text-brand-text-secondary hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest decoration-2 underline-offset-4 hover:underline">
            <ChevronLeft className="w-4 h-4" />
            Return to Command Center
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
