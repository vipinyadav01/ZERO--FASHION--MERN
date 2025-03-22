import { useState, useEffect } from "react";
import axios from "axios";
import { UserCircle, Mail, Key, Calendar, Loader, Search, RefreshCw, AlertCircle } from "lucide-react";

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

      console.log("Token retrieved:", token); // Debug token

      if (!token) {
        setError("No authentication token found. Please log in as an admin.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${backendUrl}/api/user/all`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data); // Debug response

      if (response.data.success && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
        setError("Unexpected response format from server.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);

      if (err.response) {
        console.error("Full Error Response:", err.response);
        const message = err.response.data?.message || "Failed to fetch users";
        if (err.response.status === 401) {
          setError(`Unauthorized: ${message}`);
        } else if (err.response.status === 403) {
          setError("Access denied: Admin privileges required.");
        } else {
          setError(`Server Error (${err.response.status}): ${message}`);
        }
      } else if (err.request) {
        setError("No response from server. Check if the backend is running.");
      } else {
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const obscurePassword = (password) => (password ? "••••••••••" : "N/A");

  const filteredUsers = users.filter((user) =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-[#131313] min-h-screen p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
            <p className="text-[#939393]">View and manage all registered users</p>
          </div>
          <div className="mt-4 md:mt-0 flex w-full md:w-auto space-x-2">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-[#939393]" />
              </div>
              <input
                type="text"
                className="w-full p-2.5 pl-10 text-sm bg-[#131313] rounded-lg border border-[#939393]/20 focus:ring-2 focus:ring-[#ff6200] text-white placeholder-[#939393] outline-none"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchUsers}
              className="p-2.5 rounded-lg bg-[#131313] border border-[#939393]/20 text-[#939393] hover:text-[#ff6200] hover:border-[#ff6200]/50 transition-colors"
              title="Refresh user data"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 text-[#ff6200] animate-spin" />
            <span className="ml-2 text-[#939393]">Loading user data...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center p-8 bg-[#ff6200]/10 border border-[#ff6200]/20 rounded-lg max-w-lg">
              <AlertCircle className="h-8 w-8 text-[#ff6200] mx-auto mb-3" />
              <p className="text-[#ff6200] mb-4">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-2 px-4 py-2 bg-[#ff6200] text-white rounded-lg hover:bg-[#ff6200]/80 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12 bg-[#131313] border border-[#939393]/20 rounded-lg">
            <p className="text-[#939393]">No users found matching your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#131313] border-b border-[#939393]/20">
                  <th className="px-6 py-4 text-left text-[#939393] font-medium">User</th>
                  <th className="px-6 py-4 text-left text-[#939393] font-medium">Email</th>
                  <th className="px-6 py-4 text-left text-[#939393] font-medium">Password (Hashed)</th>
                  <th className="px-6 py-4 text-left text-[#939393] font-medium">Account Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id || index} className="border-b border-[#939393]/10 hover:bg-[#131313]/90 transition-colors">
                    <td className="px-6 py-4 flex items-center">
                      <UserCircle className="w-6 h-6 text-[#ff6200] mr-3" />
                      <span className="font-medium text-white">{user.name || "Unknown"}</span>
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{obscurePassword(user.password)}</td>
                    <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDataDisplay;