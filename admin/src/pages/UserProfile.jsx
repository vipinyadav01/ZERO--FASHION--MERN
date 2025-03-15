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
        setIsLoading(true);
        setTimeout(() => {
            sessionStorage.removeItem("token");
            setToken("");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 antialiased">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                {/* Header */}
                <header className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 sm:p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_50%)]"></div>
                    <div className="flex flex-col sm:flex-row justify-between items-center relative z-10 gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">ZF Admin Profile</h1>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 bg-white/10 hover:bg-red-500/20 px-4 py-2 rounded-lg
                                transition-all duration-200 backdrop-blur-sm shadow-md hover:shadow-red-500/20"
                        >
                            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            <span className="text-sm sm:text-base font-medium text-white hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Profile Content */}
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-4 md:w-1/3">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-200 to-gray-300
                                rounded-full overflow-hidden flex items-center justify-center shadow-lg border-4 border-white
                                transform hover:scale-105 transition-all duration-300">
                                <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" />
                            </div>
                            <div className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full font-medium text-sm shadow-sm">
                                {userData.role}
                            </div>
                            <div className="text-center">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{userData.name}</h2>
                                <p className="text-gray-600 text-sm">{userData.position}</p>
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="flex-1 md:w-2/3">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Profile Information</h3>
                            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 shadow-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    {[
                                        { icon: <Mail className="w-5 h-5 text-indigo-600" />, label: "Email", value: userData.email },
                                        { icon: <Phone className="w-5 h-5 text-indigo-600" />, label: "Phone", value: userData.phone || "Not specified" },
                                        { icon: <MapPin className="w-5 h-5 text-indigo-600" />, label: "Location", value: userData.location || "Not specified" },
                                        {
                                            icon: <Calendar className="w-5 h-5 text-indigo-600" />,
                                            label: "Join Date",
                                            value: userData.joinDate
                                                ? new Date(userData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                                : "Not specified"
                                        },
                                        { icon: <Building className="w-5 h-5 text-indigo-600" />, label: "Department", value: userData.department || "Not specified" },
                                        { icon: <Briefcase className="w-5 h-5 text-indigo-600" />, label: "Position", value: userData.position || "Not specified" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-start space-x-3 group">
                                            {item.icon}
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                                                <p className="font-medium text-gray-800 text-sm sm:text-base break-words group-hover:text-indigo-600 transition-colors duration-200">
                                                    {item.value}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Privileges */}
                <footer className="border-t border-gray-100 p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Admin Privileges</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                                className="bg-white px-4 py-2.5 sm:py-3 rounded-lg shadow-sm border border-gray-100
                                    text-sm font-medium text-gray-700 flex items-center space-x-2 hover:shadow-md
                                    hover:border-indigo-200 transition-all duration-200 transform hover:scale-105"
                            >
                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                <span className="truncate">{permission}</span>
                            </div>
                        ))}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default UserProfile;
