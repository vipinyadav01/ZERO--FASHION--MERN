import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, User, Mail, Phone, MapPin, Calendar, Shield, LogOut } from "lucide-react";
import { backendUrl } from "../App";

const UserProfile = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        role: "",
        joinDate: "",
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("authToken");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`${backendUrl}/api/user/admin/login`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem("authToken");
                        navigate("/login");
                        return;
                    }
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                setUserData(data);
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    role: data.role || "",
                    joinDate: data.joinDate || "",
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [backendUrl, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${backendUrl}/api/user/profile/update`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const updatedData = await response.json();
            setUserData(updatedData);
            setIsEditing(false);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    if (loading && !userData) {
        return (
            <div className="w-full h-full flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !userData) {
        return (
            <div className="w-full p-8 bg-red-50 rounded-lg text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Profile</h2>
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Return to Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-5">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header with background */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">User Profile</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Profile content */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar and role section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                {userData?.avatar ? (
                                    <img
                                        src={userData.avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={64} className="text-gray-400" />
                                )}
                            </div>
                            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                                {userData?.role || "Admin"}
                            </div>
                        </div>

                        {/* User details section */}
                        <div className="flex-1">
                            <div className="flex justify-between mb-6">
                                <h2 className="text-xl font-bold">{userData?.name || "User Name"}</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg ${isEditing
                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        } transition-colors`}
                                >
                                    {isEditing ? <Save size={16} /> : <Edit size={16} />}
                                    <span>{isEditing ? "Save" : "Edit"}</span>
                                </button>
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{userData?.email || "email@example.com"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Phone className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-medium">{userData?.phone || "Not specified"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <p className="font-medium">{userData?.location || "Not specified"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-500">Join Date</p>
                                                <p className="font-medium">
                                                    {userData?.joinDate
                                                        ? new Date(userData.joinDate).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })
                                                        : "Not specified"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Role and permissions section */}
                {userData?.role === "Admin" && (
                    <div className="border-t border-gray-200 p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Admin Privileges</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {["User Management", "Content Management", "System Settings", "Analytics Access", "API Management", "Billing Access"].map((permission, index) => (
                                <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg text-sm">
                                    {permission}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
