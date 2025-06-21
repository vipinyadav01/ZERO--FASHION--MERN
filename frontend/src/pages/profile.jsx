"use client"

import { useState, useEffect, useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { User, Mail, Shield, Edit3, LogOut, Calendar, ShoppingBag } from "lucide-react"
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
    // Navigate to edit profile page or open modal
    console.log("Edit profile clicked")
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-3 w-full">
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error ? "Error Loading Profile" : "No User Found"}
          </h2>
          <p className="text-gray-600 mb-6">{error || "Please log in to view your profile"}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-0 md:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <div className="h-1 w-16 bg-black mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur border-4 border-white/20 mb-4 flex items-center justify-center overflow-hidden">
                    <span className="text-3xl font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                  <div className="flex items-center mb-4">
                    <span className={`px-3 py-1 ${user.isAdmin ? 'bg-red-500' : 'bg-blue-500'} text-white text-xs rounded-full uppercase tracking-wide font-medium`}>
                      {user.isAdmin ? 'Admin' : user.role || 'Member'}
                    </span>
                  </div>
                  
                  <div className="w-full flex items-center justify-center space-x-2 text-gray-200 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <div className="text-center flex-1 border-r border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{orderCount}</div>
                    <p className="text-sm text-gray-500">Orders</p>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-2xl font-bold text-gray-900">{getMembershipDuration().duration}</div>
                    <p className="text-sm text-gray-500">Member for</p>
                  </div>
                </div>
                
                <button
                  onClick={handleEditProfile}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium mb-3"
                >
                  <span className="flex items-center justify-center">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <span className="flex items-center justify-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <span className="text-gray-900 capitalize">{user.role || "user"}</span>
                      {user.isAdmin && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center">
                      <Mail className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <ShoppingBag className="w-10 h-10 text-blue-600 mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{orderCount}</div>
                    <div className="text-sm text-gray-500">Total Orders</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <Calendar className="w-10 h-10 text-green-600 mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{getMembershipDuration().date}</div>
                    <div className="text-sm text-gray-500">Member Since</div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <Shield className="w-10 h-10 text-purple-600 mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1 capitalize">{user.role || "Member"}</div>
                    <div className="text-sm text-gray-500">Account Type</div>
                  </div>
                </div>
              </div>

              {/* Cart Information */}
              {user.cartData && Object.keys(user.cartData).length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Shopping Cart</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {Object.keys(user.cartData).length} items
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    You have {Object.keys(user.cartData).length} items in your cart waiting for checkout.
                  </p>
                  <a 
                    href="/cart" 
                    className="inline-block bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                  >
                    View Cart
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Brand Footer */}
        <div className="text-center py-10 mt-10">
          <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            ZERO FASHION
          </h4>
          <p className="text-gray-500 text-sm mt-1">Premium Fashion Experience</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo