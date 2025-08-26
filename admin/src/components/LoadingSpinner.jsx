import React from "react";

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
    <div className="text-center space-y-4">
      <div className="relative h-12 w-12 mx-auto">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 animate-pulse"></div>
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 animate-pulse animation-delay-75"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin"></div>
      </div>
      <div className="space-y-1">
        <p className="text-white font-semibold text-lg">Loading</p>
        <p className="text-slate-400 text-sm">Please wait...</p>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
