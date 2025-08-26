import React, { useEffect, useState, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import { AlertCircle } from "lucide-react";

// Lazy load pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Add = React.lazy(() => import("./pages/Add"));
const List = React.lazy(() => import("./pages/List"));
const Order = React.lazy(() => import("./pages/Order"));
const OrderCharts = React.lazy(() => import("./pages/OrderCharts"));
const Users = React.lazy(() => import("./pages/UserProfile"));

// Environment variables
export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
export const currency = "₹";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Modern Mobile-First Layout Component
const DashboardLayout = ({ children, handleLogout }) => {
  const [sidebarWidth, setSidebarWidth] = useState(64); // px
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar onWidthChange={setSidebarWidth} />
      <Navbar onLogout={handleLogout} />
      <main
        className="min-h-screen pt-16 transition-all duration-300"
        style={{ paddingLeft: `${sidebarWidth}px` }}
      >
        {children}
      </main>
    </div>
  );
};

// Modern Loading Component
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

// Modern 404 Component
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

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  useEffect(() => {
    if (!token) {
      sessionStorage.removeItem("token");
      navigate("/login", { replace: true });
    } else {
      sessionStorage.setItem("token", token);
    }
  }, [token, navigate]);

  const handleLogout = () => {
    setToken("");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const handleLogin = (newToken) => {
    if (!newToken) {
      toast.error("Invalid login token");
      return;
    }
    setToken(newToken);
    toast.success("Logged in successfully");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
        className="!top-20 !right-4 !left-4 sm:!left-auto sm:!right-4"
        toastClassName="!bg-slate-800/95 !backdrop-blur-xl !border !border-slate-700/50 !text-white !rounded-xl !shadow-2xl"
        progressClassName="!bg-gradient-to-r !from-indigo-500 !to-purple-500"
      />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setToken={handleLogin} />
            )
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes */}
        {[
          { path: "/dashboard", Component: Dashboard },
          { path: "/add", Component: Add },
          { path: "/list", Component: List },
          { path: "/orders", Component: Order },
          { path: "/order-charts", Component: OrderCharts },
          { path: "/userprofile", Component: Users },
        ].map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <DashboardLayout handleLogout={handleLogout}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Component token={token} />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;