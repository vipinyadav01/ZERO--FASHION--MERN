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
        <div className="min-h-screen p-6 lg:p-10 font-sans text-slate-100">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Edit Product</h1>
                         <p className="text-slate-400 text-sm">Update product details and inventory.</p>
                    </div>
                    <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <section className="bg-[#0f111a] border border-slate-800 rounded-xl p-8 shadow-xl space-y-8">
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider pl-1">Product Name</label>
                                <div className="relative group">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                                        value={form.name} 
                                        onChange={(e)=>handleChange('name', e.target.value)} 
                                        placeholder="Enter product name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider pl-1">Price (INR)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        type="number"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                                        value={form.price} 
                                        onChange={(e)=>handleChange('price', e.target.value)} 
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-slate-400 text-xs font-medium uppercase tracking-wider pl-1">Stock Units</label>
                                <div className="relative group">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                                    <input 
                                        type="number"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
                                        value={form.stock} 
                                        onChange={(e)=>handleChange('stock', parseInt(e.target.value) || 0)} 
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-slate-400 text-xs font-medium uppercase tracking-wider pl-1">Description</label>
                            <textarea 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600 min-h-[120px]"
                                rows="4" 
                                value={form.description} 
                                onChange={(e)=>handleChange('description', e.target.value)} 
                                placeholder="Describe the product..."
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-slate-400 text-xs font-medium uppercase tracking-wider pl-1">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {["S", "M", "L", "XL", "XXL"].map(s => (
                                    <button 
                                        key={s}
                                        type="button"
                                        onClick={() => handleSizeToggle(s)}
                                        className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-all ${
                                            form.sizes.includes(s) 
                                            ? "bg-indigo-600 border-indigo-600 text-white" 
                                            : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${form.bestseller ? "bg-indigo-600 border-indigo-600" : "bg-slate-900 border-slate-700 group-hover:border-slate-500"}`}>
                                    {form.bestseller && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={form.bestseller} 
                                    onChange={() => handleChange('bestseller', !form.bestseller)}
                                />
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Mark as Bestseller</span>
                            </label>

                            <div className="flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={saving}
                                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? "Saving..." : "Save Changes"}
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
