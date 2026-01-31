import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  RefreshCw,
  Users,
  ShieldCheck,
  User,
  AlertCircle
} from "lucide-react";
import { backendUrl } from "../constants";
import UsersSearch from "../components/users/UsersSearch";
import UsersPagination from "../components/users/UsersPagination";
import UsersTable from "../components/users/UsersTable";
import UserEditModal from "../components/users/UserEditModal";
import UserDeleteModal from "../components/users/UserDeleteModal";

const UserProfile = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", isAdmin: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  const debounceTimeout = useRef(null);

  const fetchUsers = useCallback(async (targetPage = page) => {
    if (isFetching.current || !token) return;
    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${backendUrl}/api/user/all`, {
        params: { 
          page: targetPage, 
          limit, 
          search: searchTerm,
          role: roleFilter 
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!isMounted.current) return;

      if (response.data.success) {
        const usersData = Array.isArray(response.data.users) ? response.data.users : response.data.users || [];
        setUsers(usersData);
        setTotal(response.data.total || usersData.length);
        setTotalPages(response.data.totalPages || 1);
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (err) {
      if (!isMounted.current) return;
      setError(err.response?.data?.message || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) navigate("/login");
    } finally {
      if (isMounted.current) setLoading(false);
      isFetching.current = false;
    }
  }, [token, page, limit, searchTerm, roleFilter, navigate]);

  useEffect(() => {
    if (token) fetchUsers();
    else { setError("Authentication required"); setLoading(false); }
    return () => { isMounted.current = false; if (debounceTimeout.current) clearTimeout(debounceTimeout.current); };
  }, [token, page, fetchUsers]);

  useEffect(() => {
    if (token) { setPage(1); fetchUsers(1); }
  }, [searchTerm, roleFilter, token, fetchUsers]);

  const handleEdit = async () => {
    if (!selectedUser?._id) return;
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/admin-update`, {
        userId: selectedUser._id,
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        role: editForm.isAdmin ? "admin" : "user",
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (response.data.success) {
        setUsers(users.map((u) => (u._id === selectedUser._id ? response.data.user : u)));
        toast.success("User updated successfully");
        closeModal();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!selectedUser?._id) return;
    setIsSubmitting(true);
    try {
      const response = await axios.delete(`${backendUrl}/api/user/delete/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        await fetchUsers(page);
        toast.success("User deleted successfully");
        closeModal();
      }
    } catch (err) { 
      toast.error(err.response?.data?.message || "Delete failed"); 
    }
    finally { setIsSubmitting(false); }
  };

  const handleSearchChange = (value) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => setSearchTerm(value), 300);
  };

  const closeModal = () => {
    setIsModalOpen(false); setModalAction(null); setSelectedUser(null);
    setEditForm({ name: "", email: "", isAdmin: false });
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 font-sans text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">User Management</h1>
              <p className="text-slate-400 text-sm">View and manage user accounts and permissions.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-[#0f111a] border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-white font-medium">{total}</span>
                    <span className="text-slate-500 text-xs text-uppercase">Total Users</span>
                </div>
                <button 
                  onClick={() => fetchUsers(page)} 
                  className="p-2.5 bg-[#0f111a] border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Controls */}
        <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:max-w-md">
                <UsersSearch value={searchTerm} onChange={handleSearchChange} onClear={() => setSearchTerm("")} />
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
               {[
                  { id: "all", label: "All Users", icon: Users },
                  { id: "admin", label: "Admins", icon: ShieldCheck },
                  { id: "user", label: "Customers", icon: User }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRoleFilter(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      roleFilter === tab.id 
                      ? "bg-indigo-600 text-white" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
            </div>
        </div>

        {error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-8 text-center">
             <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
             <h2 className="text-lg font-bold text-white mb-1">Error Loading Users</h2>
             <p className="text-slate-400 text-sm">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                <Users className="w-8 h-8 text-slate-600" />
             </div>
             <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
             <p className="text-slate-500 text-sm">Adjust your search or filters to find what you&apos;re looking for.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#0f111a] border border-slate-800 rounded-xl overflow-hidden">
              <UsersTable
                users={users}
                formatDate={(d) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                onEdit={(user) => {
                  setSelectedUser(user);
                  setEditForm({ name: user.name || "", email: user.email || "", isAdmin: user.role === "admin" });
                  setModalAction("edit");
                  setIsModalOpen(true);
                }}
                onDelete={(user) => {
                  setSelectedUser(user);
                  setModalAction("delete");
                  setIsModalOpen(true);
                }}
              />
            </div>

            <div className="flex justify-center border-t border-slate-800/50 pt-6">
               <UsersPagination
                page={page}
                totalPages={totalPages}
                onPrev={() => page > 1 && setPage(page - 1)}
                onNext={() => page < totalPages && setPage(page + 1)}
              />
            </div>
          </div>
        )}
      </div>

      <UserEditModal
        isOpen={isModalOpen && modalAction === "edit"}
        onClose={closeModal}
        editForm={editForm}
        setEditForm={setEditForm}
        onSave={handleEdit}
        isSubmitting={isSubmitting}
      />

      <UserDeleteModal
        isOpen={isModalOpen && modalAction === "delete"}
        onClose={closeModal}
        onConfirm={handleDelete}
        isSubmitting={isSubmitting}
        selectedUser={selectedUser}
      />
    </div>
  );
};

UserProfile.propTypes = {
  token: PropTypes.string.isRequired
};

export default UserProfile;