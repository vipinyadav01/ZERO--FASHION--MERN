import { Search, X } from "lucide-react";

const UsersSearch = ({ value, onChange, onClear }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
        placeholder="Search users by name or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
        </button>
      )}
    </div>
  );
};

export default UsersSearch;
