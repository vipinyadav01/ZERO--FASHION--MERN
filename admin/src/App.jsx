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
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";
import OrderCharts from "./pages/OrderCharts";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import { MoveLeft, AlertCircle } from 'lucide-react';

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

// Public Route Component
const PublicRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    const location = useLocation();

    if (token) {
        const from = location.state?.from || "/dashboard";
        return <Navigate to={from} replace />;
    }
    return children;
};

// Layout Component
const DashboardLayout = ({ children, handleLogout }) => (
    <div className="flex flex-col min-h-screen">
        <Navbar setToken={handleLogout} />
        <hr className="border-gray-200" />
        <div className="flex flex-1 w-full mt-16">
            <Sidebar />
            <main className="flex-1 p-4 overflow-auto">
                {children}
            </main>
        </div>
    </div>
);

// 404 Component
const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = sessionStorage.getItem("token");

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="mb-8">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-2">Page Not Found</p>
                    <p className="text-gray-500">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Attempted path: {location.pathname}
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <MoveLeft className="h-5 w-5" />
                        Go Back
                    </button>

                    <button
                        onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go to {isAuthenticated ? 'Dashboard' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Loading Component
const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
        </div>
    </div>
);

const App = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");
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
        sessionStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const handleLogin = (newToken, username) => {
        setToken(newToken);
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("user", username);
    };

    if (isLoading) {
        return <LoadingSpinner />;
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
                {[
                    { path: "/dashboard", Component: Dashboard },
                    { path: "/add", Component: Add },
                    { path: "/list", Component: List },
                    { path: "/orders", Component: Order },
                    { path: "/order-charts", Component: OrderCharts },
                    { path: "/profile", Component: Profile },
                    { path: "/setting", Component: Setting },
                ].map(({ path, Component }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <ProtectedRoute>
                                <DashboardLayout handleLogout={handleLogout}>
                                    <Component token={token} />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                ))}

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
};

export default App;
