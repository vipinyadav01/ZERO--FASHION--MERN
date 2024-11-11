import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const TrackOrder = () => {
    const { backendUrl, token } = useContext(ShopContext);  
    const [orderId, setOrderId] = useState('');
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrackOrder = async () => {
        if (!token) {
            setError("You must be logged in to track your order.");
            return;
        }
        if (!orderId.trim()) {
            setError("Please enter a valid Order ID");
            return;
        }

        setLoading(true);
        setError(null);
        setOrderDetails(null);

        try {
            const response = await fetch(`${backendUrl}/api/order/userorders`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderId })
            });

            if (response.ok) {
                const data = await response.json();
                setOrderDetails(data); // Assuming data contains order details
            } else if (response.status === 401) {
                setError("Not Authorized. Please log in again.");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Unable to find order. Please check the Order ID.");
            }
        } catch (err) {
            setError("An error occurred while tracking your order. Please try again.");
            console.error("Order tracking error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-24">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Track Your Order</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter Order ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={handleTrackOrder}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                >
                    {loading ? 'Tracking...' : 'Track Order'}
                </button>

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        {error}
                    </div>
                )}

                {orderDetails && (
                    <div className="mt-6 bg-gray-50 p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Order ID:</span>
                                <span>{orderDetails._id || orderDetails.orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Status:</span>
                                <span
                                    className={`font-bold ${orderDetails.status === 'Delivered' ? 'text-green-600' :
                                        orderDetails.status === 'Cancelled' ? 'text-red-600' :
                                            'text-yellow-600'
                                        }`}
                                >
                                    {orderDetails.status || 'Processing'}
                                </span>
                            </div>

                            {orderDetails.items && orderDetails.items.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Order Items:</h4>
                                    {orderDetails.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border rounded-md p-3 mb-2"
                                        >
                                            <div className="flex justify-between">
                                                <span>{item.name || 'Product'}</span>
                                                <span>Qty: {item.quantity || 1}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
