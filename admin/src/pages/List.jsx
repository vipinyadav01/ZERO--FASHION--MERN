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
        <div className="min-h-screen p-6 lg:p-10 font-sans text-brand-text-primary bg-brand-bg">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
                <div>
                  <h1 className="text-3xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">Product Catalog</h1>
                  <p className="text-brand-text-secondary text-xs font-bold uppercase tracking-widest">Manage inventory, pricing, and availability</p>
                </div>
                <button
                  onClick={() => navigate('/add')}
                  className="px-8 py-3 bg-brand-accent hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-none transition-all flex items-center gap-2 shadow-none"
                >
                  <Plus className="w-4 h-4" />
                  New Product
                </button>
            </div>

            {/* Filters & Controls */}
            <div className="bg-white border border-brand-border rounded-none p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
               <div className="relative flex-1 w-full md:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <input
                    type="text"
                    placeholder="SEARCH PRODUCTS..."
                    className="w-full bg-white border border-brand-border text-brand-text-primary rounded-none pl-12 pr-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/50"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
               </div>
               
               <div className="flex gap-4 w-full md:w-auto">
                  <div className="relative">
                     <select
                        className="appearance-none bg-white border border-brand-border text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-none pl-5 pr-12 py-3 focus:outline-none focus:border-brand-accent cursor-pointer min-w-[160px]"
                        value={selectedCategory}
                        onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                      >
                        <option value="">ALL CATEGORIES</option>
                        {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                      </select>
                      <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-secondary pointer-events-none" />
                  </div>

                  <div className="bg-white border border-brand-border rounded-none flex p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-all rounded-none ${viewMode === 'grid' ? "bg-brand-accent text-white" : "text-brand-text-secondary hover:text-brand-text-primary"}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-all rounded-none ${viewMode === 'list' ? "bg-brand-accent text-white" : "text-brand-text-secondary hover:text-brand-text-primary"}`}
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>

            {/* Content */}
            {list.length === 0 ? (
              <div className="bg-white border border-brand-border rounded-none p-20 text-center flex flex-col items-center">
                 <div className="w-20 h-20 bg-brand-surface rounded-none flex items-center justify-center mb-6 border border-brand-border">
                   <Package className="w-10 h-10 text-brand-text-secondary" />
                 </div>
                 <h3 className="text-xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">Vault is Empty</h3>
                 <p className="text-brand-text-secondary text-xs font-bold uppercase tracking-widest mb-8">No products found in your archive.</p>
                 <button onClick={() => navigate('/add')} className="text-brand-accent text-xs font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Add your first item</button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {currentItems.map((item) => (
                      <div key={item._id} className="bg-white border border-brand-border rounded-none overflow-hidden hover:border-black transition-all group">
                        <div className="aspect-[4/5] relative bg-brand-surface overflow-hidden">
                          <img 
                            src={item.image?.[0] || "/placeholder.svg"} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.98] group-hover:brightness-100"
                          />
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                             <button 
                                onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item._id}`); }}
                                className="p-3 bg-white text-brand-text-primary rounded-none hover:bg-brand-accent hover:text-white shadow-none border border-brand-border transition-colors"
                             >
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveProduct(item._id); }}
                                className="p-3 bg-white text-red-600 rounded-none hover:bg-red-600 hover:text-white shadow-none border border-brand-border transition-colors"
                             >
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                              <span className="text-[10px] font-black px-2 py-1 bg-brand-surface text-brand-text-secondary uppercase tracking-widest">{item.category}</span>
                              <span className="font-black text-brand-text-primary uppercase text-sm tracking-tighter">₹{item.price.toLocaleString()}</span>
                          </div>
                          <h4 className="text-brand-text-primary text-sm font-bold uppercase tracking-tight truncate mb-2">{item.name}</h4>
                          <div className="flex items-center justify-between text-[10px] font-black text-brand-text-secondary uppercase tracking-widest border-t border-brand-border pt-3 mt-3">
                              <span>Availability: {item.stock || 0}</span>
                              <span>ID: {item._id.slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-brand-border rounded-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="bg-brand-surface border-b border-brand-border text-brand-text-secondary uppercase text-[10px] font-black tracking-widest">
                              <th className="px-8 py-5 font-black">Visual Reference</th>
                              <th className="px-8 py-5 font-black">Category</th>
                              <th className="px-8 py-5 font-black">Archive ID</th>
                              <th className="px-8 py-5 font-black">Stock Status</th>
                              <th className="px-8 py-5 font-black">Price Unit</th>
                              <th className="px-8 py-5 font-black text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-brand-border">
                            {currentItems.map((item) => (
                              <tr key={item._id} className="hover:bg-brand-surface transition-colors">
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-none bg-brand-surface border border-brand-border overflow-hidden shrink-0 p-0.5">
                                      <img src={item.image?.[0]} alt="" className="w-full h-full object-cover brightness-[0.98]" />
                                    </div>
                                    <div>
                                      <p className="text-brand-text-primary font-bold uppercase tracking-tight text-sm truncate max-w-[200px]">{item.name}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <span className="inline-flex items-center px-2 py-1 rounded-none text-[10px] font-black uppercase tracking-widest bg-brand-surface border border-brand-border text-brand-text-secondary">
                                    {item.category}
                                  </span>
                                </td>
                                <td className="px-8 py-6">
                                  <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-widest">#{item._id.slice(-8).toUpperCase()}</span>
                                </td>
                                 <td className="px-8 py-6">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${!item.stock || item.stock < 10 ? 'text-red-600' : 'text-brand-text-secondary'}`}>
                                        {item.stock || 0} UNITS
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-brand-text-primary font-black uppercase text-sm tracking-tighter">
                                  ₹{item.price.toLocaleString()}
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <div className="flex justify-end gap-3">
                                    <button 
                                      onClick={() => navigate(`/edit/${item._id}`)}
                                      className="p-3 text-brand-text-secondary hover:text-brand-text-primary hover:bg-white border border-transparent hover:border-brand-border transition-all"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleRemoveProduct(item._id)}
                                      className="p-3 text-brand-text-secondary hover:text-red-600 hover:bg-white border border-transparent hover:border-brand-border transition-all"
                                    >
                                      {deleting === item._id ? <div className="w-4 h-4 border-2 border-brand-text-secondary border-t-transparent rounded-full animate-spin"></div> : <Trash2 className="w-4 h-4" />}
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
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-brand-border pb-10">
                    <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">
                      SHOWING <span className="text-brand-text-primary">{indexOfFirstItem + 1}—{Math.min(indexOfLastItem, filteredProducts.length)}</span> OF <span className="text-brand-text-primary">{filteredProducts.length}</span> ARCHIVED ITEMS
                    </p>
                    <div className="flex items-center gap-3">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-3 border border-brand-border rounded-none text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex gap-2">
                         {Array.from({ length: totalPages }, (_, i) => i + 1).map(v => (
                           <button
                             key={v}
                             onClick={() => setCurrentPage(v)}
                             className={`w-10 h-10 rounded-none text-[10px] font-black uppercase tracking-widest transition-all border ${currentPage === v ? 'bg-brand-accent text-white border-brand-accent' : 'text-brand-text-secondary border-brand-border hover:bg-brand-surface hover:text-brand-text-primary'}`}
                           >
                             {v}
                           </button>
                         ))}
                      </div>
                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-3 border border-brand-border rounded-none text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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