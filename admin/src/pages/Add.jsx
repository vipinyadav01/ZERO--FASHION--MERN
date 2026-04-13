import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { backendUrl } from '../constants';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { UploadCloud, X, Check, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['Men', 'Women', 'Kids'];
const SUBCATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear', 'Footwear', 'Accessories'];

const FieldLabel = ({ children }) => (
    <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">{children}</label>
);

const inputCls = 'w-full px-4 py-3 border border-brand-border bg-[#F8F8F6] text-sm font-medium text-brand-text-primary placeholder:text-brand-text-secondary/40 focus:outline-none focus:border-black transition-colors';
const ErrorMsg = ({ msg }) => msg ? <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">{msg}</p> : null;

const Add = ({ token }) => {
    const navigate = useNavigate();
    const [images, setImages] = useState([null, null, null, null]);
    const [form, setForm] = useState({
        name: '', description: '', price: '', stock: '',
        category: 'Men', subCategory: 'Topwear',
        bestseller: false, sizes: [],
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => images.forEach(img => img?.preview && URL.revokeObjectURL(img.preview));
    }, [images]);

    const setImage = (idx, file) => {
        if (!file) { setImages(prev => prev.map((v, i) => i === idx ? null : v)); return; }
        setImages(prev => {
            const next = [...prev];
            if (next[idx]?.preview) URL.revokeObjectURL(next[idx].preview);
            next[idx] = { file, preview: URL.createObjectURL(file) };
            return next;
        });
    };

    const validate = useCallback(() => {
        const e = {};
        if (!form.name.trim())        e.name = 'Product name is required';
        if (!form.description.trim()) e.description = 'Description is required';
        if (!form.price || Number(form.price) <= 0) e.price = 'Valid price required';
        if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Valid stock required';
        if (form.sizes.length === 0)  e.sizes = 'Select at least one size';
        if (!images[0])               e.images = 'Main image is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    }, [form, images]);

    const reset = () => {
        setForm({ name: '', description: '', price: '', stock: '', category: 'Men', subCategory: 'Topwear', bestseller: false, sizes: [] });
        setImages([null, null, null, null]);
        setErrors({});
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('name', form.name.trim());
            fd.append('description', form.description.trim());
            fd.append('price', parseFloat(form.price));
            fd.append('stock', parseInt(form.stock));
            fd.append('category', form.category);
            fd.append('subCategory', form.subCategory);
            fd.append('bestseller', form.bestseller);
            fd.append('sizes', JSON.stringify(form.sizes));
            images.forEach((img, i) => img && fd.append(`image${i + 1}`, img.file));

            const res = await axios.post(`${backendUrl}/api/product/add`, fd, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
            });
            if (res.data.success) { toast.success('Product added successfully'); reset(); }
            else toast.error(res.data.message);
        } catch {
            toast.error('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    const toggleSize = (s) => setForm(f => ({
        ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s],
    }));

    return (
        <PageShell>
            {/* Header */}
            <div className="bg-white border border-brand-border p-5 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-0.5">Products</p>
                    <h1 className="text-xl font-black text-brand-text-primary uppercase tracking-tight">Add New Product</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={reset} className="px-4 py-2 border border-brand-border text-[10px] font-black text-brand-text-secondary uppercase tracking-widest hover:border-black hover:text-black transition-colors">
                        Reset
                    </button>
                    <button type="button" onClick={() => navigate('/list')} className="flex items-center gap-2 px-4 py-2 border border-brand-border text-[10px] font-black text-brand-text-secondary uppercase tracking-widest hover:border-black hover:text-black transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Products
                    </button>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Left col: images */}
                    <div className="space-y-5">
                        <div className="bg-white border border-brand-border p-5">
                            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-4">Product Images</p>
                            <div className="grid grid-cols-2 gap-3">
                                {images.map((img, idx) => (
                                    <div key={idx} className={`relative aspect-square border overflow-hidden ${idx === 0 ? 'col-span-2' : ''} ${!img ? 'border-dashed border-brand-border hover:border-black transition-colors' : 'border-brand-border'} bg-[#F8F8F6]`}>
                                        {img ? (
                                            <>
                                                <img src={img.preview} className="w-full h-full object-cover" alt={`img-${idx}`} />
                                                <button type="button" onClick={() => setImage(idx, null)} className="absolute top-2 right-2 p-1.5 bg-white border border-brand-border text-brand-text-primary hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                                {idx === 0 && <span className="absolute bottom-2 left-2 bg-[#1A1A1A] text-white text-[8px] font-black uppercase px-2 py-0.5 tracking-widest">Main</span>}
                                            </>
                                        ) : (
                                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group">
                                                <UploadCloud className="w-6 h-6 text-brand-text-secondary group-hover:text-black transition-colors mb-1.5" />
                                                <span className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest">{idx === 0 ? 'Main Image' : `Image ${idx + 1}`}</span>
                                                <input type="file" hidden accept="image/*" onChange={e => setImage(idx, e.target.files[0])} />
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <ErrorMsg msg={errors.images} />
                        </div>

                        {/* Sizes */}
                        <div className="bg-white border border-brand-border p-5">
                            <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mb-4">Available Sizes</p>
                            <div className="flex flex-wrap gap-2">
                                {SIZES.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => toggleSize(s)}
                                        className={`w-10 h-10 text-[10px] font-black uppercase tracking-widest border transition-all ${form.sizes.includes(s) ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white border-brand-border text-brand-text-secondary hover:border-black hover:text-black'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <ErrorMsg msg={errors.sizes} />
                        </div>

                        {/* Bestseller toggle */}
                        <div className="bg-white border border-brand-border p-5">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 border flex items-center justify-center transition-all shrink-0 ${form.bestseller ? 'bg-[#1A1A1A] border-[#1A1A1A]' : 'bg-white border-brand-border group-hover:border-black'}`}>
                                    {form.bestseller && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={form.bestseller} onChange={() => setForm(f => ({ ...f, bestseller: !f.bestseller }))} />
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-amber-500" />
                                    <span className="text-sm font-bold text-brand-text-primary">Mark as Bestseller</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Right col: form fields */}
                    <div className="lg:col-span-2 bg-white border border-brand-border p-5 space-y-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2 space-y-1.5">
                                <FieldLabel>Product Name</FieldLabel>
                                <input
                                    type="text"
                                    placeholder="e.g. Classic Cotton T-Shirt"
                                    className={inputCls}
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                />
                                <ErrorMsg msg={errors.name} />
                            </div>

                            <div className="space-y-1.5">
                                <FieldLabel>Category</FieldLabel>
                                <select
                                    className={inputCls}
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <FieldLabel>Sub-Category</FieldLabel>
                                <select
                                    className={inputCls}
                                    value={form.subCategory}
                                    onChange={e => setForm(f => ({ ...f, subCategory: e.target.value }))}
                                >
                                    {SUBCATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <FieldLabel>Price (₹)</FieldLabel>
                                <input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    className={inputCls}
                                    value={form.price}
                                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                />
                                <ErrorMsg msg={errors.price} />
                            </div>

                            <div className="space-y-1.5">
                                <FieldLabel>Stock Quantity</FieldLabel>
                                <input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    className={inputCls}
                                    value={form.stock}
                                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                                />
                                <ErrorMsg msg={errors.stock} />
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <FieldLabel>Description</FieldLabel>
                                <textarea
                                    rows={5}
                                    placeholder="Describe the product — material, fit, care instructions..."
                                    className={inputCls + ' resize-none leading-relaxed'}
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                />
                                <ErrorMsg msg={errors.description} />
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end pt-3 border-t border-brand-border">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-7 py-3 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Adding...
                                    </>
                                ) : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </PageShell>
    );
};

Add.propTypes = { token: PropTypes.string.isRequired };

export default Add;
