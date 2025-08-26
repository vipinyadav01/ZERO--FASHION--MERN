import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!sessionStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-3 py-6">
      <div className="max-w-md w-full">
        <div className="relative overflow-hidden rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">404</h1>
              <h2 className="text-lg font-semibold text-slate-300">Page Not Found</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            <button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 active:scale-95"
            >
              Go to {isAuthenticated ? "Dashboard" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
