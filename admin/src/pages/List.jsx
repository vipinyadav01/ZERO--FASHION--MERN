import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl, currency } from "../constants";
import { 
  Trash2, 
  Search, 
  Plus, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Package,
  Edit3,
  Filter,
  Grid3X3,
  List as ListIcon,
  Eye,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedCategory, setSelectedCategory] = useState('');
  const itemsPerPage = window.innerWidth < 768 ? 6 : 9; // More items on mobile for better scrolling
  const navigate = useNavigate();

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
      toast.error(error.response?.data?.message || "Failed to load products");
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Product removed successfully");
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Error removing product:", error);
      if (error.response?.status === 401) {
        toast.error("Admin access required. Please log in again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to remove product");
      }
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchList();
    } else {
      setLoading(false);
      toast.error("Please log in as admin to view products");
      navigate("/login");
    }
  }, [token, navigate]);

  // Filter products based on search query and category
  const filteredProducts = list.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(list.map(product => product.category))];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Mobile loading state
  if (loading) {
    return null; // Loading is now handled by App.jsx
  }

  // Mobile empty state
  if (!list.length) {
    return (
              <div className="min-h-screen px-3 pt-8 pb-6 sm:pt-10 lg:pt-12">
        <div className="max-w-md mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-6">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Package className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">No Products Yet</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Start building your inventory by adding your first product.
                </p>
              </div>
              <button 
                onClick={() => navigate('/add')}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add First Product
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
            <div className="min-h-screen">
      {/* Mobile-first container */}
      <div className="px-3 pt-8 pb-6 sm:px-4 sm:pt-10 lg:px-6 lg:pt-12">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Mobile-first Header */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl border border-slate-600/50 shadow-2xl p-4 sm:p-6">
            <div className="space-y-4">
              {/* Title and Stats Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/20">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Product Inventory</h1>
                    <p className="text-xs sm:text-sm text-slate-400">{filteredProducts.length} products</p>
                  </div>
                </div>
                
                {/* Add Product Button - Mobile optimized */}
                <button
                  onClick={() => navigate('/add')}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Product</span>
                </button>
              </div>

              {/* Mobile-first Search and Filters */}
              <div className="space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-sm"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-4 w-4 text-slate-400 hover:text-white transition-colors" />
                    </button>
                  )}
                </div>

                {/* Mobile-first Filter Row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="flex-shrink-0 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  {/* View Toggle - Hidden on mobile */}
                  <div className="hidden sm:flex items-center ml-auto bg-slate-700/50 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      <ListIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          {filteredProducts.length === 0 ? (
            /* No Results State */
            <div className="relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-600/20 flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">No Products Found</h3>
                  <p className="text-sm text-slate-400">
                    {searchQuery || selectedCategory ? 'Try adjusting your search or filters' : 'No products available'}
                  </p>
                </div>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                      setCurrentPage(1);
                    }}
                    className="mt-4 px-4 py-2 bg-slate-600/50 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Products Grid - Mobile-first responsive */}
              <div className={`grid gap-3 sm:gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                  : 'grid-cols-1'
              }`}>
                {currentItems.map((item) => (
                  <div
                    key={item._id}
                    className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/60 transition-all duration-300 active:scale-95 cursor-pointer ${
                      viewMode === 'list' ? 'p-4 sm:p-6' : 'p-3 sm:p-4'
                    }`}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    {viewMode === 'grid' ? (
                      /* Grid View - Mobile optimized */
                      <>
                        <div className="relative">
                          <div className="aspect-square overflow-hidden rounded-lg bg-slate-700/50 mb-3">
                            <img
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              src={item.image && item.image.length > 0 ? item.image[0] : "/placeholder.svg"}
                              alt={item.name}
                              onError={(e) => {
                                e.target.src = "/placeholder.svg";
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                          <span className="absolute top-2 right-2 px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-md backdrop-blur-sm">
                            {item.category}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate" title={item.name}>
                            {item.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-indigo-400 text-sm sm:text-base">
                              {currency}{item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit/${item._id}`);
                            }}
                            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveProduct(item._id);
                            }}
                            disabled={deleting === item._id}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50"
                          >
                            {deleting === item._id ? (
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      /* List View - Mobile optimized */
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700/50">
                          <img
                            className="h-full w-full object-cover"
                            src={item.image && item.image.length > 0 ? item.image[0] : "/placeholder.svg"}
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = "/placeholder.svg";
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-white text-sm sm:text-base truncate">{item.name}</h3>
                              <span className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-md mt-1">
                                {item.category}
                              </span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-indigo-400 text-sm sm:text-base">
                                {currency}{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit/${item._id}`);
                              }}
                              className="px-3 py-1.5 bg-indigo-600/20 text-indigo-400 text-xs font-medium rounded-lg hover:bg-indigo-600/30 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveProduct(item._id);
                              }}
                              disabled={deleting === item._id}
                              className="px-3 py-1.5 bg-red-600/20 text-red-400 text-xs font-medium rounded-lg hover:bg-red-600/30 transition-colors disabled:opacity-50"
                            >
                              {deleting === item._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile-first Pagination */}
              {totalPages > 1 && (
                <div className="relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {/* Previous Button */}
                      <button
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Page Numbers - Mobile optimized */}
                      <div className="flex items-center gap-1 mx-2">
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = index + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = index + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + index;
                          } else {
                            pageNumber = currentPage - 2 + index;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === pageNumber
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;