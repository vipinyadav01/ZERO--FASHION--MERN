import { useEffect, useState, useCallback } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Verify from "./pages/Verify";
import Profile from "./pages/profile";
import EditProfile from "./pages/EditProfile";
import TrackOrder from "./pages/TrackOrder";
import PrivacyPolicy from "./pages/Privacy-Policy";
import Wishlist from "./pages/Wishlist";
import Notification from "./pages/Notification";
import Support from "./pages/Support";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
    const location = useLocation();
    const [toastPosition, setToastPosition] = useState("top-right");
    const [isMobile, setIsMobile] = useState(false);

    const handleResize = useCallback(() => {
        const width = window.innerWidth;
        const mobile = width <= 768;
        setIsMobile(mobile);
        setToastPosition(mobile ? "bottom-center" : "top-right");
    }, []);

    useEffect(() => {
        handleResize();
        
        window.addEventListener("resize", handleResize);
        
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);

    const toastConfig = {
        position: toastPosition,
        autoClose: 3000,
        hideProgressBar: false,
        newestOnTop: true,
        closeOnClick: true,
        rtl: false,
        pauseOnFocusLoss: true,
        draggable: true,
        pauseOnHover: true,
        limit: 3,
        theme: "colored",
        style: {
            width: isMobile ? "90%" : "400px",
            fontSize: isMobile ? "14px" : "16px",
            padding: isMobile ? "10px" : "15px"
        }
    };

    return (
        <HelmetProvider>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <ToastContainer {...toastConfig} />

                <div className="flex-grow flex flex-col">
                    <Navbar />

                    <main className="flex-grow px-4 sm:px-6 lg:px-8 pt-0 pb-4 sm:pb-6">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/collection" element={<Collection />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/product/:productId" element={<Product />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/verify" element={<Verify />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                            <Route path="/support" element={<Support />} />
                            <Route path="/track-order" element={<TrackOrder />} />
                            <Route path="/TrackOrder" element={<TrackOrder />} /> {/* Legacy route */}
                            
                            <Route path="/place-order" element={<PlaceOrder />} />
                            <Route path="/order" element={<Orders />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/edit-profile" element={<EditProfile />} />
                            <Route path="/wishlist" element={<Wishlist />} />
                            <Route path="/notifications" element={<Notification />} />
                            
                            {/* Catch-all route for 404 */}
                            <Route path="*" element={
                                <div className="flex items-center justify-center min-h-[60vh]">
                                    <div className="text-center">
                                        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                                        <p className="text-gray-600 mb-6">Page not found</p>
                                        <button
                                            onClick={() => window.history.back()}
                                            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            } />
                        </Routes>
                    </main>

                    <Footer />
                </div>

                <SpeedInsights />
            </div>
        </HelmetProvider>
    );
};

export default App;
