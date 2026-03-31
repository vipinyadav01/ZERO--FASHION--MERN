const UsersPagination = ({ page, totalPages, onPrev, onNext }) => {
  const canPrev = page > 1;
  const canNext = page < totalPages;
  return (
    <div className="flex items-center gap-6">
      <button
        disabled={!canPrev}
        onClick={onPrev}
        className="px-6 py-2.5 bg-white border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-brand-text-primary"
      >
        Prev
      </button>
      <span className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Page {page} / {totalPages}</span>
      <button
        disabled={!canNext}
        onClick={onNext}
        className="px-6 py-2.5 bg-white border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-brand-text-primary"
      >
        Next
      </button>
    </div>
  );
};

export default UsersPagination;
