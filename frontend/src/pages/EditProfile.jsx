import { useState, useEffect, useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { User, Mail, Camera, Save, ArrowLeft, Upload, X } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

const EditProfile = () => {
  const { backendUrl, navigate, updateUserData } = useContext(ShopContext)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState("")
  const [errors, setErrors] = useState({})

  // Get user details
  const getUserDetails = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to access this page")
      navigate("/login")
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        const userData = response.data.user
        setUser(userData)
        setFormData({
          name: userData.name,
          email: userData.email,
        })
        setPreviewImage(userData.profileImage || "")
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast.error(error.response?.data?.message || "Failed to fetch user details")
      if (error.response?.status === 401) {
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserDetails()
  }, [backendUrl])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    // Only allow name changes, email is read-only
    if (name === 'name') {
      setFormData(prev => ({ ...prev, [name]: value }))
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }))
      }
    }
  }

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file")
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }

      setProfileImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setPreviewImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Remove selected image
  const removeImage = () => {
    setProfileImage(null)
    setPreviewImage(user?.profileImage || "")
    document.getElementById("imageInput").value = ""
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please enter a valid name")
      return
    }

    // Check if anything has actually changed
    if (!profileImage && formData.name.trim() === user?.name) {
      toast.error("No changes detected. Please update your name or profile picture.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to update profile")
      navigate("/login")
      return
    }

    try {
      setUpdating(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name.trim())
      
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage)
      }

      const response = await axios.post(
        `${backendUrl}/api/user/update`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data.success) {
        toast.success("Profile updated successfully!")
        // Update user state with new data
        setUser(response.data.user)
        // Update user data in context
        updateUserData(response.data.user)
        setProfileImage(null)
        // Navigate back to profile page
        navigate("/profile")
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error("Update error:", error)
      
      // Check if it's a Cloudinary configuration error
      if (error.response?.status === 500 && error.response?.data?.message?.includes("Image upload service is not configured")) {
        toast.error("Image upload is currently unavailable. Please update only your name or contact support.")
      } else {
        toast.error(error.response?.data?.message || "Failed to update profile")
      }
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4 mt-14">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-3 w-full">
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-3/4 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent py-6 sm:py-10 md:py-20 px-2 sm:px-4 md:px-8">
      <div className="max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate("/profile")}
              className="p-2 sm:p-3 border border-gray-300 text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Update your name and profile picture</p>
            </div>
          </div>
          <div className="h-px bg-black w-20"></div>
        </div>

        {/* Terminal-style wrapper */}
        <div className="border border-gray-200 hover:border-black transition-colors duration-300">
          {/* Window bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
            </div>
            <div className="text-[11px] font-mono text-gray-500">profile/edit.log</div>
            <div className="w-6" />
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* Code-like info block */}
            <div className="border border-gray-200 p-3 sm:p-4 bg-white mb-6 sm:mb-8">
              <div className="font-mono text-xs sm:text-sm leading-5 sm:leading-6">
                <div className="break-all"><span className="text-gray-500">user:</span> <span className="text-black">{user?.name || ""}</span></div>
                <div className="break-all"><span className="text-gray-500">email:</span> <span className="text-black">{user?.email || formData.email}</span></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Image Section */}
          <div className="md:col-span-1">
            <div className="border border-gray-200 p-4 sm:p-6 bg-white">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Profile Picture
              </h3>
              
              <div className="flex flex-col items-center">
                 <div className="relative mb-4 sm:mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {profileImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                 <div className="w-full">
                  <label
                    htmlFor="imageInput"
                    className="flex items-center justify-center w-full py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 cursor-pointer hover:border-black transition-colors text-sm sm:text-base"
                  >
                    <Upload className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-gray-600">
                      {profileImage ? "Change Image" : "Upload Image"}
                    </span>
                  </label>
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 p-4 sm:p-6 bg-white">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                   <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border text-sm sm:text-base focus:outline-none focus:border-black transition-colors ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                    <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
                  </label>
                   <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-2.5 sm:py-3 border bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200 text-sm sm:text-base"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be modified for security reasons</p>
                </div>

                 <div className="pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => navigate("/profile")}
                      className="w-full py-2.5 sm:py-3 px-5 sm:px-6 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full bg-black text-white py-2.5 sm:py-3 px-5 sm:px-6 hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile 