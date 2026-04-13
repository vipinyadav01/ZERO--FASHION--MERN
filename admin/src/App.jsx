import React, { useEffect, useState, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import LoadingSpinner from './components/LoadingSpinner';
import NotFound from './components/NotFound';
import CreateAdmin from './pages/CreateAdmin';
import Notification from './components/Notification';
import { backendUrl } from './constants';

// Lazy load all pages
const Dashboard   = React.lazy(() => import('./pages/Dashboard'));
const Analytics   = React.lazy(() => import('./pages/Analytics'));
const Add         = React.lazy(() => import('./pages/Add'));
const List        = React.lazy(() => import('./pages/List'));
const Order       = React.lazy(() => import('./pages/Order'));
const EditProduct = React.lazy(() => import('./pages/EditProduct'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const Inventory   = React.lazy(() => import('./pages/Inventory'));
const Settings    = React.lazy(() => import('./pages/Settings'));

const ProtectedRoute = ({ children, token }) => {
    if (!token) return <Navigate to="/login" replace />;
    return children;
};
ProtectedRoute.propTypes = { children: PropTypes.node.isRequired, token: PropTypes.string.isRequired };

const DashboardLayout = ({ children, onLogout }) => {
    const [sidebarWidth, setSidebarWidth] = useState(64);
    return (
        <div className="min-h-screen bg-[#F8F8F6]">
            <Sidebar onWidthChange={setSidebarWidth} onLogout={onLogout} />
            <Notification />
            <main
                className="min-h-screen transition-all duration-300"
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

const App = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(sessionStorage.getItem('token') || '');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem('token');
        if (!stored || stored === 'undefined' || stored === 'null') {
            sessionStorage.removeItem('token');
            setToken('');
            navigate('/login', { replace: true });
            setReady(true);
            return;
        }
        // Verify token is still valid with the backend
        axios.get(`${backendUrl}/api/user/verify`, {
            headers: { Authorization: `Bearer ${stored}` },
        }).then(res => {
            if (res.data?.success) {
                setToken(stored);
            } else {
                sessionStorage.removeItem('token');
                setToken('');
                navigate('/login', { replace: true });
            }
        }).catch(() => {
            // Network error or token invalid — clear and redirect
            sessionStorage.removeItem('token');
            setToken('');
            navigate('/login', { replace: true });
        }).finally(() => {
            setReady(true);
        });
    }, []);

    useEffect(() => {
        if (token) sessionStorage.setItem('token', token);
        else {
            sessionStorage.removeItem('token');
            navigate('/login', { replace: true });
        }
    }, [token, navigate]);

    const handleLogin = (t) => {
        if (!t) { toast.error('Invalid login token'); return; }
        setToken(t);
        toast.success('Welcome back!');
    };

    const handleLogout = () => {
        setToken('');
        sessionStorage.clear();
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    if (!ready) return <LoadingSpinner title="Loading" subtitle="Setting up admin panel..." />;

    const routes = [
        { path: '/dashboard',    Component: Dashboard },
        { path: '/analytics',    Component: Analytics },
        { path: '/add',          Component: Add },
        { path: '/list',         Component: List },
        { path: '/orders',       Component: Order },
        { path: '/users',        Component: UserProfile },
        { path: '/edit/:id',     Component: EditProduct },
        { path: '/admin-create', Component: CreateAdmin },
        { path: '/inventory',    Component: Inventory },
        { path: '/settings',     Component: Settings },
    ];

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable={false}
                theme="light"
                className="!top-4 !right-4 !left-4 sm:!left-auto"
                toastClassName="!bg-white !border !border-brand-border !text-brand-text-primary !rounded-none !shadow-sm"
                progressClassName="!bg-brand-accent"
            />
            <Routes>
                <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login setToken={handleLogin} />} />
                <Route path="/" element={<Navigate to="/login" replace />} />

                {routes.map(({ path, Component }) => (
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

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;
