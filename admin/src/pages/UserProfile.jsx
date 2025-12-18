import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  RefreshCcw,
  LayoutGrid,
  ShieldAlert,
  Users,
  ShieldCheck,
  UserCheck
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
        throw new Error(response.data.message || "Protocol desynchronized");
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
        toast.success("Identity updated");
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
        toast.success("Principal decommissioned");
        closeModal();
      }
    } catch (err) { 
      toast.error(err.response?.data?.message || "Decommissioning failed"); 
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
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Users Control Header */}
        <header className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-slate-800/60 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] -mr-48 -mt-48 rounded-full animate-pulse"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <LayoutGrid className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                  Personnel <span className="text-indigo-500">Registry</span>
                </h1>
              </div>
              <p className="text-slate-400 text-lg font-medium max-w-md">
                Manage your global user base. Audit identities, elevate privileges, and maintain ecosystem integrity.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-md">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Global Reach</p>
                <p className="text-3xl font-black text-white">{total}</p>
              </div>
              <button 
                onClick={() => fetchUsers(page)} 
                className="p-5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-[2rem] transition-all active:scale-95"
              >
                <RefreshCcw className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Controls Bar: Search & Role Filters */}
          <div className="relative z-10 mt-12 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <UsersSearch value={searchTerm} onChange={handleSearchChange} onClear={() => setSearchTerm("")} />
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-1.5 rounded-[2rem] flex gap-1">
              {[
                { id: "all", label: "All Personnel", icon: Users },
                { id: "admin", label: "Authority", icon: ShieldCheck },
                { id: "user", label: "Customers", icon: UserCheck }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    roleFilter === tab.id 
                    ? "bg-indigo-600 text-white shadow-lg" 
                    : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        {error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] p-12 text-center">
             <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-6" />
             <h2 className="text-2xl font-bold text-white mb-2">Access Interrupted</h2>
             <p className="text-slate-400 mb-8">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-20 text-center">
             <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Users className="w-10 h-10 text-slate-800" />
             </div>
             <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">No Identities Found</h3>
             <p className="text-slate-400 max-w-sm mx-auto">
               The current segment returns zero results. Adjust filters or synchronize with the master database.
             </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] overflow-hidden shadow-2xl">
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

            <div className="flex justify-center">
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