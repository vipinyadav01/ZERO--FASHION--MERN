import { X, Loader2, Check, Shield } from "lucide-react";

const UserEditModal = ({ isOpen, onClose, editForm, setEditForm, onSave, isSubmitting }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative overflow-hidden rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Edit User</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={editForm.isAdmin}
                  onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                  className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 rounded focus:ring-amber-500 focus:ring-2"
                  disabled={isSubmitting}
                />
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-slate-300">Admin Role</span>
                </div>
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
