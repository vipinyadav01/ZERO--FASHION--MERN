import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext);
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const verifyPayment = async () => {
        try {
            const storedToken = localStorage.getItem('token') || token;
            
            if (!storedToken) {
                toast.error("Please login to continue");
                navigate("/login");
                return;
            }

            if (!orderId) {
                toast.error("Invalid order ID");
                navigate("/cart");
                return;
            }

            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`,
                { success, orderId },
                { 
                    headers: { 
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json'
                    } 
                }
            );

            if (response.data.success) {
                setCartItems({});
                toast.success("Payment verified successfully");
                navigate("/order");
            } else {
                toast.error("Payment verification failed");
                navigate("/cart");
            }

        } catch (error) {
            console.error("Payment verification error:", error);
            setError(error.response?.data?.message || "Something went wrong during payment verification");
            toast.error(error.response?.data?.message || "Something went wrong during payment verification");
            navigate("/cart");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [success, orderId]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verifying your payment</h2>
                        <p className="text-gray-600">Please wait while we process your transaction...</p>
                    </>
                ) : error ? (
                    <>
                        <div className="text-red-500 text-xl mb-4">❌</div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Verification Failed</h2>
                        <p className="text-red-600">{error}</p>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default Verify
