import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

// Pages
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";

// Constants
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

// Public Route Component (for login)
const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  if (token) {
    const from = location.state?.from || "/add";
    return <Navigate to={from} replace />;
  }
  return children;
};

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(
    () => sessionStorage.getItem("token") || ""
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          sessionStorage.setItem("token", token);
        } else {
          sessionStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token, navigate]);

  const handleLogout = () => {
    setToken("");
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    sessionStorage.setItem("token", newToken);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login setToken={handleLogin} />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar setToken={handleLogout} />
                <hr className="border-gray-200" />
                <div className="flex flex-1 w-full mt-16">
                  <Sidebar />
                  <main className="flex-1 p-4 overflow-auto">
                    <Add token={token} />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar setToken={handleLogout} />
                <hr className="border-gray-200 " />
                <div className="flex flex-1 w-full mt-16">
                  <Sidebar />
                  <main className="flex-1 p-4 overflow-auto">
                    <List token={token} />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar setToken={handleLogout} />
                <hr className="border-gray-200" />
                <div className="flex flex-1 w-full mt-16">
                  <Sidebar />
                  <main className="flex-1 p-4 overflow-auto">
                    <Order token={token} />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Page not found</p>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to Home
              </button>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
