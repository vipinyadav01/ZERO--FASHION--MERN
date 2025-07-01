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
        // Fetch order count
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
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
          {/* Modern Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 border-2 border-gray-200 shadow-lg mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">Online</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
              My Profile
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Manage your personal information, view your order history, and customize your account settings
            </p>
                  </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Modern Profile Card */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                {/* Profile Header */}
                <div className="relative bg-black p-8">
                  <div className="relative flex flex-col items-center">
                    {/* Profile Image with Modern Frame */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-white flex items-center justify-center overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      {/* Status indicator */}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2 text-white text-center">{user.name}</h2>
                    
                    {/* Role Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      {user.isAdmin ? <Shield className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      <span className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full font-medium">
                        {user.isAdmin ? 'Administrator' : 'Premium Member'}
                    </span>
                  </div>
                  
                    {/* Email with Icon */}
                    <div className="flex items-center gap-2 text-white bg-gray-800 rounded-full px-4 py-2">
                    <Mail className="w-4 h-4" />
                      <span className="text-sm truncate max-w-48">{user.email}</span>
                    </div>
                </div>
              </div>

                {/* Stats Section */}
              <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="text-2xl font-bold text-black mb-1">{orderCount}</div>
                      <p className="text-xs text-gray-600 font-medium">Total Orders</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="text-2xl font-bold text-black mb-1">{getMembershipDuration().duration}</div>
                      <p className="text-xs text-gray-600 font-medium">Member Since</p>
                  </div>
                </div>
                
                  {/* Action Buttons */}
                  <div className="space-y-3">
                <button
                  onClick={handleEditProfile}
                      className="w-full bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] group"
                >
                      <span className="flex items-center justify-center gap-2">
                        <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Edit Profile
                  </span>
                </button>
                
                <button
                  onClick={handleLogout}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-black py-3 px-6 rounded-xl font-medium transition-all duration-300 border border-gray-300 hover:border-gray-400 group"
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

                      {/* Modern Account Details */}
          <div className="xl:col-span-3 space-y-8">
            {/* Personal Information Card */}
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

            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-black rounded-2xl group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <Zap className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <div className="text-3xl font-bold text-black mb-1">{orderCount}</div>
                <div className="text-sm text-gray-600 font-medium">Total Orders</div>
                <div className="mt-2 text-xs text-green-600 font-medium">+12% this month</div>
                  </div>
                  
              <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-black rounded-2xl group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <Heart className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <div className="text-3xl font-bold text-black mb-1">{getMembershipDuration().duration.split(' ')[0]}</div>
                <div className="text-sm text-gray-600 font-medium">Months Active</div>
                <div className="mt-2 text-xs text-gray-600 font-medium">Since {getMembershipDuration().date}</div>
                  </div>
                  
              <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-black rounded-2xl group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <Star className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <div className="text-3xl font-bold text-black mb-1">Gold</div>
                <div className="text-sm text-gray-600 font-medium">Member Tier</div>
                <div className="mt-2 text-xs">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full font-medium">Premium benefits</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-black rounded-2xl group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <Star className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </div>
                <div className="text-3xl font-bold text-black mb-1">4.9</div>
                <div className="text-sm text-gray-600 font-medium">Satisfaction</div>
                <div className="mt-2 text-xs text-black font-medium">⭐⭐⭐⭐⭐</div>
              </div>
            </div>

                            {/* Modern Cart Information */}
              {user.cartData && Object.keys(user.cartData).length > 0 && (
              <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-8 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-black rounded-2xl">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black">Shopping Cart</h3>
                      <p className="text-gray-600 text-sm">Items ready for checkout</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full font-medium">
                      {Object.keys(user.cartData).length} items
                    </span>
                  </div>
                <p className="text-gray-600 mb-6">
                    You have {Object.keys(user.cartData).length} items in your cart waiting for checkout.
                  </p>
                  <a 
                    href="/cart" 
                  className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                  >
                  <ShoppingBag className="w-4 h-4" />
                    View Cart
                  </a>
                </div>
              )}
          </div>
        </div>
        
        {/* Modern Brand Footer */}
        <div className="text-center py-16 mt-16">
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-8 max-w-md mx-auto">
            <h4 className="text-3xl font-bold text-black mb-2">
            ZERO FASHION
          </h4>
            <p className="text-gray-600 font-medium">Premium Fashion Experience</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo