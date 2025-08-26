import { UserCircle, Crown, UserCheck, Edit, Trash2 } from "lucide-react";

const UsersTable = ({ users, formatDate, onEdit, onDelete }) => {
  return (
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
            {users.map((user) => (
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
                      onClick={() => onEdit(user)}
                      className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
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
  );
};

export default UsersTable;
