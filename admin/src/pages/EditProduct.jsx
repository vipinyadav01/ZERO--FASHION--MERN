import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";
import {
    Save,
    X,
    Edit3,
    ArrowLeft,
    Type,
    DollarSign,
    Sparkles,
    Star,
    AlertCircle,
    Check
} from "lucide-react";

const EditProduct = ({ token }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: 0,
        discountPercent: 0,
        category: "",
        subCategory: "",
        sizes: [],
        bestseller: false,
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
                if (!res?.data?.success) throw new Error(res?.data?.message || "Failed to load product");
                const p = res.data.product;
                setForm({
                    name: p.name || "",
                    description: p.description || "",
                    price: p.price || 0,
                    discountPercent: p.discountPercent || 0,
                    category: p.category || "",
                    subCategory: p.subCategory || "",
                    sizes: p.sizes || [],
                    bestseller: !!p.bestseller,
                });
            } catch (e) {
                toast.error(e.message || "Error loading product");
                navigate("/list");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await axios.put(
                `${backendUrl}/api/product/update/${id}`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Asset refined and synced");
            navigate("/list");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    const handleSizeToggle = (size) => {
        setForm(prev => {
            const sizes = prev.sizes.includes(size) 
                ? prev.sizes.filter(s => s !== size) 
                : [...prev.sizes, size];
            return { ...prev, sizes };
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Refinement Header */}
                <header className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-slate-800/60 p-8 sm:p-12 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] -mr-48 -mt-48 rounded-full animate-pulse"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <Edit3 className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                                    Asset <span className="text-indigo-500">Refine</span>
                                </h1>
                            </div>
                            <p className="text-slate-500 font-mono text-xs uppercase tracking-tighter">System ID: {id}</p>
                        </div>
                        <button onClick={() => navigate(-1)} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all flex items-center gap-2">
                            <ArrowLeft className="w-5 h-5" />
                            Return
                        </button>
                    </div>
                </header>

                <form onSubmit={handleSave} className="space-y-6">
                    <section className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-8 lg:p-10 shadow-xl space-y-10">
                        {/* Specifications */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter border-b border-slate-800 pb-4">Calibration Details</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1">Label</label>
                                    <div className="relative">
                                        <Type className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                        <input 
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white font-bold placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all uppercase"
                                            value={form.name} 
                                            onChange={(e)=>handleChange('name', e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1">Base Valuation (INR)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-white font-black text-xl placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                            value={form.price} 
                                            onChange={(e)=>handleChange('price', e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest pl-1">Asset Description</label>
                                <textarea 
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-4 text-white font-medium placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                    rows="4" 
                                    value={form.description} 
                                    onChange={(e)=>handleChange('description', e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Variant Matrix */}
                        <div className="space-y-4">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Variant Matrix</p>
                            <div className="flex flex-wrap gap-3">
                                {["S", "M", "L", "XL", "XXL"].map(s => (
                                    <button 
                                        key={s}
                                        type="button"
                                        onClick={() => handleSizeToggle(s)}
                                        className={`w-14 h-14 rounded-xl border flex items-center justify-center font-black transition-all ${form.sizes.includes(s) ? "bg-white text-slate-950 border-white shadow-xl scale-110" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600"}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Control Flags */}
                        <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => handleChange('bestseller', !form.bestseller)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${form.bestseller ? "bg-amber-500/10 border-amber-500 text-amber-500" : "bg-slate-900 border-slate-800 text-slate-500"}`}
                                >
                                    <Star className={`w-4 h-4 ${form.bestseller ? "fill-amber-500" : ""}`} />
                                    <span className="text-xs font-black uppercase tracking-widest">Priority Asset</span>
                                </button>
                            </div>
                            <div className="flex gap-4 w-full sm:w-auto">
                                <button 
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="flex-1 py-4 px-8 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl transition-all"
                                >
                                    Abort
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="flex-[2] py-4 px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? "Syncing..." : "Sync Changes"}
                                </button>
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
