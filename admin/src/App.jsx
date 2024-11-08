import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
const ProtectedRoute = ({ children, token }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    setIsLoading(false);
  }, [token]);

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login"); // Redirect to login after logout
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

      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar setToken={handleLogout} />
          <hr className="border-gray-200" />
          <div className="flex flex-1 w-full">
            <Sidebar />
            <main className="flex-1 p-4 overflow-auto">
              <Routes>
                {/* Redirect to /list if logged in */}
                <Route path="/" element={<Navigate to="/list" replace />} /> 

                <Route
                  path="/add"
                  element={
                    <ProtectedRoute token={token}>
                      <Add token={token} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/list"
                  element={
                    <ProtectedRoute token={token}>
                      <List token={token} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute token={token}>
                      <Order token={token} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="*"
                  element={
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                      <p className="text-gray-600 mb-4">Page not found</p>
                      <button
                        onClick={() => navigate("/list")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Go to Home
                      </button>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;