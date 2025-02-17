import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { Trash2 } from "lucide-react";

const List = ({ token }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    const fetchList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setList(response.data.products);
            } else {
                toast.error(response.data.message || "Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error(error.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            setDeleting(id);
            const response = await axios.post(
                `${backendUrl}/api/product/remove`,
                { id },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Product removed successfully");
                await fetchList();
            } else {
                toast.error(response.data.message || "Failed to remove product");
            }
        } catch (error) {
            console.error("Error removing product:", error);
            toast.error(error.message || "Failed to remove product");
        } finally {
            setDeleting(null);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-500 font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    if (!list.length) {
        return (
            <div className="bg-white rounded-lg shadow-lg my-6 overflow-hidden">
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8">
                    <div className="rounded-full bg-blue-50 p-6 mb-4">
                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 max-w-md">Add some products to get started. They will appear here once created.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto">
            <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Products ({list.length})
                    </h2>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Product Details
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {list.map((item) => (
                            <tr key={item._id} className="group hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                            <img
                                                className="h-12 w-12 object-cover"
                                                src={item.image[0]}
                                                alt={item.name}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-gray-900">{item.name}</div>
                                            <div className="text-sm text-gray-500 lg:hidden">{item.category}</div>
                                            <div className="text-sm font-medium text-gray-900 sm:hidden">
                                                {currency}{item.price.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden lg:table-cell">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 hidden sm:table-cell">
                                    <span className="text-sm font-medium text-gray-900">
                                        {currency}{item.price.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleRemoveProduct(item._id)}
                                        disabled={deleting === item._id}
                                        className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                        aria-label="Delete product"
                                    >
                                        {deleting === item._id ? (
                                            <div className="animate-spin h-5 w-5 text-red-500">
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        ) : (
                                            <Trash2 className="h-5 w-5" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default List;
