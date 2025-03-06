import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Calendar, Shield, LogOut, Building, Briefcase } from "lucide-react";

const UserProfile = () => {
    const navigate = useNavigate();
    const userData = {
        name: "Vipin Yadav",
        email: "admin@example.com",
        phone: "+91 9918572513",
        location: "Varanasi, India",
        role: "Admin",
        joinDate: new Date().toISOString().split('T')[0],
        department: "Technology",
        position: "System Administrator",
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                {/* Header with modern gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white"></div>
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white"></div>
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">ZF Admin Profile</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 bg-white/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-all duration-200"
                        >
                            <LogOut size={16} />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Profile content with card-style layout */}
                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar and quick info */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full overflow-hidden flex items-center justify-center shadow-md border-4 border-white">
                                <User size={64} className="text-gray-400" />
                            </div>
                            <div className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-medium shadow-sm">
                                {userData.role}
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-800">{userData.name}</h2>
                                <p className="text-gray-500 text-sm">{userData.position}</p>
                            </div>
                        </div>

                        {/* User details section - read-only */}
                        <div className="flex-1">
                            <div className="flex justify-between mb-6 items-center">
                                <h3 className="text-lg font-semibold text-gray-700">Profile Information</h3>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-start space-x-3">
                                        <Mail className="w-5 h-5 text-indigo-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium text-gray-800">{userData.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Phone className="w-5 h-5 text-indigo-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium text-gray-800">{userData.phone || "Not specified"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium text-gray-800">{userData.location || "Not specified"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Calendar className="w-5 h-5 text-indigo-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Join Date</p>
                                            <p className="font-medium text-gray-800">
                                                {userData.joinDate
                                                    ? new Date(userData.joinDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : "Not specified"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Building className="w-5 h-5 text-indigo-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Department</p>
                                            <p className="font-medium text-gray-800">{userData.department || "Not specified"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Briefcase className="w-5 h-5 text-indigo-500 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Position</p>
                                            <p className="font-medium text-gray-800">{userData.position || "Not specified"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin privileges section */}
                <div className="border-t border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-center space-x-2 mb-4">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Admin Privileges</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            "User Management",
                            "Content Management",
                            "System Settings",
                            "Analytics Access",
                            "API Management",
                            "Billing Access"
                        ].map((permission, index) => (
                            <div
                                key={index}
                                className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100 text-sm font-medium text-gray-700 flex items-center space-x-2 hover:shadow-md transition-shadow"
                            >
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span>{permission}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
