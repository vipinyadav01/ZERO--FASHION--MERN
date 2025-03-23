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
export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";
export const currency = "₹";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Layout Component
const DashboardLayout = ({ children, handleLogout }) => (
  <div className="flex min-h-screen bg-[#131313]">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar setToken={handleLogout} />
      <main className="flex-1 p-6 overflow-auto bg-[#131313] text-white">
        {children}
      </main>
    </div>
  </div>
);

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#131313]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#ff6200]"></div>
  </div>
);

// 404 Component
const NotFound = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!sessionStorage.getItem("token");

  return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center p-6">
      <div className="bg-[#1a1a1a] rounded-xl p-8 text-center max-w-md w-full border border-[#939393]/20 shadow-lg">
        <AlertCircle className="h-12 w-12 text-[#ff6200] mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-[#939393] mb-4">Page not found</p>
        <button
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
          className="px-6 py-2 bg-[#ff6200] text-white rounded-lg hover:bg-[#ff4500] transition-colors"
        >
          Go to {isAuthenticated ? "Dashboard" : "Login"}
        </button>
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