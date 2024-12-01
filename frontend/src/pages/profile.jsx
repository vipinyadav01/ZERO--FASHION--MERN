import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Edit2, Save, Camera, MapPin, Clock } from "lucide-react";

const ProfileInfo = () => {
  const { backendUrl } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ location: "Mathura" });
  const [isLoading, setIsLoading] = useState(false);
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
      setEditedUser(result.user || { location: "Mathura" });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && backendUrl) {
      getUserDetails(token);
    }

    // Update date and time every minute
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [backendUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify(editedUser),
      });
      const result = await res.json();
      if (result.success) {
        setUser(editedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-br from-gray-300 to-gray-500 text-white border border-gray-700 rounded-lg p-8 max-w-md mx-auto mt-12 animate-pulse shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full mb-6"></div>
          <div className="h-8 bg-gray-700 w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-700 w-1/2 mb-6"></div>
          <div className="h-10 bg-gray-700 w-full rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-300 to-gray-500 text-white border border-gray-700 rounded-lg p-8 max-w-md mx-auto mt-16 shadow-xl">
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center mb-6 overflow-hidden shadow-md group">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-5xl text-blue-700 font-light font-serif">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
          {isEditing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="text-white w-8 h-8" />
            </div>
          )}
        </div>

        <div className="text-center w-full space-y-4">
          <h2 className="text-3xl font-semibold text-white font-serif">
            {user.name}
          </h2>
          <div className="flex items-center justify-center space-x-2 text-blue-500">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Mathura</span>
            <Clock className="w-4 h-4 ml-2" />
            <span className="text-sm">
              {currentDateTime.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <p className="text-white-400">{user.email}</p>
          {user.location && <p className="text-gray-300">{user.location}</p>}
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={() => setIsEditing(true)}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
        >
          <Edit2 className="w-5 h-5" />
          <span>Edit Profile</span>
        </button>
      </div>
      {isEditing && (
        <div className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Email"
          />
          <input
            type="text"
            name="location"
            value={editedUser.location}
            onChange={handleInputChange}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Location"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
