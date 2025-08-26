import { UserCircle, Crown, UserCheck, Calendar, Edit, Trash2 } from "lucide-react";

const UsersListMobile = ({ users, formatDate, onEdit, onDelete }) => {
  return (
    <div className="lg:hidden space-y-3">
      {users.map((user) => (
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersListMobile;
