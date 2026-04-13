import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { backendUrl } from '../constants';
import { toast } from 'react-toastify';
import { Package, Search, AlertCircle, CheckCircle2, XCircle, RefreshCcw, TrendingDown, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import PropTypes from 'prop-types';

const STOCK_LEVELS = [
    { id: 'all',      label: 'All',       filter: () => true },
    { id: 'out',      label: 'Out of Stock', filter: p => (p.stock || 0) === 0 },
    { id: 'low',      label: 'Low (< 10)', filter: p => (p.stock || 0) > 0 && (p.stock || 0) < 10 },
    { id: 'medium',   label: 'Medium (10–49)', filter: p => (p.stock || 0) >= 10 && (p.stock || 0) < 50 },
    { id: 'healthy',  label: 'Healthy (50+)', filter: p => (p.stock || 0) >= 50 },
];

const stockBadge = (stock) => {
    if (stock === 0)  return { label: 'Out of Stock', cls: 'bg-red-50 border-red-100 text-red-600',       dot: 'bg-red-500' };
    if (stock < 10)   return { label: 'Low Stock',    cls: 'bg-amber-50 border-amber-100 text-amber-700', dot: 'bg-amber-500' };
    if (stock < 50)   return { label: 'Medium',       cls: 'bg-blue-50 border-blue-100 text-blue-700',   dot: 'bg-blue-500' };
    return              { label: 'Healthy',            cls: 'bg-emerald-50 border-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
};

const Inventory = ({ token }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/api/product/list`);
            if (res.data.success) {
                setProducts(res.data.products.sort((a, b) => (a.stock || 0) - (b.stock || 0)));
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    const filtered = products.filter(p => {
        const lvl = STOCK_LEVELS.find(l => l.id === stockFilter);
        const matchesLevel = lvl ? lvl.filter(p) : true;
        const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.category || '').toLowerCase().includes(search.toLowerCase());
        const matchesCat = !category || p.category === category;
        return matchesLevel && matchesSearch && matchesCat;
    });

    // Summary stats
    const outOfStock  = products.filter(p => (p.stock || 0) === 0).length;
    const lowStock    = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10).length;
    const totalUnits  = products.reduce((s, p) => s + (p.stock || 0), 0);
    const healthyCount = products.filter(p => (p.stock || 0) >= 50).length;

    return (
        <PageShell>
            {/* Header */}
            <div className="bg-white border border-brand-border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-0.5">Admin Panel</p>
                    <h1 className="text-xl font-black text-brand-text-primary uppercase tracking-tight">Inventory</h1>
                </div>
                <button onClick={load} className="flex items-center gap-2 px-4 py-2 border border-brand-border hover:bg-[#F8F8F6] text-[10px] font-black uppercase tracking-widest transition-colors">
                    <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Products', value: products.length, icon: Package, color: '' },
                    { label: 'Out of Stock',   value: outOfStock, icon: XCircle, color: 'text-red-600' },
                    { label: 'Low Stock',      value: lowStock, icon: AlertCircle, color: 'text-amber-600' },
                    { label: 'Total Units',    value: totalUnits.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white border border-brand-border p-5 flex items-center gap-4">
                        <div className={`p-3 bg-[#F8F8F6] border border-brand-border shrink-0`}>
                            <Icon className={`w-5 h-5 ${color || 'text-brand-text-primary'}`} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">{label}</p>
                            <p className={`text-xl font-black tracking-tight ${color || 'text-brand-text-primary'}`}>{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Low stock alert banner */}
            {(outOfStock > 0 || lowStock > 0) && (
                <div className="bg-amber-50 border border-amber-200 p-4 flex items-center gap-3">
                    <TrendingDown className="w-5 h-5 text-amber-600 shrink-0" />
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                        {outOfStock > 0 && `${outOfStock} product${outOfStock > 1 ? 's' : ''} out of stock. `}
                        {lowStock > 0 && `${lowStock} product${lowStock > 1 ? 's' : ''} running low.`}
                        {' '}Restock soon to avoid lost sales.
                    </p>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white border border-brand-border p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                {/* Search */}
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-brand-border bg-[#F8F8F6] text-[10px] font-bold text-brand-text-primary uppercase tracking-widest placeholder:text-brand-text-secondary/50 focus:outline-none focus:border-black transition-colors"
                    />
                </div>

                {/* Stock level tabs */}
                <div className="flex flex-wrap gap-2">
                    {STOCK_LEVELS.map(lvl => (
                        <button
                            key={lvl.id}
                            onClick={() => setStockFilter(lvl.id)}
                            className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest border transition-colors ${
                                stockFilter === lvl.id
                                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                    : 'bg-white text-brand-text-secondary border-brand-border hover:border-black hover:text-black'
                            }`}
                        >
                            {lvl.label}
                        </button>
                    ))}
                </div>

                {/* Category filter */}
                {categories.length > 0 && (
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="appearance-none px-3 py-2.5 border border-brand-border bg-white text-[10px] font-black uppercase tracking-widest text-brand-text-primary focus:outline-none focus:border-black transition-colors min-w-[140px]"
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                )}
            </div>

            {/* Product table */}
            <div className="bg-white border border-brand-border overflow-hidden">
                <div className="px-5 py-3 border-b border-brand-border flex items-center justify-between">
                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">
                        Showing {filtered.length} of {products.length} products
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-brand-border text-[9px] font-black text-brand-text-secondary uppercase tracking-widest bg-[#F8F8F6]">
                                <th className="px-5 py-3">Product</th>
                                <th className="px-5 py-3 hidden sm:table-cell">Category</th>
                                <th className="px-5 py-3 hidden sm:table-cell">Price</th>
                                <th className="px-5 py-3">Stock</th>
                                <th className="px-5 py-3">Status</th>
                                <th className="px-5 py-3 hidden md:table-cell">Stock Bar</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/40">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center">
                                        <div className="w-7 h-7 border-[3px] border-black border-t-transparent animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center">
                                        <Package className="w-8 h-8 text-brand-text-secondary mx-auto mb-2" />
                                        <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">No products found</p>
                                    </td>
                                </tr>
                            ) : filtered.map(p => {
                                const badge = stockBadge(p.stock || 0);
                                const maxStock = Math.max(...products.map(x => x.stock || 0), 1);
                                const barWidth = Math.min(((p.stock || 0) / maxStock) * 100, 100);
                                return (
                                    <tr key={p._id} className="hover:bg-[#F8F8F6] transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 border border-brand-border overflow-hidden shrink-0 bg-[#F8F8F6]">
                                                    {p.image?.[0] ? (
                                                        <img src={p.image[0]} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-4 h-4 text-brand-text-secondary" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-brand-text-primary uppercase tracking-tight max-w-[180px] truncate">{p.name}</p>
                                                    <p className="text-[9px] text-brand-text-secondary font-bold uppercase">#{p._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 hidden sm:table-cell">
                                            <span className="text-[9px] font-black text-brand-text-secondary bg-[#F8F8F6] border border-brand-border px-2 py-1 uppercase tracking-widest">{p.category}</span>
                                        </td>
                                        <td className="px-5 py-3 hidden sm:table-cell font-black text-sm text-brand-text-primary">₹{(p.price || 0).toLocaleString()}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-lg font-black ${(p.stock || 0) === 0 ? 'text-red-600' : (p.stock || 0) < 10 ? 'text-amber-600' : 'text-brand-text-primary'}`}>
                                                {(p.stock || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[9px] font-black uppercase tracking-widest border ${badge.cls}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 hidden md:table-cell w-36">
                                            <div className="w-full bg-[#F8F8F6] border border-brand-border h-2">
                                                <div
                                                    className={`h-full transition-all ${(p.stock || 0) === 0 ? 'bg-red-500' : (p.stock || 0) < 10 ? 'bg-amber-500' : (p.stock || 0) < 50 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${barWidth}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <button
                                                onClick={() => navigate(`/edit/${p._id}`)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-border text-[9px] font-black text-brand-text-secondary uppercase tracking-widest hover:border-black hover:text-black transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageShell>
    );
};

Inventory.propTypes = { token: PropTypes.string };

export default Inventory;
