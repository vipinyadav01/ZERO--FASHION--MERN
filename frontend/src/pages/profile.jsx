"use client"

import { useState, useEffect, useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { User, Edit3, LogOut, ShoppingBag, Zap, Clock, Award } from "lucide-react"
import axios from "axios"

const ProfileInfo = () => {
  const { backendUrl } = useContext(ShopContext)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orderCount, setOrderCount] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [orders, setOrders] = useState([])

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
        setOrders(response.data.orders);
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

  const getMembershipDuration = () => {
    const currentDate = new Date();
    const createdDate = new Date(currentDate);
    createdDate.setMonth(currentDate.getMonth() - 2);

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

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "settings", label: "Settings", icon: Zap }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-lg">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border border-yellow-400/40 animate-pulse"></div>
            </div>
            <div className="space-y-4 w-full">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 mx-auto animate-pulse"></div>
            </div>
            <p className="text-gray-600 text-sm tracking-widest">LOADING PROFILE</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-400/50">
            <User className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-4xl font-light mb-4 tracking-tight">{error ? "Error" : "Access Denied"}</h2>
          <p className="text-gray-600 mb-8 text-sm tracking-wide">{error || "Please log in to view your profile"}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-black text-white py-3 px-8 font-semibold tracking-widest text-sm transition-all duration-300 hover:bg-yellow-400 hover:text-black"
          >
            LOGIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-20">
      {/* Profile Header - Editorial Layout */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 border border-yellow-400/50"></div>
                <div className="absolute inset-2 border border-gray-300"></div>
                <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-7xl font-light text-yellow-500">{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-yellow-400 flex items-center justify-center text-black font-bold text-xs tracking-widest">
                  {user.isAdmin ? "ADMIN" : "USER"}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="md:col-span-2 space-y-8">
              <div className="space-y-3">
                <p className="text-yellow-500 text-xs font-semibold tracking-widest">WELCOME BACK</p>
                <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900">{user.name}</h1>
                <p className="text-gray-600 text-sm tracking-wide">{user.email}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleEditProfile}
                  className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3 font-semibold tracking-widest text-sm transition-all duration-300 hover:bg-yellow-400 hover:text-black"
                >
                  <Edit3 className="w-4 h-4" />
                  EDIT PROFILE
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 border border-gray-400 text-gray-900 px-8 py-3 font-semibold tracking-widest text-sm transition-all duration-300 hover:border-yellow-400 hover:text-yellow-500"
                >
                  <LogOut className="w-4 h-4" />
                  LOGOUT
                </button>
              </div>

              <div className="flex gap-6 pt-4 text-xs text-gray-600 tracking-wide">
                <div>Member since {getMembershipDuration().date}</div>
                <div className="text-yellow-500">•</div>
                <div>{user.isAdmin ? "Administrator" : "Standard User"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Orders", value: orderCount, accent: "yellow" },
              { label: "Member Duration", value: getMembershipDuration().duration, accent: "gray" },
              { label: "Rewards Points", value: "0", accent: "yellow" },
              { label: "Wishlist Items", value: "0", accent: "gray" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 p-6 hover:border-gray-300 transition-all duration-300">
                <p className={`text-xs font-semibold tracking-widest ${stat.accent === "yellow" ? "text-yellow-500" : "text-gray-600"}`}>
                  {stat.label}
                </p>
                <p className="text-3xl font-light mt-4 mb-2 text-gray-900">{stat.value}</p>
                <div className="w-8 h-px bg-gradient-to-r from-yellow-400 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-0 py-6 font-semibold tracking-widest text-sm transition-all duration-300 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-500'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="py-12">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-12 pb-12">
              {/* Account Information */}
              <div>
                <h3 className="text-2xl font-light tracking-tight mb-8 pb-4 border-b border-gray-200 text-gray-900">
                  <span className="text-yellow-500">—</span> Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 tracking-widest mb-3">FULL NAME</p>
                    <p className="text-lg font-light text-gray-900">{user.name}</p>
                    <div className="w-8 h-px bg-yellow-400/40 mt-4"></div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 tracking-widest mb-3">ACCOUNT TYPE</p>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-light capitalize text-gray-900">{user.role || "user"}</span>
                      {user.isAdmin && <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold tracking-widest">ADMIN</span>}
                    </div>
                    <div className="w-8 h-px bg-yellow-400/40 mt-4"></div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-gray-600 tracking-widest mb-3">EMAIL ADDRESS</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-light text-gray-900">{user.email}</span>
                      <span className="text-xs font-semibold text-green-600 tracking-widest">VERIFIED</span>
                    </div>
                    <div className="w-8 h-px bg-yellow-400/40 mt-4"></div>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 border border-gray-200 p-8">
                  <div className="flex items-start justify-between mb-6">
                    <p className="text-xs font-semibold text-yellow-500 tracking-widest">ACCOUNT STATUS</p>
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-light mb-2 text-gray-900">Active</p>
                  <p className="text-sm text-gray-600">In good standing</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-8">
                  <div className="flex items-start justify-between mb-6">
                    <p className="text-xs font-semibold text-gray-600 tracking-widest">LAST UPDATED</p>
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-3xl font-light mb-2 text-gray-900">Today</p>
                  <p className="text-sm text-gray-600">Current information</p>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="pb-12">
              <h3 className="text-2xl font-light tracking-tight mb-8 pb-4 border-b border-gray-200 text-gray-900">
                <span className="text-yellow-500">—</span> Order History
              </h3>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 p-6 hover:border-yellow-400/50 transition-all duration-300 group">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-light text-lg text-gray-900">Order #{order._id?.slice(-6) || `#${idx + 1}`}</h4>
                            <span className={`text-xs font-bold tracking-widest px-3 py-1 ${
                              order.payment ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.payment ? 'PAID' : 'PENDING'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''} • ₹{order.amount}
                          </p>
                        </div>
                        <button className="text-gray-900 border border-gray-400 px-6 py-2 font-semibold tracking-widest text-xs transition-all duration-300 group-hover:border-yellow-400 group-hover:text-yellow-500">
                          VIEW
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-light mb-3 text-gray-900">No Orders Yet</h3>
                  <p className="text-gray-600 mb-8 text-sm">Begin your shopping journey</p>
                  <button
                    onClick={() => (window.location.href = "/collection")}
                    className="inline-block bg-black text-white px-8 py-3 font-semibold tracking-widest text-sm transition-all duration-300 hover:bg-yellow-400 hover:text-black"
                  >
                    EXPLORE COLLECTION
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="pb-12 space-y-12">
              <div>
                <h3 className="text-2xl font-light tracking-tight mb-8 pb-4 border-b border-gray-200 text-gray-900">
                  <span className="text-yellow-500">—</span> Preferences
                </h3>
                <div className="space-y-8">
                  {[
                    { label: "Email Notifications", desc: "Order updates & special offers", enabled: true },
                    { label: "Newsletter", desc: "Latest trends & collections", enabled: true },
                    { label: "Dark Mode", desc: "Switch to dark theme", enabled: false }
                  ].map((pref, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-6 border-b border-gray-200">
                      <div>
                        <h4 className="font-semibold text-sm tracking-wide mb-1 text-gray-900">{pref.label}</h4>
                        <p className="text-xs text-gray-600">{pref.desc}</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-all duration-300 ${pref.enabled ? 'bg-yellow-400' : 'bg-gray-300'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-all duration-300 ${pref.enabled ? 'ml-6' : 'ml-0.5'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-red-200">
                <h3 className="text-2xl font-light tracking-tight mb-8 pb-4 border-b border-red-200 text-gray-900">
                  <span className="text-red-500">—</span> Danger Zone
                </h3>
                <div className="bg-red-50 border border-red-200 p-8">
                  <h4 className="font-semibold text-lg mb-3 text-gray-900">Delete Account</h4>
                  <p className="text-sm text-gray-600 mb-6">This action cannot be undone. Your account and all associated data will be permanently removed.</p>
                  <button className="px-8 py-3 bg-red-100 text-red-600 font-semibold tracking-widest text-sm transition-all duration-300 border border-red-300 hover:bg-red-500 hover:text-white">
                    DELETE ACCOUNT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo