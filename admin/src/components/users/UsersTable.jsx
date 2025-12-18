import { Edit3, Trash2, Shield, User, Mail, Calendar } from "lucide-react";
import PropTypes from "prop-types";

const UsersTable = ({ users, formatDate, onEdit, onDelete }) => {
  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/60 bg-slate-900/30">
              <th className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Personnel</th>
              <th className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Authentication</th>
              <th className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Authority</th>
              <th className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Enrolled</th>
              <th className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-900/40 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${user.role === 'admin' ? "bg-gradient-to-tr from-indigo-600 to-purple-600" : "bg-slate-800"}`}>
                          {user.name?.charAt(0) || <User className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                          <p className="text-white font-black text-lg truncate uppercase tracking-tight italic">{user.name}</p>
                          <p className="text-slate-500 text-[10px] font-mono lowercase truncate">{user._id}</p>
                      </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="text-slate-300 font-bold text-sm lowercase">{user.email}</p>
                </td>
                <td className="px-8 py-5">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-slate-800 border-slate-700 text-slate-500"}`}>
                     {user.role === 'admin' && <Shield className="w-3 h-3" />}
                     {user.role}
                  </div>
                </td>
                <td className="px-8 py-5 text-slate-500 text-xs font-mono">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(user)}
                      className="p-3 bg-slate-900 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(user)}
                      className="p-3 bg-slate-900 text-slate-400 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
        {users.map((user) => (
          <div key={user._id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black shadow-lg flex-shrink-0 ${user.role === 'admin' ? "bg-gradient-to-tr from-indigo-600 to-purple-600" : "bg-slate-800"}`}>
                {user.name?.charAt(0) || <User className="w-6 h-6" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-black text-xl truncate uppercase tracking-tight italic leading-tight">{user.name}</p>
                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest mt-1 ${user.role === 'admin' ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-slate-800/50 border-slate-700/50 text-slate-500"}`}>
                  {user.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                  {user.role}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-3 text-slate-400 font-medium text-sm">
                <Mail className="w-4 h-4 text-slate-600" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-xs font-mono">
                <Calendar className="w-4 h-4 text-slate-600" />
                <span>Enrolled {formatDate(user.createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => onEdit(user)}
                className="flex-1 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button 
                onClick={() => onDelete(user)}
                className="flex-1 py-4 bg-slate-800 text-rose-400 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-colors"
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
