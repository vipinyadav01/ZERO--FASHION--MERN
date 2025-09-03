import React, { useEffect, useState, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import LoadingSpinner from "./components/LoadingSpinner";
import NotFound from "./components/NotFound";
import CreateAdmin from "./pages/CreateAdmin";
import Notification from "./components/Notification";

// Lazy load pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Add = React.lazy(() => import("./pages/Add"));
const List = React.lazy(() => import("./pages/List"));
const Order = React.lazy(() => import("./pages/Order"));
const OrderCharts = React.lazy(() => import("./pages/OrderCharts"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));

// Protected Route Component
const ProtectedRoute = ({ children, token }) => {
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  token: PropTypes.string.isRequired,
};

const DashboardLayout = ({ children, onLogout }) => {
  const [sidebarWidth, setSidebarWidth] = useState(80);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar onWidthChange={setSidebarWidth} onLogout={onLogout} />
      <main
        className="min-h-screen pt-0 transition-all duration-300"
        style={{ paddingLeft: `${sidebarWidth}px` }}
      >
        {children}
      </main>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  onLogout: PropTypes.func,
};

// Main App Component
const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    
    if (storedToken && !token) {
      setToken(storedToken);
    } else if (!storedToken && !token) {
      navigate("/login", { replace: true });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);



  const handleLogin = (newToken) => {
    if (!newToken) {
      toast.error("Invalid login token");
      return;
    }
    setToken(newToken);
  };

  const handleLogout = () => {
    
    setToken("");
    sessionStorage.clear();
    localStorage.clear(); 
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return <LoadingSpinner title="Initializing" subtitle="Setting up your dashboard..." />;
  }

  return (
    <>
      <Notification />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={false}
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
          { path: "/users", Component: UserProfile },
          { path: "/admin-create", Component: CreateAdmin},
        ].map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute token={token}>
                <DashboardLayout onLogout={handleLogout}>
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