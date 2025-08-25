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
    <div className="min-h-screen bg-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-1">Update your name and profile picture</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Profile Picture
              </h3>
              
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
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
                    className="flex items-center justify-center w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
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
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
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
                      className="w-full pl-12 pr-4 py-3 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be modified for security reasons</p>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      onClick={() => navigate("/profile")}
                      className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
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
  )
}

export default EditProfile 