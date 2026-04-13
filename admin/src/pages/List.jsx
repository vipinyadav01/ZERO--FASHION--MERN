import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../constants';
import PropTypes from 'prop-types';
import { Trash2, Search, Plus, Package, Edit2, Filter, Grid, List as ListIcon, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';

const List = ({ token }) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [view, setView] = useState('list');
    const [category, setCategory] = useState('');
    const perPage = view === 'grid' ? 12 : 10;
    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/api/product/list`);
            if (res.data.success) setList(res.data.products);
            else toast.error(res.data.message || 'Failed to load products');
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const removeProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            setDeleting(id);
            const res = await axios.post(`${backendUrl}/api/product/remove`, { id }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) { toast.success('Product deleted'); await fetchList(); }
            else toast.error(res.data.message);
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeleting(null);
        }
    };

    useEffect(() => {
        if (token) fetchList();
        else navigate('/login');
    }, [token, navigate]);

    const categories = [...new Set(list.map(p => p.category).filter(Boolean))];

    const filtered = list.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.category || '').toLowerCase().includes(search.toLowerCase());
        const matchCat = !category || p.category === category;
        return matchSearch && matchCat;
    });

    const totalPages = Math.ceil(filtered.length / perPage);
    const start = (page - 1) * perPage;
    const current = filtered.slice(start, start + perPage);

    if (loading && list.length === 0) {
        return (
            <PageShell>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-8 h-8 border-[3px] border-black border-t-transparent animate-spin" />
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            {/* Header */}
            <div className="bg-white border border-brand-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-0.5">Admin Panel</p>
                    <h1 className="text-xl font-black text-brand-text-primary uppercase tracking-tight">Products</h1>
                    <p className="text-[10px] text-brand-text-secondary font-bold uppercase tracking-widest mt-0.5">{list.length} items in catalog</p>
                </div>
                <button
                    onClick={() => navigate('/add')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-brand-border p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search products or categories..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2.5 border border-brand-border bg-[#F8F8F6] text-sm text-brand-text-primary placeholder:text-brand-text-secondary/50 focus:outline-none focus:border-black transition-colors"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative">
                        <select
                            value={category}
                            onChange={e => { setCategory(e.target.value); setPage(1); }}
                            className="appearance-none pl-3 pr-8 py-2.5 border border-brand-border bg-white text-[10px] font-black uppercase tracking-widest text-brand-text-primary focus:outline-none focus:border-black cursor-pointer min-w-[140px]"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-text-secondary pointer-events-none" />
                    </div>

                    <div className="flex border border-brand-border bg-white">
                        <button onClick={() => setView('list')} className={`p-2.5 transition-colors ${view === 'list' ? 'bg-[#1A1A1A] text-white' : 'text-brand-text-secondary hover:text-black'}`}>
                            <ListIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setView('grid')} className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-[#1A1A1A] text-white' : 'text-brand-text-secondary hover:text-black'}`}>
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {list.length === 0 ? (
                <div className="bg-white border border-brand-border p-16 text-center">
                    <Package className="w-10 h-10 text-brand-text-secondary mx-auto mb-3" />
                    <h3 className="text-base font-black text-brand-text-primary mb-1 uppercase tracking-tight">No Products</h3>
                    <p className="text-[10px] text-brand-text-secondary font-bold uppercase tracking-widest mb-5">Start by adding your first product.</p>
                    <button onClick={() => navigate('/add')} className="px-5 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors">
                        Add Product
                    </button>
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {current.map(item => (
                        <div key={item._id} className="bg-white border border-brand-border hover:border-black transition-all group overflow-hidden">
                            <div className="relative aspect-[4/5] bg-[#F8F8F6] overflow-hidden">
                                <img src={item.image?.[0] || ''} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                {item.bestseller && (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#1A1A1A] text-white px-2 py-1 text-[8px] font-black uppercase tracking-widest">
                                        <Star className="w-2.5 h-2.5" /> Best
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={e => { e.stopPropagation(); navigate(`/edit/${item._id}`); }} className="p-2 bg-white border border-brand-border text-brand-text-primary hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors">
                                        <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={e => { e.stopPropagation(); removeProduct(item._id); }} className="p-2 bg-white border border-brand-border text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[9px] font-black text-brand-text-secondary bg-[#F8F8F6] border border-brand-border px-2 py-0.5 uppercase tracking-widest">{item.category}</span>
                                    <span className="font-black text-brand-text-primary text-sm">₹{(item.price || 0).toLocaleString()}</span>
                                </div>
                                <p className="text-sm font-bold text-brand-text-primary uppercase tracking-tight truncate">{item.name}</p>
                                <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${(item.stock || 0) < 10 ? 'text-red-600' : 'text-brand-text-secondary'}`}>
                                    Stock: {item.stock || 0}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-brand-border overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#F8F8F6] border-b border-brand-border text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">
                                <th className="px-5 py-3">Product</th>
                                <th className="px-5 py-3 hidden sm:table-cell">Category</th>
                                <th className="px-5 py-3 hidden md:table-cell">ID</th>
                                <th className="px-5 py-3">Stock</th>
                                <th className="px-5 py-3">Price</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/40">
                            {current.map(item => (
                                <tr key={item._id} className="hover:bg-[#F8F8F6] transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#F8F8F6] border border-brand-border overflow-hidden shrink-0">
                                                <img src={item.image?.[0] || ''} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-brand-text-primary uppercase tracking-tight max-w-[200px] truncate">{item.name}</p>
                                                {item.bestseller && (
                                                    <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                                                        <Star className="w-2.5 h-2.5" /> Bestseller
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 hidden sm:table-cell">
                                        <span className="text-[9px] font-black text-brand-text-secondary bg-[#F8F8F6] border border-brand-border px-2 py-1 uppercase tracking-widest">{item.category}</span>
                                    </td>
                                    <td className="px-5 py-3 hidden md:table-cell">
                                        <span className="text-[9px] font-bold text-brand-text-secondary uppercase">#{item._id.slice(-8).toUpperCase()}</span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className={`text-sm font-black ${(item.stock || 0) === 0 ? 'text-red-600' : (item.stock || 0) < 10 ? 'text-amber-600' : 'text-brand-text-primary'}`}>
                                            {item.stock || 0}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 font-black text-sm text-brand-text-primary">₹{(item.price || 0).toLocaleString()}</td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => navigate(`/edit/${item._id}`)} className="p-2 border border-brand-border text-brand-text-secondary hover:border-black hover:text-black transition-colors">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => removeProduct(item._id)} className="p-2 border border-brand-border text-brand-text-secondary hover:border-red-500 hover:text-red-500 transition-colors">
                                                {deleting === item._id
                                                    ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    : <Trash2 className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white border border-brand-border px-5 py-3">
                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
                        {start + 1}–{Math.min(start + perPage, filtered.length)} of {filtered.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 border border-brand-border disabled:opacity-30 hover:bg-[#F8F8F6] transition-colors disabled:cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 text-[10px] font-black border transition-colors ${page === n ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'border-brand-border text-brand-text-secondary hover:bg-[#F8F8F6]'}`}>
                                {n}
                            </button>
                        ))}
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border border-brand-border disabled:opacity-30 hover:bg-[#F8F8F6] transition-colors disabled:cursor-not-allowed">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </PageShell>
    );
};

List.propTypes = { token: PropTypes.string.isRequired };

export default List;
