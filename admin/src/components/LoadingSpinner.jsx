import React from "react";
import logo from "../assets/logo.png";

const LoadingSpinner = ({ title = "Synchronizing", subtitle = "Accessing secure databanks..." }) => (
  <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 font-sans">
    <div className="text-center space-y-10">
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 border-2 border-brand-border rounded-none"></div>
        <div className="absolute inset-0 border-2 border-black border-t-transparent rounded-none animate-spin"></div>
      </div>
      <div className="space-y-3">
        <p className="text-brand-text-primary font-black text-xl uppercase tracking-tight italic">{title}</p>
        <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
