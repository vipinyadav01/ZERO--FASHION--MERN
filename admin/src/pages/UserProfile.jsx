import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  UserCircle,
  Search,
  RefreshCw,
  AlertCircle,
  Loader2,
  Edit,
  Trash2,
  Users,
  Shield,
  Calendar,
  X,
  Check,
  Crown,
  UserCheck,
} from "lucide-react";
import { backendUrl } from "../App";

const UserProfile = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", isAdmin: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (token) {
      fetchUsers();
    } else {
      setError("Authentication required");
      setLoading(false);
    }

    return () => {
      isMounted.current = false;
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [token]);

  const fetchUsers = async () => {
    if (isFetching.current || !token) return;

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${backendUrl}/api/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!isMounted.current) return;

      if (response.data.success && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
        if (response.data.users.length === 0) {
          toast.info("No users found in the database. Try creating some users first.");
        }
      } else {
        throw new Error("Unexpected response format from server.");
      }
    } catch (err) {
      if (!isMounted.current) return;
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      setError(
        status === 403
          ? "Access denied: Admin privileges required."
          : status === 401
          ? "Unauthorized: Please log in as admin."
          : message
      );
      toast.error(message);
      if (status === 401 || status === 403) {
        navigate("/login");
      }
    } finally {
      if (isMounted.current) setLoading(false);
      isFetching.current = false;
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const createSampleUsers = async () => {
    if (isSubmitting || !token) return;

    setIsSubmitting(true);

    const sampleUsers = [
      { name: "John Doe", email: "john@example.com", password: "password123" },
      { name: "Jane Smith", email: "jane@example.com", password: "password123" },
      { name: "Mike Johnson", email: "mike@example.com", password: "password123" },
      { name: "Sarah Wilson", email: "sarah@example.com", password: "password123" },
      { name: "Test Admin", email: "testadmin@example.com", password: "password123" },
    ];

    try {
      let createdCount = 0;
      let adminCreated = false;

      for (const userData of sampleUsers) {
        try {
          const registerResponse = await axios.post(
            `${backendUrl}/api/user/register`,
            userData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (registerResponse.data.success) {
            createdCount++;
            if (userData.email === "testadmin@example.com") {
              await axios.post(
                `${backendUrl}/api/user/admin-update`,
                {
                  userId: registerResponse.data.user._id,
                  name: userData.name,
                  email: userData.email,
                  role: "admin",
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              adminCreated = true;
            }
          }
        } catch (userError) {
          if (userError.response?.data?.message?.includes("already exists")) {
            // Skip duplicate users
          } else {
            throw userError;
          }
        }
      }

      if (createdCount > 0) {
        toast.success(`Created ${createdCount} sample users${adminCreated ? " (including 1 admin)" : ""}`);
        await fetchUsers();
      } else {
        toast.info("Sample users already exist in the database");
      }
    } catch (error) {
      toast.error("Failed to create sample users");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedUser?._id) {
      toast.error("Invalid user selected.");
      return;
    }

    if (!editForm.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!validateEmail(editForm.email)) {
      toast.error("Invalid email format.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/admin-update`,
        {
          userId: selectedUser._id,
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          role: editForm.isAdmin ? "admin" : "user",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!isMounted.current) return;

      if (response.data.success) {
        setUsers(users.map((u) => (u._id === selectedUser._id ? response.data.user : u)));
        toast.success("User updated successfully.");
        closeModal();
      }
    } catch (err) {
      if (!isMounted.current) return;
      const message = err.response?.data?.message || "Failed to update user.";
      toast.error(message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser?._id) {
      toast.error("Invalid user selected.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/delete`,
        { userId: selectedUser._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!isMounted.current) return;

      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== selectedUser._id));
        toast.success("User deleted successfully.");
        closeModal();
      }
    } catch (err) {
      if (!isMounted.current) return;
      const message = err.response?.data?.message || "Failed to delete user.";
      toast.error(message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (value) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setSelectedUser(null);
    setEditForm({ name: "", email: "", isAdmin: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-3 pt-20 pb-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="relative h-12 w-12 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
              <div className="absolute inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 animate-pulse animation-delay-75"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin"></div>
            </div>
            <div className="space-y-1">
              <p className="text-white font-semibold text-lg">Loading Users</p>
              <p className="text-slate-400 text-sm">Fetching user data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-3 pt-20 pb-6">
        <div className="max-w-md mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Error Loading Users</h3>
                <p className="text-sm text-slate-400">{error}</p>
              </div>
              <button
                onClick={fetchUsers}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 active:scale-95"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-3 pt-20 pb-6 sm:px-4 sm:pt-24 lg:px-6 lg:pt-28">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/20">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">User Management</h1>
                    <p className="text-xs sm:text-sm text-slate-400">{filteredUsers.length} users</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={createSampleUsers}
                    disabled={isSubmitting}
                    className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 disabled:opacity-50 transition-all text-xs sm:text-sm font-medium px-3"
                  >
                    Add Sample Users
                  </button>
                  <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="p-2 sm:p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 transition-all"
                  >
                    <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                  placeholder="Search users by name or email..."
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      document.querySelector('input[type="text"]').value = "";
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-600/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">No Users Found</h3>
                  <p className="text-sm text-slate-400">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "No users available in the system. Create some sample users to get started."}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  {searchTerm ? (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        document.querySelector('input[type="text"]').value = "";
                      }}
                      className="px-4 py-2 bg-slate-600/50 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={createSampleUsers}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm rounded-lg hover:from-green-500 hover:to-green-600 disabled:opacity-50 transition-all"
                      >
                        {isSubmitting ? "Creating..." : "Create Sample Users"}
                      </button>
                      <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-slate-600/50 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                      >
                        Refresh
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="hidden lg:block relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50 border-b border-slate-600/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">User</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Created</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                <UserCircle className="w-6 h-6 text-indigo-400" />
                              </div>
                              <span className="text-white font-medium">
                                {user.name || "Unknown"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{user.email}</td>
                          <td className="px-6 py-4 text-slate-400">{formatDate(user.createdAt)}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {user.role === "admin" ? (
                                <Crown className="w-3 h-3" />
                              ) : (
                                <UserCheck className="w-3 h-3" />
                              )}
                              {user.role === "admin" ? "Admin" : "User"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setEditForm({
                                    name: user.name || "",
                                    email: user.email || "",
                                    isAdmin: user.role === "admin",
                                  });
                                  setModalAction("edit");
                                  setIsModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setModalAction("delete");
                                  setIsModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:hidden space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="group relative overflow-hidden rounded-xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 hover:bg-slate-700/60 transition-all duration-300 p-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <UserCircle className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                              {user.name || "Unknown User"}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${
                            user.role === "admin"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <Crown className="w-3 h-3" />
                          ) : (
                            <UserCheck className="w-3 h-3" />
                          )}
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(user.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setEditForm({
                                name: user.name || "",
                                email: user.email || "",
                                isAdmin: user.role === "admin",
                              });
                              setModalAction("edit");
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setModalAction("delete");
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative overflow-hidden rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 shadow-2xl w-full max-w-md">
            <div className="p-6">
              {modalAction === "edit" && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Edit User</h2>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
                        <input
                          type="checkbox"
                          checked={editForm.isAdmin}
                          onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                          className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 rounded focus:ring-amber-500 focus:ring-2"
                          disabled={isSubmitting}
                        />
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-medium text-slate-300">Admin Role</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeModal}
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEdit}
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </>
              )}
              {modalAction === "delete" && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Delete User</h2>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mb-4">
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-slate-300 text-center leading-relaxed">
                      Are you sure you want to delete <span className="font-semibold text-white">{selectedUser?.name || "this user"}</span>?
                      This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete User
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;