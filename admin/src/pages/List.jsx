import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl, currency } from "../App";

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
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!list.length) {
        return (
            <div className="bg-blue-50 text-blue-700 p-6 rounded-lg shadow-md my-6 text-center">
                <p className="text-lg font-semibold">No products found.</p>
                <p className="mt-2">Add some products to see them listed here.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">All Products</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {list.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={item.image[0]} alt={item.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                <div className="text-sm text-gray-500 sm:hidden">{item.category}</div>
                                                <div className="text-sm font-medium text-gray-900 sm:hidden">
                                                    {currency}
                                                    {item.price.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                        {currency}
                                        {item.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleRemoveProduct(item._id)}
                                            disabled={deleting === item._id}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 ease-in-out"
                                        >
                                            {deleting === item._id ? (
                                                <svg className="animate-spin h-5 w-5 text-red-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            <span className="sr-only">Delete product</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default List;
