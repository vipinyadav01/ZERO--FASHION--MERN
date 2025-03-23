import  { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { Trash2, Search,  Plus, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

const List = ({ token }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Main color theme
    const primaryColor = "#131313"; 
    const secondaryColor = "#939393"; 
    const accentColor = "#ff6200"; 

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

    // Filter products based on search query
    const filteredProducts = list.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: primaryColor }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: accentColor, borderTopColor: 'transparent' }}></div>
                    <p style={{ color: secondaryColor }} className="font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    if (!list.length) {
        return (
            <div className="min-h-screen py-8 px-4" style={{ backgroundColor: primaryColor }}>
                <div className="rounded-3xl shadow-lg max-w-3xl mx-auto p-8" style={{ backgroundColor: '#1a1a1a', borderWidth: '1px', borderColor: '#2a2a2a' }}>
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                        <div className="rounded-full p-6 mb-6" style={{ backgroundColor: `rgba(255, 98, 0, 0.15)` }}>
                            <Sparkles className="w-12 h-12" style={{ color: accentColor }} />
                        </div>
                        <h3 className="text-xl font-semibold mb-3" style={{ color: 'white' }}>No products found</h3>
                        <p style={{ color: secondaryColor }} className="max-w-md mb-6">Add some products to get started. They will appear here once created.</p>
                        <button 
                            className="inline-flex items-center px-5 py-2.5 rounded-xl font-medium"
                            style={{ backgroundColor: accentColor, color: 'white' }}>
                            <Plus className="mr-2 h-5 w-5" />
                            Add New Product
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-4" style={{ backgroundColor: primaryColor }}>
            <div className="rounded-3xl shadow-lg max-w-6xl mx-auto overflow-hidden" style={{ backgroundColor: '#1a1a1a', borderWidth: '1px', borderColor: '#2a2a2a' }}>
                {/* Header */}
                <div className="border-b px-6 py-5" style={{ borderColor: '#2a2a2a' }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-2xl font-bold" style={{ color: 'white' }}>
                            Products ({filteredProducts.length})
                        </h2>
                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative flex-grow max-w-xs">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5" style={{ color: secondaryColor }} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{ 
                                        backgroundColor: '#2a2a2a', 
                                        color: 'white', 
                                        borderWidth: '1px', 
                                        borderColor: '#3a3a3a',
                                        caretColor: accentColor
                                    }}
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            
                            {/* Add Product Button */}
                            <button 
                                className="inline-flex items-center px-4 py-2 rounded-xl font-medium"
                                style={{ backgroundColor: accentColor, color: 'white' }}>
                                <Plus className="mr-2 h-5 w-5" />
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {currentItems.map((item) => (
                        <div 
                            key={item._id} 
                            className="rounded-2xl p-4 transition-transform duration-200 hover:scale-102 hover:shadow-lg"
                            style={{ 
                                backgroundColor: '#252525', 
                                borderWidth: '1px', 
                                borderColor: '#333333',
                            }}
                        >
                            <div className="relative">
                                <div className="h-48 w-full overflow-hidden rounded-xl bg-gray-800">
                                    <img
                                        className="h-full w-full object-cover"
                                        src={item.image[0]}
                                        alt={item.name}
                                    />
                                </div>
                                <span 
                                    className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium"
                                    style={{ backgroundColor: `rgba(255, 98, 0, 0.15)`, color: accentColor }}
                                >
                                    {item.category}
                                </span>
                            </div>
                            
                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold truncate" style={{ color: 'white' }}>{item.name}</h3>
                                    <span className="font-bold" style={{ color: accentColor }}>
                                        {currency}{item.price.toLocaleString()}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4">
                                    <button
                                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm"
                                        style={{ backgroundColor: '#3a3a3a', color: 'white' }}
                                    >
                                        Edit
                                    </button>
                                    
                                    <button
                                        onClick={() => handleRemoveProduct(item._id)}
                                        disabled={deleting === item._id}
                                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg"
                                        style={{ backgroundColor: '#3a3a3a', color: '#f87171' }}
                                        aria-label="Delete product"
                                    >
                                        {deleting === item._id ? (
                                            <div className="animate-spin h-5 w-5">
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        ) : (
                                            <Trash2 className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-6 border-t" style={{ borderColor: '#2a2a2a' }}>
                        <button 
                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg disabled:opacity-50"
                            style={{ backgroundColor: '#252525', color: 'white' }}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className="inline-flex items-center justify-center h-8 w-8 rounded-lg"
                                style={{ 
                                    backgroundColor: currentPage === index + 1 ? accentColor : '#252525',
                                    color: currentPage === index + 1 ? 'white' : secondaryColor,
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg disabled:opacity-50"
                            style={{ backgroundColor: '#252525', color: 'white' }}
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default List;