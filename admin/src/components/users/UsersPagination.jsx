const UsersPagination = ({ page, totalPages, onPrev, onNext }) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        disabled={!canPrev}
        onClick={onPrev}
        className="px-3 py-2 bg-slate-700/50 text-slate-300 text-xs rounded-lg hover:bg-slate-600/50 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-slate-400 text-xs">Page {page} of {totalPages}</span>
      <button
        disabled={!canNext}
        onClick={onNext}
        className="px-3 py-2 bg-slate-700/50 text-slate-300 text-xs rounded-lg hover:bg-slate-600/50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default UsersPagination;
