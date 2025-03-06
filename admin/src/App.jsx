import React, { useEffect, useState, Suspense } from "react";
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
import { MoveLeft, AlertCircle } from 'lucide-react';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Add = React.lazy(() => import("./pages/Add"));
const List = React.lazy(() => import("./pages/List"));
const Order = React.lazy(() => import("./pages/Order"));
const OrderCharts = React.lazy(() => import("./pages/OrderCharts"));
const Setting = React.lazy(() => import("./pages/Setting"));
const Users = React.lazy(() => import("./pages/UserProfile"));

// Environment variables
export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
export const currency = "₹";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        // Save the location they were trying to access
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
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar setToken={handleLogout} />
        <div className="flex flex-1 w-full mt-16">
            <Sidebar />
            <main className="flex-1 p-4 md:p-6 overflow-auto">
                <ErrorBoundary fallback={<ErrorFallback />}>
                    {children}
                </ErrorBoundary>
            </main>
        </div>
    </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Component error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || <ErrorFallback error={this.state.error} />;
        }
        return this.props.children;
    }
}

// Error Fallback Component
const ErrorFallback = ({ error }) => {
    const navigate = useNavigate();

    return (
        <div className="rounded-lg bg-white shadow-lg p-6 max-w-md mx-auto mt-8">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
                {error?.message || "An unexpected error occurred while loading this page."}
            </p>
            <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                Go to Dashboard
            </button>
        </div>
    );
};

// 404 Component
const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = sessionStorage.getItem("token");

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (token) {
                    sessionStorage.setItem("token", token);
                    // Optional: validate token with backend here
                } else {
                    sessionStorage.removeItem("token");
                    navigate("/login", { replace: true });
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setAuthError(error.message || "Authentication failed");
                handleLogout();
            } finally {
                // Delay slightly to avoid flash of loading state
                setTimeout(() => setIsLoading(false), 300);
            }
        };

        checkAuth();
    }, [token, navigate]);

    const handleLogout = () => {
        setToken("");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
    };

    const handleLogin = (newToken, username) => {
        if (!newToken) {
            toast.error("Invalid login token");
            return;
        }
        setToken(newToken);
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("user", username || "User");
        toast.success("Logged in successfully");
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (authError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                    <AlertCircle className="text-red-500 h-12 w-12 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-center mb-4">Authentication Error</h1>
                    <p className="text-gray-600 text-center mb-6">{authError}</p>
                    <button
                        onClick={() => {
                            setAuthError(null);
                            navigate("/login", { replace: true });
                        }}
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Return to Login
                    </button>
                </div>
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
                {[
                    { path: "/dashboard", Component: Dashboard },
                    { path: "/add", Component: Add },
                    { path: "/list", Component: List },
                    { path: "/orders", Component: Order },
                    { path: "/order-charts", Component: OrderCharts },
                    { path: "/setting", Component: Setting },
                    { path: "/UserProfile", Component: Users },
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
        </div>
    );
};

export default App;
