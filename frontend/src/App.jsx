import  { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Page components
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
import TrackOrder from "./pages/TrackOrder";
import PrivacyPolicy from "./pages/Privacy-Policy";
import Wishlist from "./pages/Wishlist";
import Notification from "./pages/Notification";
import Support from "./pages/Support";

// Layout components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";

const App = () => {
    const [toastPosition, setToastPosition] = useState("top-right");

    useEffect(() => {
        const handleResize = () => {
            setToastPosition(window.innerWidth > 768 ? "top-right" : "bottom-center");
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <ToastContainer
                position={toastPosition}
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                limit={3}
                theme="colored"
                style={{
                    width: toastPosition === "top-right" ? "400px" : "90%",
                    fontSize: window.innerWidth < 640 ? "14px" : "16px",
                    padding: window.innerWidth < 640 ? "10px" : "15px"
                }}
            />

            <div className="flex-grow px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                <Navbar />
                <SearchBar />

                <main className="py-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/collection" element={<Collection />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/product/:productId" element={<Product />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/place-order" element={<PlaceOrder />} />
                        <Route path="/order" element={<Orders />} />
                        <Route path="/verify" element={<Verify />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/TrackOrder" element={<TrackOrder />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/notifications" element={<Notification />} />
                        <Route path="/support" element={<Support />} />
                    </Routes>
                </main>

                <Footer />
            </div>

            <SpeedInsights />
        </div>
    );
};

export default App;
