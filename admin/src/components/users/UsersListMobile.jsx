import { UserCircle, Crown, UserCheck, Calendar, Edit, Trash2 } from "lucide-react";

const UsersListMobile = ({ users, formatDate, onEdit, onDelete }) => {
  return (
    <div className="lg:hidden space-y-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="group relative overflow-hidden rounded-none bg-white border border-brand-border hover:bg-brand-surface transition-all duration-300 p-6"
        >
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-none bg-brand-surface border border-brand-border flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-7 h-7 text-brand-text-secondary/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-brand-text-primary truncate uppercase tracking-tight">
                    {user.name || "UNIDENTIFIED PERSONNEL"}
                  </h3>
                  <p className="text-[10px] font-black text-brand-text-secondary truncate uppercase tracking-widest">{user.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-[8px] font-black uppercase tracking-[0.2em] border flex-shrink-0 ${
                  user.role === "admin"
                    ? "bg-black text-white border-black"
                    : "bg-white text-brand-text-secondary border-brand-border"
                }`}
              >
                {user.role === "admin" ? (
                  <Crown className="w-3 h-3" />
                ) : (
                  <UserCheck className="w-3 h-3" />
                )}
                {user.role === "admin" ? "ADMIN" : "USER"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-brand-border">
              <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-brand-text-secondary">
                <span className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2.5 rounded-none bg-white border border-brand-border text-brand-text-secondary hover:text-black hover:border-black transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="p-2.5 rounded-none bg-white border border-brand-border text-brand-text-secondary hover:text-red-600 hover:border-red-100 transition-all"
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
