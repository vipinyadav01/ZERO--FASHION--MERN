import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
    Save,
    ArrowLeft,
    Type,
    DollarSign,
    Package,
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
        stock: 0,
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
                    stock: p.stock || 0,
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
            toast.success("Product updated successfully");
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
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 lg:p-10 font-sans text-brand-text-primary bg-brand-bg">
            <div className="max-w-4xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex items-end justify-between border-b border-brand-border pb-8">
                    <div>
                        <h1 className="text-3xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">Modify Archive</h1>
                         <p className="text-brand-text-secondary text-[10px] font-black uppercase tracking-widest">Update existing product specifications</p>
                    </div>
                    <button onClick={() => navigate(-1)} className="px-6 py-3 bg-white border border-brand-border rounded-none text-brand-text-secondary hover:text-brand-text-primary hover:border-black transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                        <ArrowLeft className="w-4 h-4" />
                        Return
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-10">
                    <section className="bg-white border border-brand-border rounded-none p-10 space-y-10">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest block">Product Designation</label>
                                <div className="relative group">
                                    <input 
                                        className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/30"
                                        value={form.name} 
                                        onChange={(e)=>handleChange('name', e.target.value)} 
                                        placeholder="ENTER NAME..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest block">Unit Valuation (INR)</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/30"
                                        value={form.price} 
                                        onChange={(e)=>handleChange('price', e.target.value)} 
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest block">Archive Stock</label>
                                <div className="relative group">
                                    <input 
                                        type="number"
                                        className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/30"
                                        value={form.stock} 
                                        onChange={(e)=>handleChange('stock', parseInt(e.target.value) || 0)} 
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest block">Analysis Description</label>
                            <textarea 
                                className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors placeholder:text-brand-text-secondary/30 min-h-[140px] leading-relaxed"
                                rows="4" 
                                value={form.description} 
                                onChange={(e)=>handleChange('description', e.target.value)} 
                                placeholder="DESCRIBE ARCHIVE ITEM..."
                            />
                        </div>

                        <div className="space-y-5">
                            <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest block">Available Metrics</label>
                            <div className="flex flex-wrap gap-3">
                                {["S", "M", "L", "XL", "XXL"].map(s => (
                                    <button 
                                        key={s}
                                        type="button"
                                        onClick={() => handleSizeToggle(s)}
                                        className={`w-12 h-12 rounded-none border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center ${
                                            form.sizes.includes(s) 
                                            ? "bg-brand-accent border-brand-accent text-white" 
                                            : "bg-white border-brand-border text-brand-text-secondary hover:border-black hover:text-black"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-brand-border flex flex-wrap items-center justify-between gap-8">
                            <label className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-none border flex items-center justify-center transition-colors ${form.bestseller ? "bg-brand-accent border-brand-accent" : "bg-white border-brand-border group-hover:border-black"}`}>
                                    {form.bestseller && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={form.bestseller} 
                                    onChange={() => handleChange('bestseller', !form.bestseller)}
                                />
                                <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest group-hover:text-black transition-colors">Mark as Bestseller / Featured</span>
                            </label>

                            <div className="flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-8 py-3 bg-white border border-brand-border hover:border-black text-brand-text-secondary hover:text-brand-text-primary text-[10px] font-black uppercase tracking-widest rounded-none transition-all"
                                >
                                    Abort
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="px-10 py-3 bg-brand-accent hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-none transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? "Synchronizing..." : "Commit Changes"}
                                </button>
                            </div>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
};

EditProduct.propTypes = {
    token: PropTypes.string.isRequired
};

export default EditProduct;
