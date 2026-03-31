import { X, AlertCircle, Loader2, Trash2 } from "lucide-react";

const UserDeleteModal = ({ isOpen, onClose, onConfirm, isSubmitting, selectedUser }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative overflow-hidden rounded-none bg-white border border-brand-border shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8 border-b border-brand-border pb-6">
            <h2 className="text-xl font-black text-brand-text-primary uppercase tracking-tight">Revoke Identity</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-none text-brand-text-secondary hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto rounded-none bg-red-50 border border-red-100 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <p className="text-brand-text-secondary text-center leading-relaxed text-[10px] font-black uppercase tracking-widest px-4">
              PERMANENTLY VOID <span className="text-black">{selectedUser?.name || "SELECTED IDENTITY"}</span>?
              <br />THIS PROTOCOL CANNOT BE REVERSED.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-4 px-6 bg-white border border-brand-border text-brand-text-secondary text-[10px] font-black uppercase tracking-widest rounded-none hover:border-black hover:text-black transition-all disabled:opacity-30"
            >
              Abort
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 py-4 px-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-red-700 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Confirm Purge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
