import { useEffect, useState, useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
    const { token, setCartItems, backendUrl } = useContext(ShopContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const verifyPayment = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const storedToken = localStorage.getItem('token') || token;
            
            if (!storedToken) {
                setError("Authentication required. Please login to continue.");
                toast.error("Please login to continue");
                setTimeout(() => navigate("/login"), 2000);
                return;
            }

            if (!orderId) {
                setError("Invalid order ID. Unable to verify payment.");
                toast.error("Invalid order ID");
                setTimeout(() => navigate("/cart"), 2000);
                return;
            }

            // Validate success parameter
            if (success !== "true" && success !== "false") {
                setError("Invalid payment status. Please try again.");
                toast.error("Invalid payment status");
                setTimeout(() => navigate("/cart"), 2000);
                return;
            }

            console.log("Making verification request:", {
                url: `${backendUrl}/api/order/verifyStripe?success=${success}&orderId=${orderId}`,
                orderId,
                success,
                token: storedToken ? 'Present' : 'Missing'
            });

            const response = await axios.get(
                `${backendUrl}/api/order/verifyStripe?success=${success}&orderId=${orderId}`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${storedToken}`
                    },
                    timeout: 10000 // 10 second timeout
                }
            );

            if (response.data.success) {
                setCartItems({});
                localStorage.removeItem('cartItems'); // Clear cart from localStorage
                toast.success("Payment verified successfully! Order confirmed.");
                setTimeout(() => navigate("/order"), 1500);
            } else {
                const errorMsg = response.data.message || "Payment verification failed";
                setError(errorMsg);
                toast.error(errorMsg);
                if (success === "false") {
                    setTimeout(() => navigate("/cart"), 2000);
                }
            }

        } catch (error) {
            console.error("Payment verification error:", error);
            console.error("Error details:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                orderId,
                success
            });
            
            let errorMessage = "Something went wrong during payment verification";
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timeout. Please check your connection and try again.";
            } else if (error.response?.status === 400) {
                errorMessage = error.response?.data?.message || "Bad request. Invalid order or payment data.";
            } else if (error.response?.status === 401) {
                errorMessage = "Authentication failed. Please login again.";
                setTimeout(() => navigate("/login"), 2000);
            } else if (error.response?.status === 404) {
                errorMessage = "Order not found. It may have been processed already.";
            } else if (error.response?.status === 500) {
                errorMessage = "Server error. Please try again or contact support.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
            
            // Don't auto-navigate on error, let user choose
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [success, orderId]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 shadow-xl text-center max-w-md mx-4">
                {isLoading ? (
                    <>
                        <div className="relative mb-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-black mx-auto"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-black rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-3">Verifying Payment</h2>
                        <p className="text-gray-600 mb-4">Please wait while we confirm your transaction...</p>
                        <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                    </>
                ) : error ? (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 text-2xl">✕</span>
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-3">Verification Failed</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/cart")}
                                className="w-full bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
                            >
                                Return to Cart
                            </button>
                            <button
                                onClick={() => navigate("/order")}
                                className="w-full bg-gray-100 text-black py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                            >
                                View Orders
                            </button>
                        </div>
                    </>
                ) : success === "true" ? (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-500 text-2xl">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-3">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">Your order has been confirmed and payment processed successfully.</p>
                        <button
                            onClick={() => navigate("/order")}
                            className="w-full bg-black text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200"
                        >
                            View Your Orders
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default Verify
