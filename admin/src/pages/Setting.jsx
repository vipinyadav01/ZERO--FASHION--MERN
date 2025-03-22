import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { User, Mail, Lock, Save, Key } from "lucide-react";

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
    });
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Fetch current user profile
    const fetchProfile = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Please log in to access settings.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/user/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setProfile({
                    name: response.data.user.name || "",
                    email: response.data.user.email || "",
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error(error.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Please log in to update settings.");
            return;
        }

        if (!profile.name.trim() || !profile.email.trim()) {
            toast.error("Name and email are required.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${backendUrl}/api/user/update`,
                { name: profile.name.trim(), email: profile.email.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success("Profile updated successfully!");
                fetchProfile(); // Refresh profile data
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    // Handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Please log in to change password.");
            return;
        }

        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            toast.error("All password fields are required.");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New password and confirmation do not match.");
            return;
        }

        if (passwords.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long.");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${backendUrl}/api/user/admin/update-password`,
                {
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                toast.success("Password updated successfully!");
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile.name) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#131313]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#ff6200] border-opacity-75"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#131313] p-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-8">
                    Settings
                </h2>

                <div className="space-y-8">
                    {/* Profile Settings */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl p-6 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/20 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <User className="w-6 h-6 text-[#ff6200]" />
                            Profile Settings
                        </h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div>
                                <label className="block mb-2 font-medium text-[#939393]">Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium text-[#939393]">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-3 bg-[#ff6200] text-white font-bold rounded-xl flex items-center gap-2 transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#ff4500] hover:shadow-[#ff6200]/50 hover:-translate-y-1"}`}
                                >
                                    <Save size={18} />
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Password Settings */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl p-6 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/20 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-[#ff6200]" />
                            Change Password
                        </h3>
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <div>
                                <label className="block mb-2 font-medium text-[#939393]">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium text-[#939393]">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium text-[#939393]">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`px-6 py-3 bg-[#ff6200] text-white font-bold rounded-xl flex items-center gap-2 transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#ff4500] hover:shadow-[#ff6200]/50 hover:-translate-y-1"}`}
                                >
                                    <Key size={18} />
                                    {loading ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;