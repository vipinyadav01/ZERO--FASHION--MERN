"use client"

import { useState, useEffect, useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { User, Mail, Shield, Edit3, LogOut, Calendar, ShoppingBag, Star, Trophy, Heart, Zap } from "lucide-react"
import axios from "axios"

const ProfileInfo = () => {
  const { backendUrl } = useContext(ShopContext)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderCount, setOrderCount] = useState(0)

  const getUserDetails = async (authToken) => {
    if (!authToken) {
      setError("No authentication token found")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`${backendUrl}/api/user/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || `HTTP error! status: ${res.status}`)
      }

      if (result.success && result.user) {
        setUser(result.user)
        await fetchOrderCount(authToken)
      } else {
        throw new Error(result.message || "Failed to fetch user details")
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      setError(error.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderCount = async (authToken) => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/userOrders`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data && response.data.orders) {
        setOrderCount(response.data.orders.length);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  const handleEditProfile = () => {
    window.location.href = "/edit-profile"
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token && backendUrl) {
      getUserDetails(token)
    } else {
      setLoading(false)
      if (!token) {
        setError("Please log in to view your profile")
      }
    }
  }, [backendUrl])

  // Use a fixed date 2 months ago instead of database date
  const getMembershipDuration = () => {
    // Create date from 2 months ago
    const currentDate = new Date();
    const createdDate = new Date(currentDate);
    createdDate.setMonth(currentDate.getMonth() - 2);

    // Format the created date to display
    const formattedDate = createdDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return {
      date: formattedDate,
      duration: '2 months'
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-12 w-full max-w-md">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-2 border-gray-300 animate-ping"></div>
            </div>
            <div className="space-y-4 w-full">
              <div className="h-6 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-3/4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-xl w-1/2 mx-auto animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-12 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-gray-200">
            <User className="w-10 h-10 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-3">
            {error ? "Error Loading Profile" : "No User Found"}
          </h2>
          <p className="text-gray-600 mb-8">{error || "Please log in to view your profile"}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-black hover:bg-gray-800 text-white py-4 px-8 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
          >
            Login to Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-0 md:py-20 px-2 relative">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16 px-2">
          <div className="flex flex-col items-center gap-4 mb-8">

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto">
              Manage your personal information, view your order history, and customize your account settings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="col-span-1 w-full max-w-md mx-auto xl:mx-0 xl:max-w-full">
            <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">

              <div className="relative bg-black p-4 sm:p-8">
                <div className="relative flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-900 border-4 border-white flex items-center justify-center overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl sm:text-4xl font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full border-4 border-black flex items-center justify-center">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white text-center break-words">{user.name}</h2>


                  <div className="flex items-center gap-2 mb-4">
                    {user.isAdmin ? (
                      <Shield className="w-4 h-4 text-black" />
                    ) : (
                      <Star className="w-4 h-4 text-black" />
                    )}
                    <span className="px-3 py-1 sm:px-4 sm:py-2 bg-white text-black text-xs sm:text-sm rounded-full font-semibold border border-black">
                      {user.isAdmin ? 'Administrator' : 'Member'}
                    </span>
                  </div>


                  <div className="flex items-center gap-2 text-black bg-white rounded-full px-3 py-1 sm:px-4 sm:py-2 border border-black max-w-full">
                    <Mail className="w-4 h-4 text-black" />
                    <span className="text-xs sm:text-sm truncate max-w-[8rem] sm:max-w-48">{user.email}</span>
                  </div>
                </div>
              </div>


              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 xs:grid-cols-1">
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-200 w-full">
                    <div className="text-lg sm:text-2xl font-bold text-black mb-1">{orderCount}</div>
                    <p className="text-xs text-gray-600 font-medium">Total Orders</p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-200 w-full">
                    <div className="text-lg sm:text-2xl font-bold text-black mb-1">{getMembershipDuration().duration}</div>
                    <p className="text-xs text-gray-600 font-medium">Member Since</p>
                  </div>
                </div>


                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={handleEditProfile}
                    className="w-full bg-black hover:bg-white hover:text-black text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] border border-black group text-sm sm:text-base"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      Edit Profile
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-white hover:bg-red-500 text-black hover:text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-medium transition-all duration-300 border border-black group text-sm sm:text-base"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      Logout
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className="xl:col-span-3 space-y-8">

            <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-8 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-black rounded-2xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black">Personal Information</h3>
                  <p className="text-gray-600">Your account details and preferences</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <span className="text-black font-medium">{user.name}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Account Role</label>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-black font-medium capitalize">{user.role || "user"}</span>
                      {user.isAdmin && (
                        <span className="px-3 py-1 bg-red-600 text-white text-xs rounded-full font-medium flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Email Address</label>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <span className="text-black font-medium">{user.email}</span>
                      <div className="ml-auto">
                        <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-medium">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 w-full">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-900 rounded-2xl group-hover:scale-105 transition-transform duration-200">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <Zap className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors duration-200" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{orderCount}</div>
                  <div className="text-sm text-gray-500 font-medium">Total Orders</div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-900 rounded-2xl group-hover:scale-105 transition-transform duration-200">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <Heart className="w-5 h-5 text-gray-400 group-hover:text-gray-900 transition-colors duration-200" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{getMembershipDuration().duration.split(' ')[0]}</div>
                  <div className="text-sm text-gray-500 font-medium">Months Active</div>
                  <div className="mt-2 text-xs text-gray-400 font-medium flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    Since {getMembershipDuration().date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo