import { useState } from "react";
import { X, Loader2, Check, Shield } from "lucide-react";

const UserEditModal = ({ isOpen, onClose, editForm, setEditForm, onSave, isSubmitting }) => {
  const [showPassword, setShowPassword] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative overflow-hidden rounded-none bg-white border border-brand-border shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8 border-b border-brand-border pb-6">
            <h2 className="text-xl font-black text-brand-text-primary uppercase tracking-tight">Modify Identity</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-none text-brand-text-secondary hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-brand-text-secondary uppercase tracking-widest pl-1">Personnel Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border border-brand-border rounded-none text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-all placeholder:text-brand-text-secondary/30"
                disabled={isSubmitting}
                placeholder="ENTER NAME..."
              />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-brand-text-secondary uppercase tracking-widest pl-1">Access Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-4 py-3.5 bg-white border border-brand-border rounded-none text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-all placeholder:text-brand-text-secondary/30"
                disabled={isSubmitting}
                placeholder="ENTER EMAIL..."
              />
            </div>
            <div className="pt-2">
              <label className="flex items-center gap-4 p-4 border border-brand-border rounded-none cursor-pointer hover:bg-brand-surface transition-colors group">
                <div className={`w-5 h-5 rounded-none border flex items-center justify-center transition-colors ${editForm.isAdmin ? "bg-brand-accent border-brand-accent" : "bg-white border-brand-border group-hover:border-black"}`}>
                   {editForm.isAdmin && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={editForm.isAdmin}
                  onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                  disabled={isSubmitting}
                />
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-brand-text-secondary" />
                  <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest group-hover:text-black">Elevate to Operator Status</span>
                </div>
              </label>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between pl-1">
                <label className="block text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Protocol Override (Optional)</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[8px] font-black uppercase tracking-widest text-brand-text-secondary hover:text-black"
                  disabled={isSubmitting}
                >
                  {showPassword ? "Conceal" : "Reveal"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={editForm.newPassword || ""}
                onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                placeholder="LEAVE NULL TO RETAIN"
                className="w-full px-4 py-3.5 bg-white border border-brand-border rounded-none text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-all placeholder:text-brand-text-secondary/30"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="flex gap-4 mt-10">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-4 px-6 bg-white border border-brand-border text-brand-text-secondary text-[10px] font-black uppercase tracking-widest rounded-none hover:border-black hover:text-black transition-all disabled:opacity-30"
            >
              Abort
            </button>
            <button
              onClick={onSave}
              disabled={isSubmitting}
              className="flex-1 py-4 px-6 bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-black transition-all disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Synchronize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;
