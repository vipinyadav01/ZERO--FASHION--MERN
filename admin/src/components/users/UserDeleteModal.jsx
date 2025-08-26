import { X, AlertCircle, Loader2, Trash2 } from "lucide-react";

const UserDeleteModal = ({ isOpen, onClose, onConfirm, isSubmitting, selectedUser }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative overflow-hidden rounded-2xl bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Delete User</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-slate-300 text-center leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-white">{selectedUser?.name || "this user"}</span>?
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-600/50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
