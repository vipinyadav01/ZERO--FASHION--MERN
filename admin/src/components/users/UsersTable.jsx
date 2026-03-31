import { Edit3, Trash2, Shield, User, Mail, Calendar } from "lucide-react";
import PropTypes from "prop-types";

const UsersTable = ({ users, formatDate, onEdit, onDelete }) => {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface">
              <th className="px-8 py-5 text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Personnel</th>
              <th className="px-8 py-5 text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Authentication</th>
              <th className="px-8 py-5 text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Authority</th>
              <th className="px-8 py-5 text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Enrolled</th>
              <th className="px-8 py-5 text-brand-text-secondary text-[10px] font-black uppercase tracking-widest text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-brand-surface transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-none flex items-center justify-center text-brand-text-primary font-black border border-brand-border bg-brand-surface`}>
                          {user.name?.charAt(0) || <User className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                          <p className="text-brand-text-primary font-black text-sm truncate uppercase tracking-tight">{user.name}</p>
                          <p className="text-brand-text-secondary text-[8px] font-black uppercase tracking-widest truncate mt-0.5">ID: {user._id.slice(-8).toUpperCase()}</p>
                      </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-brand-text-secondary font-black text-[10px] uppercase tracking-widest">{user.email}</p>
                </td>
                <td className="px-8 py-6">
                   <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-none border text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? "bg-black text-white border-black" : "bg-white border-brand-border text-brand-text-secondary"}`}>
                     {user.role === 'admin' && <Shield className="w-3 h-3" />}
                     {user.role}
                   </span>
                </td>
                <td className="px-8 py-6 text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(user)}
                      className="p-3 bg-white text-brand-text-secondary border border-brand-border rounded-none hover:bg-black hover:text-white transition-all shadow-none"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(user)}
                      className="p-3 bg-white text-brand-text-secondary border border-brand-border rounded-none hover:bg-red-600 hover:text-white transition-all shadow-none"
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-6 pt-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white border border-brand-border rounded-none p-6 space-y-8">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-none flex items-center justify-center text-brand-text-primary font-black border border-brand-border bg-brand-surface flex-shrink-0`}>
                {user.name?.charAt(0) || <User className="w-6 h-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-brand-text-primary font-black text-base truncate uppercase tracking-tight leading-tight">{user.name}</p>
                <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-none border text-[8px] font-black uppercase tracking-widest mt-2 ${user.role === 'admin' ? "bg-black text-white border-black" : "bg-white border-brand-border text-brand-text-secondary"}`}>
                  {user.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                  {user.role}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-brand-border">
              <div className="flex items-center gap-4 text-brand-text-secondary font-black text-[10px] uppercase tracking-widest">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-4 text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                <span>Enrolled {formatDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => onEdit(user)}
                className="flex-1 py-4 bg-white border border-brand-border text-brand-text-primary rounded-none font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button 
                onClick={() => onDelete(user)}
                className="flex-1 py-4 bg-white border border-brand-border text-red-600 rounded-none font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

UsersTable.propTypes = {
  users: PropTypes.array.isRequired,
  formatDate: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UsersTable;
