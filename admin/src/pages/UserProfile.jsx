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
        // Ensure users is always an array
        const usersData = Array.isArray(response.data.users) ? response.data.users : [];
        setUsers(usersData);
        setTotal(response.data.total || usersData.length);
        setTotalPages(response.data.totalPages || 1);
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (err) {
      if (!isMounted.current) return;
      console.error("Fetch Users Error:", err);
      const msg = err.response?.data?.message || err.message || "Connection error";
      setError(msg);
      
      if (err.response?.status === 401 || err.response?.status === 403) {
         sessionStorage.removeItem("token");
         navigate("/login");
      }
    } finally {
      if (isMounted.current) setLoading(false);
      isFetching.current = false;
    }
  }, [token, page, limit, searchTerm, roleFilter, navigate]);

  useEffect(() => {
    isMounted.current = true;
    if (token) fetchUsers();
    else { setError("Authentication required"); setLoading(false); }
    return () => { isMounted.current = false; };
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
    <div className="min-h-screen p-6 lg:p-10 font-sans text-brand-text-primary bg-brand-bg">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-10">
            <div>
              <h1 className="text-3xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">Identity Archive</h1>
              <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Manage operator accounts and customer registrations</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="bg-white border border-brand-border rounded-none px-6 py-3 flex items-center gap-4">
                    <Users className="w-4 h-4 text-brand-text-secondary" />
                    <span className="text-brand-text-primary font-black text-sm">{total}</span>
                    <span className="text-brand-text-secondary text-[10px] uppercase font-black tracking-widest">Total Registrations</span>
                </div>
                <button 
                  onClick={() => fetchUsers(page)} 
                  className="p-3 bg-white border border-brand-border text-brand-text-secondary hover:text-black hover:border-black rounded-none transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Controls */}
        <div className="bg-white border border-brand-border rounded-none p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:max-w-md">
                <UsersSearch value={searchTerm} onChange={handleSearchChange} onClear={() => setSearchTerm("")} />
            </div>
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-4 md:pb-0">
               {[
                  { id: "all", label: "ALL IDENTITIES", icon: Users },
                  { id: "admin", label: "OPERATORS", icon: ShieldCheck },
                  { id: "user", label: "CLIENTS", icon: User }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRoleFilter(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border ${
                      roleFilter === tab.id 
                      ? "bg-brand-accent text-white border-brand-accent" 
                      : "bg-white text-brand-text-secondary border-brand-border hover:border-black hover:text-black"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
            </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-100 rounded-none p-12 text-center">
             <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
             <h2 className="text-lg font-black text-red-700 mb-2 uppercase tracking-tight">Access Interrupted</h2>
             <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white border border-brand-border rounded-none p-20 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-brand-surface rounded-none flex items-center justify-center mb-6 border border-brand-border">
                <Users className="w-10 h-10 text-brand-text-secondary" />
             </div>
             <h3 className="text-xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">No Entities Found</h3>
             <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Adjust filters to reveal archived identities.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="bg-white border border-brand-border rounded-none overflow-hidden">
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

            <div className="flex justify-center border-t border-brand-border pt-10 pb-10">
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