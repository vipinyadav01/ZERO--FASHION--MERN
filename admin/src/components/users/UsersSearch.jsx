import { Search, X } from "lucide-react";
import PropTypes from "prop-types";

const UsersSearch = ({ value, onChange, onClear }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white rounded-[2rem] pl-14 pr-12 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-bold tracking-tight placeholder-slate-600"
          placeholder="SEARCH IDENTITY BY NAME OR EMAIL NODE..."
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-800 text-slate-500 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

UsersSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default UsersSearch;
