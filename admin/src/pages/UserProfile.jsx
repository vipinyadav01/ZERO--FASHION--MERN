import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserCircle, Search, RefreshCw, AlertCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { backendUrl } from "../App";

const UserDataDisplay = () => {
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
    fetchUsers();

    return () => {
      isMounted.current = false;
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const validateToken = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Please log in as admin to access this page.");
    }
    return token;
  };

  const fetchUsers = async () => {
    if (isFetching.current) return;

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const token = validateToken();
      const response = await axios.get(`${backendUrl}/api/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!isMounted.current) return;

      if (response.data.success && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
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
        if (logout) logout();
        navigate("/admin/login");
      }
    } finally {
      if (isMounted.current) setLoading(false);
      isFetching.current = false;
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      const token = validateToken();
      const response = await axios.post(
        `${backendUrl}/api/user/update`,
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
        if (logout) logout();
        navigate("/admin/login");
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
      const token = validateToken();
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
        if (logout) logout();
        navigate("/admin/login");
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6 shadow-xl border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin User Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your user base efficiently</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <p className="mt-2 text-gray-400">Loading users...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-10 h-10 text-orange-500" />
              <p className="mt-3 text-orange-500 text-lg font-medium">{error}</p>
              <button
                onClick={() => navigate("/admin/login")}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Log In as Admin
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-lg">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-4 text-gray-400 font-medium text-sm sm:text-base">User</th>
                    <th className="px-4 py-4 text-gray-400 font-medium text-sm sm:text-base">Email</th>
                    <th className="px-4 py-4 text-gray-400 font-medium text-sm sm:text-base">Created</th>
                    <th className="px-4 py-4 text-gray-400 font-medium text-sm sm:text-base">Role</th>
                    <th className="px-4 py-4 text-gray-400 font-medium text-sm sm:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <UserCircle className="w-6 h-6 text-orange-500" />
                          <span className="text-white font-medium text-sm sm:text-base">
                            {user.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-400 text-sm sm:text-base">{user.email}</td>
                      <td className="px-4 py-4 text-gray-400 text-sm sm:text-base">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-orange-500/20 text-orange-500"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
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
                            className="p-2 bg-gray-900 border border-gray-700 rounded-md text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setModalAction("delete");
                              setIsModalOpen(true);
                            }}
                            className="p-2 bg-gray-900 border border-gray-700 rounded-md text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-colors"
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
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            {modalAction === "edit" && (
              <>
                <h2 className="text-xl font-bold text-white mb-4">Edit User</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-sm">
                      <input
                        type="checkbox"
                        checked={editForm.isAdmin}
                        onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-700 rounded"
                        disabled={isSubmitting}
                      />
                      Admin Role
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Save
                  </button>
                </div>
              </>
            )}
            {modalAction === "delete" && (
              <>
                <h2 className="text-xl font-bold text-white mb-4">Delete User</h2>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete {selectedUser?.name || "this user"}? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDataDisplay;
