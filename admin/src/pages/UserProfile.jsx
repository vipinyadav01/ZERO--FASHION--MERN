import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Loader2,
} from "lucide-react";
import { backendUrl } from "../constants";
import UsersHeader from "../components/users/UsersHeader";
import UsersSearch from "../components/users/UsersSearch";
import UsersPagination from "../components/users/UsersPagination";
import UsersTable from "../components/users/UsersTable";
import UsersListMobile from "../components/users/UsersListMobile";
import UserEditModal from "../components/users/UserEditModal";
import UserDeleteModal from "../components/users/UserDeleteModal";

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
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
  }, [token, page]);

  useEffect(() => {
    if (token) {
      setPage(1);
      fetchUsers(1);
    }
  }, [searchTerm]);

  const fetchUsers = async (targetPage = page) => {
    if (isFetching.current || !token) return;

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${backendUrl}/api/user/all`, {
        params: { page: targetPage, limit, search: searchTerm },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!isMounted.current) return;

      if (response.data.success) {
        const usersData = Array.isArray(response.data.users) ? response.data.users : response.data.users || [];
        
        setUsers(usersData);
        setTotal(response.data.total || usersData.length);
        setTotalPages(response.data.totalPages || 1);
        
        if (usersData.length === 0 && (response.data.total || 0) === 0) {
          toast.info("No users found in the database. Try creating some users first.");
        }
      } else {
        throw new Error(response.data.message || "Unexpected response format from server.");
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
      if (isMounted.current) {
        setLoading(false);
      }
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
      { name: "Amit Sharma", email: "amit.sharma@example.com", password: "password123" },
      { name: "Priya Singh", email: "priya.singh@example.com", password: "password123" },
      { name: "Rahul Verma", email: "rahul.verma@example.com", password: "password123" },
      { name: "Sneha Patel", email: "sneha.patel@example.com", password: "password123" },
      { name: "Vikram Rao", email: "vikram.rao@example.com", password: "password123" },
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
            if (userData.email === "testadmin@zerofashion.com") {
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
            
          } else {
            throw userError;
          }
        }
      }

      if (createdCount > 0) {
        toast.success(`Created ${createdCount} sample users${adminCreated ? " (including 1 admin)" : ""}`);
        await fetchUsers(1);
        setPage(1);
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
      const response = await axios.delete(
        `${backendUrl}/api/user/delete/${selectedUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!isMounted.current) return;

      if (response.data.success) {
        await fetchUsers(page);
        toast.success("User deleted successfully.");
        closeModal();
      } else {
        throw new Error(response.data.message || "Delete failed");
      }
    } catch (err) {
      if (!isMounted.current) return;
      const message = err.response?.data?.message || err.message || "Failed to delete user.";
      toast.error(`Failed to delete user: ${message}`);
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


  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-3 pt-8 pb-6 sm:pt-10 lg:pt-12">
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
                onClick={() => fetchUsers(page)}
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
      <div className="px-3 pt-8 pb-6 sm:px-4 sm:pt-10 lg:px-6 lg:pt-12">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          <UsersHeader
            total={total}
            loading={loading}
            isSubmitting={isSubmitting}
            onRefresh={() => fetchUsers(page)}
            onAddSample={createSampleUsers}
          />

          <UsersSearch
            value={searchTerm}
            onChange={handleSearchChange}
            onClear={() => {
              setSearchTerm("");
              const input = document.querySelector('input[type="text"]');
              if (input) input.value = "";
            }}
          />

          <UsersPagination
            page={page}
            totalPages={totalPages}
            onPrev={() => page > 1 && setPage(page - 1)}
            onNext={() => page < totalPages && setPage(page + 1)}
          />

          {users.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-600/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11Z" stroke="currentColor" strokeWidth="1.5"/><path d="M20.3536 20.3536C18.2091 22.4981 15.2091 24 12 24C8.79086 24 5.79086 22.4981 3.64645 20.3536C5.79086 18.2091 8.79086 16.7071 12 16.7071C15.2091 16.7071 18.2091 18.2091 20.3536 20.3536Z" stroke="currentColor" strokeWidth="1.5"/></svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">No Users Found</h3>
                  <p className="text-sm text-slate-400">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "No users available in the system. Create some sample users to get started."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <UsersTable
                users={users}
                formatDate={formatDate}
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

              <UsersListMobile
                users={users}
                formatDate={formatDate}
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

              <UsersPagination
                page={page}
                totalPages={totalPages}
                onPrev={() => page > 1 && setPage(page - 1)}
                onNext={() => page < totalPages && setPage(page + 1)}
              />
            </div>
          )}
        </div>
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

export default UserProfile;