import { Users, RefreshCw } from "lucide-react";

const UsersHeader = ({ total, loading, onRefresh, onAddSample, isSubmitting }) => {
  const isProd = import.meta.env.PROD;
  return (
    <div className="relative overflow-hidden rounded-none bg-white border border-brand-border p-6 sm:p-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-6">
            <div className="p-3 bg-brand-surface border border-brand-border">
              <Users className="h-6 w-6 text-brand-text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-brand-text-primary uppercase tracking-tight italic">Personnel Log</h1>
              <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-[0.2em]">{total} Identities Indexed</p>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap justify-end">
            {!isProd && (
              <button
                onClick={onAddSample}
                disabled={isSubmitting}
                className="px-6 py-3 bg-white border border-brand-border text-brand-text-primary hover:bg-black hover:text-white disabled:opacity-30 transition-all text-[10px] font-black uppercase tracking-widest w-full sm:w-auto rounded-none"
              >
                Inject Sample Data
              </button>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-3.5 bg-white border border-brand-border text-brand-text-secondary hover:text-black hover:border-black disabled:opacity-30 transition-all w-full sm:w-auto rounded-none"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersHeader;
