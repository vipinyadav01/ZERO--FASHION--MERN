import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { backendUrl, currency } from "../constants";
import { 
  Trash2, 
  Search, 
  Plus, 
  Package,
  Edit3,
  Filter,
  Grid3X3,
  List as ListIcon,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Layers,
  Sparkles,
  ArrowUpDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); 
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
        toast.error(response.data.message || "Failed to fetch inventory");
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Network synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (id) => {
    if (!window.confirm("CONFIRMATION: Deleting this product is permanent.")) return;

    try {
      setDeleting(id);
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Asset decommissioned successfully");
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error decommissioning asset:", error);
      toast.error("Operation failed");
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
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Inventory Header */}
        <header className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-slate-800/60 p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] -mr-48 -mt-48 rounded-full animate-pulse"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                  <Layers className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase">
                  Inventory <span className="text-indigo-500">Vault</span>
                </h1>
              </div>
              <p className="text-slate-400 text-lg font-medium max-w-md">
                Manage your global asset repository. High-frequency inventory tracking and catalog control.
              </p>
            </div>
            <button
              onClick={() => navigate('/add')}
              className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase rounded-[2rem] transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-3 group active:scale-95"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              Ingest Asset
            </button>
          </div>

          {/* Search & Utility Bar */}
          <div className="relative z-10 mt-12 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search collection..."
                className="w-full bg-slate-900/80 border border-slate-800 text-white rounded-[2rem] pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium placeholder-slate-600"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="appearance-none bg-slate-900/80 border border-slate-800 text-white rounded-[2rem] px-8 py-5 focus:outline-none transition-all font-bold tracking-tight cursor-pointer min-w-[180px]"
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Segments</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="bg-slate-900/80 border border-slate-800 rounded-[2rem] flex p-1.5">
                {[
                  { id: 'grid', icon: Grid3X3 },
                  { id: 'list', icon: ListIcon }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setViewMode(m.id)}
                    className={`p-3.5 rounded-[1.5rem] transition-all ${viewMode === m.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <m.icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {list.length === 0 ? (
          <div className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-20 text-center">
             <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-800">
               <Package className="w-12 h-12 text-slate-700" />
             </div>
             <h3 className="text-3xl font-black text-white mb-4">Repository Empty</h3>
             <button onClick={() => navigate('/add')} className="text-indigo-400 font-bold hover:text-indigo-300 underline underline-offset-8 transition-colors">Initialize First Asset</button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {currentItems.map((item) => (
                  <div key={item._id} className="group relative bg-[#0a0a0f] border border-slate-800/60 rounded-[2rem] overflow-hidden hover:border-indigo-500/40 transition-all duration-500 shadow-xl">
                    <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
                      <img 
                        src={item.image?.[0] || "/placeholder.svg"} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                         <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/edit/${item._id}`); }}
                            className="p-3 bg-white text-slate-950 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
                         >
                            <Edit3 className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveProduct(item._id); }}
                            className="p-3 bg-rose-600 text-white rounded-2xl hover:bg-rose-500 transition-all shadow-xl"
                         >
                            {deleting === item._id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Trash2 className="w-4 h-4" />}
                         </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{item.category}</p>
                      <h4 className="text-white font-bold text-sm truncate uppercase tracking-tight">{item.name}</h4>
                      <p className="text-indigo-400 font-black text-lg mt-2">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/60 bg-slate-900/30">
                      <th className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Asset</th>
                      <th className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Segment</th>
                      <th className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Valuation</th>
                      <th className="px-8 py-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {currentItems.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-900/40 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 shrink-0">
                              <img src={item.image?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-bold text-lg truncate uppercase tracking-tight">{item.name}</p>
                              <p className="text-slate-500 text-xs font-mono lowercase">ID: {item._id.slice(-12)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-white font-black text-xl italic">₹{item.price.toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => navigate(`/edit/${item._id}`)}
                              className="p-3 bg-slate-900 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleRemoveProduct(item._id)}
                              className="p-3 bg-slate-900 text-slate-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Showing <span className="text-white">{indexOfFirstItem + 1}</span> to <span className="text-white">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="text-white">{filteredProducts.length}</span> Assets
                </p>
                <div className="flex gap-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="flex bg-slate-900 border border-slate-800 rounded-2xl px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(v => (
                      <button 
                        key={v}
                        onClick={() => setCurrentPage(v)}
                        className={`w-12 h-12 flex items-center justify-center font-black transition-all ${currentPage === v ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
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

export default List;