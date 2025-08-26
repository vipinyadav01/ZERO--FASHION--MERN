import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const CreateAdmin = ({ token }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("All fields are required");
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
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Register the user
      const registerRes = await axios.post(
        `${backendUrl}/api/user/register`,
        { name: form.name.trim(), email: form.email.trim(), password: form.password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!registerRes.data?.success || !registerRes.data?.user?._id) {
        throw new Error(registerRes.data?.message || "Failed to register user");
      }

      // Step 2: Promote to admin via adminUpdateUser
      const userId = registerRes.data.user._id;
      const promoteRes = await axios.post(
        `${backendUrl}/api/user/admin-update`,
        { userId, name: form.name.trim(), email: form.email.trim(), role: "admin" },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (!promoteRes.data?.success) {
        throw new Error(promoteRes.data?.message || "Failed to promote user to admin");
      }

      toast.success("Admin created successfully");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Failed to create admin";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-3 pt-24 pb-6">
      <div className="max-w-lg mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Create Admin</h1>
            <p className="text-slate-400 text-sm mt-1">Create a new administrator account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="Admin name"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="admin@example.com"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="At least 8 characters"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="Re-enter password"
                disabled={submitting}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
