import { Search, X } from "lucide-react";
import PropTypes from "prop-types";

const UsersSearch = ({ value, onChange, onClear }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary group-focus-within:text-black transition-colors" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-brand-border text-brand-text-primary rounded-none pl-12 pr-12 py-4 focus:outline-none focus:border-brand-accent transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-brand-text-secondary/30"
          placeholder="SEARCH IDENTITY ARCHIVE..."
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-none hover:bg-brand-surface text-brand-text-secondary transition-all"
          >
            <X className="w-3.5 h-3.5" />
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
