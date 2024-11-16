import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Title from "../components/Title";
import { ShopContext } from '../context/ShopContext';

const TrackOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        // Log the received state to debug
        console.log("Location state:", location.state);

        if (location.state?.orderDetails) {
            setOrderDetails(location.state.orderDetails);
        }
    }, [location.state]);

    // Handle going back to orders page
    const handleGoBack = () => {
        navigate('/order');
    };
    useEffect(() => {
        console.log("Received order details:", location.state?.orderDetails);
        if (location.state?.orderDetails) {
            setOrderDetails(location.state.orderDetails);
        }
    }, [location.state]);

    // If no state or order details, show error
    if (!location.state?.orderDetails) {
        return (
            <div className="container mx-auto px-4 py-8 pt-24">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">No order details found. Please go back and try again.</p>
                        <button
                            onClick={handleGoBack}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error("Date formatting error:", error);
            return 'Invalid Date';
        }
    };

    // Determine step completion based on order status
    const getStepCompletion = (status) => {
        switch (status) {
            case 'Order Placed':
                return [true, false, false, false, false];
            case 'Packing':
                return [true, true, false, false, false];
            case 'Shipped':
                return [true, true, true, false, false];
            case 'Out for Delivery':
                return [true, true, true, true, false];
            case 'Delivered':
                return [true, true, true, true, true];
            case 'Cancelled':
                return [false, false, false, false, false];
            default:
                return [false, false, false, false, false];
        }
    };


    const getStepClassName = (stepStatus) => {
        return `w-8 h-8 rounded-full flex items-center justify-center ${stepStatus ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
            }`;
    };

    const getLineClassName = (completed) => {
        return `flex-1 h-1 ${completed ? 'bg-green-500' : 'bg-gray-300'}`;
    };

    const stepCompletion = getStepCompletion(orderDetails?.status);

    return (
        <div className="container mx-auto px-4 py-8 mt-24">
            <div className="mb-8">
                <Title text1="TRACK" text2="ORDER" />
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                {/* Back Button */}
                <div className="mb-4">
                    <button
                        onClick={handleGoBack}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 transition duration-300 flex items-center"
                    >
                        ← Back to Orders
                    </button>
                </div>

                {/* Order Details */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-4">
                            <img
                                src={orderDetails?.image?.[0] || "/placeholder.svg"}
                                alt={orderDetails?.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="space-y-2">
                                <p className="font-semibold text-lg">{orderDetails?.name || 'N/A'}</p>

                                <div className="text-gray-600 space-y-1">
                                    <p>
                                        <span className="font-medium">Order ID: </span>
                                        {orderDetails?.orderId || 'N/A'}
                                    </p>

                                    <p>
                                        <span className="font-medium">Size: </span>
                                        {orderDetails?.size || 'N/A'}
                                    </p>

                                    <p>
                                        <span className="font-medium">Quantity: </span>
                                        {orderDetails?.quantity || 'N/A'}
                                    </p>

                                    <p>
                                        <span className="font-medium">Price: </span>
                                        ${orderDetails?.price || 'N/A'}
                                    </p>

                                    <p>
                                        <span className="font-medium">Payment Method: </span>
                                        {orderDetails?.paymentMethod || 'N/A'}
                                    </p>

                                    <p>
                                        <span className="font-medium">Order Date: </span>
                                        {formatDate(orderDetails?.date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracking Status */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-6">Tracking Status</h3>
                    <div className="relative">
                        {/* Progress Steps */}
                        <div className="flex items-center justify-between">
                            {/* Order Placed */}
                            <div className="flex flex-col items-center">
                                <div className={getStepClassName(stepCompletion[0])}>
                                    <span>✓</span>
                                </div>
                                <p className="mt-2 text-sm">Order Placed</p>
                            </div>

                            {/* Processing */}
                            <div className="flex-1 flex items-center">
                                <div className={getLineClassName(stepCompletion[1])}></div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className={getStepClassName(stepCompletion[1])}>
                                    <span>✓</span>
                                </div>
                                <p className="mt-2 text-sm">Processing</p>
                            </div>

                            {/* Shipped */}
                            <div className="flex-1 flex items-center">
                                <div className={getLineClassName(stepCompletion[2])}></div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className={getStepClassName(stepCompletion[2])}>
                                    <span>✓</span>
                                </div>
                                <p className="mt-2 text-sm">Shipped</p>
                            </div>

                            {/* Delivered */}
                            <div className="flex-1 flex items-center">
                                <div className={getLineClassName(stepCompletion[3])}></div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className={getStepClassName(stepCompletion[3])}>
                                    <span>✓</span>
                                </div>
                                <p className="mt-2 text-sm">Delivered</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-center text-lg font-medium">
                        Current Status:
                        <span className={`ml-2 ${orderDetails?.status === 'Delivered' ? 'text-green-600' :
                            orderDetails?.status === 'Cancelled' ? 'text-red-600' :
                                'text-blue-600'
                            }`}>
                            {orderDetails?.status || 'Processing'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;