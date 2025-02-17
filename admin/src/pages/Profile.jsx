import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Camera,
    Save
} from 'lucide-react';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: 'Admin User',
        email: 'admin@zerofashion.com',
        phone: '+91 9876543210',
        location: 'Mumbai, India',
        joinDate: 'January 2024',
        role: 'Administrator',
        avatar: 'https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle profile update logic here
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <img
                                    src={profileData.avatar}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                                />
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                                        <Camera className="w-5 h-5 text-gray-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 pb-8 px-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{profileData.fullName}</h1>
                                <p className="text-sm text-gray-500">{profileData.role}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.fullName}
                                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            disabled={!isEditing}
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={profileData.location}
                                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Join Date
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            value={profileData.joinDate}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            value={profileData.role}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
