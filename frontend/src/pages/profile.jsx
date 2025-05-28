"use client"

import { useState, useEffect, useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { motion } from "framer-motion"
import { User, Mail, Shield, Edit3, LogOut, Calendar, ShoppingBag } from "lucide-react"

const ProfileInfo = () => {
  const { backendUrl } = useContext(ShopContext)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userOrders, setUserOrders] = useState([])

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
        // If user has orders, you could fetch them here
        if (result.user.orders && result.user.orders.length > 0) {
          // Optionally fetch order details
          // await fetchUserOrders(authToken)
        }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-3 w-full">
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="relative w-32 h-32 mx-auto">
                  {/* Avatar placeholder since no avatar field in backend */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full border-4 border-gray-100 shadow-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">{user.role || "user"}</span>
                {user.isAdmin && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Admin</span>
                )}
              </div>

              <button
                onClick={handleEditProfile}
                className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium mb-4 flex items-center justify-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </motion.div>

          {/* Information Cards */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <span className="text-gray-900 capitalize">{user.role || "user"}</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="bg-gray-50 rounded-lg p-3 border flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <ShoppingBag className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{user.orders ? user.orders.length : 0}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {user.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
              </div>

              {/* Cart Information */}
              {user.cartData && Object.keys(user.cartData).length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Shopping Cart</h4>
                  <p className="text-sm text-gray-600">
                    You have {Object.keys(user.cartData).length} items in your cart
                  </p>
                </div>
              )}
            </div>

            {/* Brand Footer */}
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h4 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                ZERO FASHION
              </h4>
              <p className="text-gray-500 text-sm mt-1">Premium Fashion Experience</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo
