import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ProfileInfo = () => {
  const { token, backendUrl } = useContext(ShopContext);
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
      setUser(result.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserDetails(token);
    }
  }, [token, backendUrl]);

  if (!user) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-8 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-6 bg-gray-300 w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 w-1/2 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-28">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl text-gray-500">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="text-center w-full">
          {isEditing ? (
            <input
              type="text"
              defaultValue={user.name}
              className="text-xl font-semibold text-gray-800 mb-2 text-center w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {user.name}
            </h2>
          )}
          <p className="text-gray-600 mb-4">
            {isEditing ? (
              <input
                type="email"
                defaultValue={user.email}
                className="text-center w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
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
                  className="text-center w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
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
                  className="text-center w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;