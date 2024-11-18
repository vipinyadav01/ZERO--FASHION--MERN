import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ProfileInfo = () => {
  const backendUrl = useContext(ShopContext).backendUrl;
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    const token = sessionStorage.getItem("token");
    if (token && backendUrl) {
      getUserDetails(token);
    }
  }, [backendUrl]);

  if (!user) {
    return (
      <div className="bg-white border border-gray-300 rounded-lg p-6 max-w-md mx-auto mt-12 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-200 w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 w-1/2 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md mx-auto mt-16 shadow-sm">
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 rounded-full border border-gray-200 flex items-center justify-center mb-6 overflow-hidden shadow-sm">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl text-gray-600 font-light">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="text-center w-full">
          {isEditing ? (
            <input
              type="text"
              defaultValue={user.name}
              className="text-2xl font-light text-gray-800 mb-3 text-center w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-black transition-colors duration-300"
            />
          ) : (
            <h2 className="text-2xl font-light text-gray-800 mb-3">
              {user.name}
            </h2>
          )}
          <p className="text-gray-600 mb-4">
            {isEditing ? (
              <input
                type="email"
                defaultValue={user.email}
                className="text-center w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-black transition-colors duration-300"
              />
            ) : (
              <span>{user.email}</span>
            )}
          </p>
          {user.phone && (
            <p className="text-gray-600 mb-2">
              {isEditing ? (
                <input
                  type="tel"
                  defaultValue={user.phone}
                  className="text-center w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-black transition-colors duration-300"
                />
              ) : (
                <span>{user.phone}</span>
              )}
            </p>
          )}
          {user.location && (
            <p className="text-gray-600 mb-4">
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={user.location}
                  className="text-center w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-black transition-colors duration-300"
                />
              ) : (
                <span>{user.location}</span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full bg-gray-100 text-gray-800 py-3 rounded-md hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
