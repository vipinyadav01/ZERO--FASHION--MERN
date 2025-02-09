import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { User, Mail, Calendar } from "lucide-react";

const ProfileInfo = () => {
    const { backendUrl } = useContext(ShopContext);
    const [user, setUser] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    const getUserDetails = async (authToken) => {
        if (!authToken) return;
        try {
            const res = await fetch(`${backendUrl}/api/user/user`, {
                headers: {
                    token: authToken,
                },
            });
            const result = await res.json();
            console.log("Fetched user details:", result.user);
            setUser(result.user);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && backendUrl) {
            getUserDetails(token);
        }
        const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [backendUrl]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-300 via-blue-500 to-black">
                <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-10 w-96 shadow-2xl border border-white/10">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-36 h-36 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full mb-6 animate-pulse shadow-xl">
                            <div className="w-full h-full rounded-full animate-spin-slow opacity-30 border-t-4 border-white"></div>
                        </div>
                        <div className="space-y-4 w-full">
                            <div className="h-8 bg-gradient-to-r from-gray-300 to-gray-400 w-3/4 mx-auto rounded-lg animate-pulse"></div>
                            <div className="h-6 bg-gradient-to-r from-gray-300 to-gray-400 w-1/2 mx-auto rounded-lg animate-pulse"></div>
                            <div className="h-10 bg-gradient-to-r from-gray-300 to-gray-400 w-full rounded-lg animate-pulse mt-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="max-w-3xl w-full mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Profile Image Section */}
                        <div className="relative w-40 h-40 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-100">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-6xl text-gray-400">{user.name?.charAt(0).toUpperCase()}</span>
                            )}
                        </div>

                        {/* Profile Info Section */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-semibold text-gray-800 mb-2">{user.name}</h1>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-5 h-5 mr-3" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-5 h-5 mr-3" />
                                    <span>
                                        {currentDateTime.toLocaleString("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Additional Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                                    <p className="text-gray-800">
                                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                    <p className="text-gray-800">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;
