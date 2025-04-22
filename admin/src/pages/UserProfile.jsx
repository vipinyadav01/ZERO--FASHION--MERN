import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { UserCircle, Search, RefreshCw, AlertCircle, Loader2, Edit, Trash2 } from "lucide-react";

const UserDataDisplay = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ concentrations, setConcentrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", isAdmin: false });

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    console.log("Backend URL:", backendUrl);
    fetchUsers();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const validateToken = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("Retrieved token:", token || "No token found");
    if (!token) {
      throw new Error("No authentication token found. Please log in as admin.");
    }
    return token;
  };

  const fetchUsers = async () => {
    if (isFetching.current) {
      console.log("Skipping fetch: already in progress");
      return;
    }
    isFetching.current = true;
    setLoading(true);
    setError(null);
    try {
      const token = validateToken();
      console.log("Fetching users from:", `${backendUrl}/api/user/all`, "Token:", token);
      const response = await axios.get(`${backendUrl}/api/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success && Array.isArray(response.data.users)) {
        if (isMounted.current) {
          setUsers(response.data.users);
        }
      } else {
        throw new Error("Unexpected response format from server.");
      }
    } catch (err) {
      console.error("Fetch users error:", err.response?.data || err.message);
      if (isMounted.current) {
        handleError(err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isFetching.current = false;
    }
  };

  const handleError = (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;
    setError(
      status === 403
        ? "Access denied: Admin privileges required. Please log in as admin."
        : status === 401
        ? "Unauthorized: Please log in as admin."
        : message
    );
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";
  };

  const openModal = (action, user) => {
    setModalAction(action);
    setSelectedUser(user);
    if (action === "edit") {
      setEditForm({ name: user.name || "", email: user.email || "", isAdmin: user.role === "admin" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setSelectedUser(null);
    setEditForm({ name: "", email: "", isAdmin: false });
  };

  const handleEdit = async () => {
    try {
      const token = validateToken();
      const response = await axios.post(
        `${backendUrl}/api/user/update`,
        { name: editForm.name, email: editForm.email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success && isMounted.current) {
        setUsers(users.map((u) => (u._id === selectedUser._id ? response.data.user : u)));
        closeModal();
      }
    } catch (err) {
      console.error("Edit user error:", err.response?.data || err.message);
      if (isMounted.current) {
        handleError(err);
      }
    }
  };

  const handleDelete = async () => {
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
      if (response.data.success && isMounted.current) {
        setUsers(users.filter((u) => u._id !== selectedUser._id));
        closeModal();
      }
    } catch (err) {
      console.error("Delete user error:", err.response?.data || err.message);
      if (isMounted.current) {
        handleError(err);
      }
    }
  };

  const handleSearchChange = (value) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
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
                className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-all"
              >
                <RefreshCw className="w-5 h-5" />
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
                onClick={() => window.location.href = "/admin/login"}
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
                            onClick={() => openModal("edit", user)}
                            className="p-2 bg-gray-900 border border-gray-700 rounded-md text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openModal("delete", user)}
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
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-400 text-sm">
                      <input
                        type="checkbox"
                        checked={editForm.isAdmin}
                        onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-700 rounded"
                      />
                      Admin Role
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </>
            )}
            {modalAction === "delete" && (
              <>
                <h2 className="text-xl font-bold text-white mb-4">Delete User</h2>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete {selectedUser?.name || "this user"}? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
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