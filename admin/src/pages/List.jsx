import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl } from "../constants";
import PropTypes from 'prop-types';
import { 
  Trash2, 
  Search, 
  Plus, 
  Package,
  Edit2,
  Filter,
  Grid,
  List as ListIcon,
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
  const [viewMode, setViewMode] = useState('list'); // Default to list view for better admin data density
  const [selectedCategory, setSelectedCategory] = useState('');
  const itemsPerPage = viewMode === 'grid' ? 12 : 10;
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
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeleting(id);
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Product deleted successfully");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    if (token) fetchList();
    else navigate("/login");
  }, [token, navigate]);

  const filteredProducts = list.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(list.map(product => product.category))];
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  if (loading && list.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10 font-sans text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Product Management</h1>
              <p className="text-slate-400 text-sm">Manage your product catalog, inventory, and pricing.</p>
            </div>
            <button
              onClick={() => navigate('/add')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
        </div>

        {/* Filters & Controls */}
        <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-500"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
           </div>
           
           <div className="flex gap-3 w-full md:w-auto">
              <div className="relative">
                 <select
                    className="appearance-none bg-slate-900 border border-slate-700 text-white text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer min-w-[140px]"
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg flex p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
           </div>
        </div>

        {/* Content */}
        {list.length === 0 ? (
          <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
               <Package className="w-8 h-8 text-slate-600" />
             </div>
             <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
             <p className="text-slate-500 text-sm mb-6">Get started by creating your first product.</p>
             <button onClick={() => navigate('/add')} className="text-indigo-400 text-sm font-medium hover:text-indigo-300 hover:underline">Create Product</button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {currentItems.map((item) => (
                  <div key={item._id} className="bg-[#0f111a] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all group">
                    <div className="aspect-square relative bg-slate-900 overflow-hidden">
                      <img 
                        src={item.image?.[0] || "/placeholder.svg"} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                         <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item._id}`); }}
                            className="p-2 bg-white text-slate-900 rounded-lg hover:bg-indigo-500 hover:text-white shadow-lg transition-colors"
                         >
                            <Edit2 className="w-3.5 h-3.5" />
                         </button>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveProduct(item._id); }}
                            className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-lg transition-colors"
                         >
                            <Trash2 className="w-3.5 h-3.5" />
                         </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-400">{item.category}</span>
                          <span className="font-semibold text-white">₹{item.price.toLocaleString()}</span>
                      </div>
                      <h4 className="text-slate-200 text-sm font-medium truncate mb-1">{item.name}</h4>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Stock: {item.stock || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0f111a] border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400">
                          <th className="px-6 py-4 font-medium">Product</th>
                          <th className="px-6 py-4 font-medium">Category</th>
                          <th className="px-6 py-4 font-medium">Stock</th>
                          <th className="px-6 py-4 font-medium">Price</th>
                          <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {currentItems.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                                  <img src={item.image?.[0]} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-white font-medium truncate max-w-[200px]">{item.name}</p>
                                  <p className="text-slate-500 text-xs">ID: {item._id.slice(-8)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300">
                                {item.category}
                              </span>
                            </td>
                             <td className="px-6 py-4">
                                <span className={`text-xs font-medium ${!item.stock || item.stock < 10 ? 'text-rose-400' : 'text-slate-300'}`}>
                                    {item.stock || 0} units
                                </span>
                            </td>
                            <td className="px-6 py-4 text-white font-medium">
                              ₹{item.price.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => navigate(`/edit/${item._id}`)}
                                  className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-all"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleRemoveProduct(item._id)}
                                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                                >
                                  {deleting === item._id ? <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div> : <Trash2 className="w-4 h-4" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/50">
                <p className="text-slate-500 text-sm">
                  Showing <span className="text-white font-medium">{indexOfFirstItem + 1}</span> to <span className="text-white font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="text-white font-medium">{filteredProducts.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-2 border border-slate-700 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-1">
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(v => (
                       <button
                         key={v}
                         onClick={() => setCurrentPage(v)}
                         className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === v ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                       >
                         {v}
                       </button>
                     ))}
                  </div>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-2 border border-slate-700 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

List.propTypes = {
  token: PropTypes.string.isRequired
};

export default List;