import { Users, RefreshCw } from "lucide-react";

const UsersHeader = ({ total, loading, onRefresh, onAddSample, isSubmitting }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">User Management</h1>
              <p className="text-xs sm:text-sm text-slate-400">{total} users total</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onAddSample}
              disabled={isSubmitting}
              className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 disabled:opacity-50 transition-all text-xs sm:text-sm font-medium px-3"
            >
              Add Sample Users
            </button>
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 sm:p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-600/50 disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersHeader;
