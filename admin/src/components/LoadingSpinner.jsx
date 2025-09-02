import React from "react";
import logo from "../assets/logo.png";

const LoadingSpinner = ({ title = "Loading", subtitle = "Please wait..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
    <div className="text-center space-y-6">
      <img
        src={logo}
        alt="App Logo"
        className="mx-auto opacity-80 animate-spin"
        style={{
          height: "clamp(64px, 15vw, 120px)",
          width: "clamp(64px, 15vw, 120px)",
        }}
      />
      <div className="space-y-2">
        <p className="text-white font-semibold text-lg">{title}</p>
        <p className="text-slate-400 text-sm">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
