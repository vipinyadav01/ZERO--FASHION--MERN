import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!sessionStorage.getItem("token");

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-8 font-sans">
      <div className="max-w-md w-full">
        <div className="relative overflow-hidden rounded-none bg-white border border-brand-border shadow-none p-10 text-center">
          <div className="space-y-8">
            <div className="w-20 h-20 mx-auto rounded-none bg-brand-surface border border-brand-border flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-brand-text-secondary" />
            </div>
            <div className="space-y-4">
              <h1 className="text-6xl font-black text-brand-text-primary tracking-tighter italic">404</h1>
              <h2 className="text-sm font-black text-brand-text-secondary uppercase tracking-[0.2em]">Resource Depleted</h2>
              <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest leading-relaxed">
                The requested coordinate does not exist within the current archive parameters.
              </p>
            </div>
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
              className="w-full mt-8 py-4 px-6 bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-black transition-all active:scale-95"
            >
              Return to {isAuthenticated ? "Command Center" : "Access Portal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
