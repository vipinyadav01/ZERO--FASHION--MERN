import { useState, useEffect } from "react";
import axios from "axios";
import { UserCircle, Search, RefreshCw, AlertCircle, Loader2 } from "lucide-react";

const UserDataDisplay = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in as an admin.");
      }

      const response = await axios.get(`${backendUrl}/api/user/all`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        throw new Error("Unexpected response format from server.");
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(err.response?.status === 403 
        ? "Access denied: Admin privileges required"
        : err.response?.status === 401
        ? "Unauthorized: Please log in"
        : message);
    } finally {
      setLoading(false);
    }
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

  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#131313] p-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6 shadow-lg border border-[#939393]/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-white">User Dashboard</h1>
              <p className="text-[#939393] text-sm mt-1">Manage your user base efficiently</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#939393]" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#131313] border border-[#939393]/20 rounded-lg text-white placeholder-[#939393] focus:outline-none focus:border-[#ff6200] focus:ring-1 focus:ring-[#ff6200] transition-all"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="p-2 bg-[#1a1a1a] border border-[#939393]/20 rounded-lg text-[#939393] hover:text-[#ff6200] hover:border-[#ff6200] transition-all"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#1a1a1a] rounded-xl shadow-lg border border-[#939393]/10 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#ff6200] animate-spin" />
              <p className="mt-2 text-[#939393]">Loading users...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-10 h-10 text-[#ff6200]" />
              <p className="mt-3 text-[#ff6200] text-lg font-medium">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-[#ff6200] text-white rounded-lg hover:bg-[#ff6200]/80 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[#939393] text-lg">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#131313] border-b border-[#939393]/20">
                  <tr>
                    <th className="px-6 py-4 text-[#939393] font-medium">User</th>
                    <th className="px-6 py-4 text-[#939393] font-medium">Email</th>
                    <th className="px-6 py-4 text-[#939393] font-medium">Created</th>
                    <th className="px-6 py-4 text-[#939393] font-medium">Role</th>
                    <th className="px-6 py-4 text-[#939393] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user._id} 
                      className="border-b border-[#939393]/10 hover:bg-[#131313]/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserCircle className="w-6 h-6 text-[#ff6200]" />
                          <span className="text-white font-medium">{user.name || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#939393]">{user.email}</td>
                      <td className="px-6 py-4 text-[#939393]">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin 
                            ? "bg-[#ff6200]/20 text-[#ff6200]" 
                            : "bg-[#939393]/20 text-[#939393]"
                        }`}>
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-[#1a1a1a] border border-[#939393]/20 rounded-md text-[#939393] hover:text-[#ff6200] hover:border-[#ff6200] transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 bg-[#1a1a1a] border border-[#939393]/20 rounded-md text-[#939393] hover:text-[#ff6200] hover:border-[#ff6200] transition-colors">
                            Delete
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
    </div>
  );
};

export default UserDataDisplay;