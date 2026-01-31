import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
    UploadCloud,
    X,
    Check
} from "lucide-react";

const AddProduct = ({ token }) => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Default subcategories based on category could be handled here if needed
    // For now keeping it simple as per original, but user can edit subCategory if needed? 
    // Original code had fixed subCategory state but no input to change it? 
    // Wait, original code had `const [subCategory] = useState("Topwear");` so it was fixed!
    // I should probably allow it to be changed or atleast keep it consistent.
    // Let's add a select for subCategory or standard input.

    useEffect(() => {
        const images = [image1, image2, image3, image4];
        return () => {
            images.forEach((img) => {
                if (img?.preview) URL.revokeObjectURL(img.preview);
            });
        };
    }, [image1, image2, image3, image4]);

    const handleImageChange = (e, setImage) => {
        const file = e.target.files[0];
        if (file) {
            setImage({ file, preview: URL.createObjectURL(file) });
        }
    };

    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Product name is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!price || price <= 0) newErrors.price = "Valid price is required";
        if (!stock || stock < 0) newErrors.stock = "Valid stock quantity is required";
        if (sizes.length === 0) newErrors.sizes = "At least one size must be selected";
        if (!image1) newErrors.images = "Primary image is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [name, description, price, stock, sizes, image1]);

    const resetForm = useCallback(() => {
        setName(""); setDescription(""); setPrice(""); setStock(""); setSizes([]); 
        setBestseller(false); 
        setImage1(null); setImage2(null); setImage3(null); setImage4(null);
        setErrors({});
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("price", parseFloat(price));
            formData.append("stock", parseInt(stock));
            formData.append("description", description.trim());
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("sizes", JSON.stringify(sizes));

            if (image1) formData.append("image1", image1.file);
            if (image2) formData.append("image2", image2.file);
            if (image3) formData.append("image3", image3.file);
            if (image4) formData.append("image4", image4.file);

            const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Product added successfully");
                resetForm();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Add product error", error);
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const handleSizeToggle = (size) => {
        setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
    };

    const imageSetters = [setImage1, setImage2, setImage3, setImage4];
    const images = [image1, image2, image3, image4];

    return (
        <div className="min-h-screen p-6 lg:p-10 font-sans text-slate-100">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Add New Product</h1>
                        <p className="text-slate-400 text-sm">Create a new product in your catalog.</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={resetForm}
                        className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                        Reset Form
                    </button>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-8">
                    
                    {/* Image Upload */}
                    <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6">
                        <h3 className="text-sm font-medium text-slate-300 mb-4 block">Product Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg hover:border-indigo-500 transition-colors overflow-hidden">
                                    {img ? (
                                        <>
                                            <img src={img.preview} className="w-full h-full object-cover" alt={`Product ${idx + 1}`} />
                                            <button 
                                                type="button"
                                                onClick={() => imageSetters[idx](null)}
                                                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-rose-500 text-white rounded-full backdrop-blur-sm transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                            <UploadCloud className="w-8 h-8 text-slate-500 mb-2 group-hover:text-indigo-400 transition-colors" />
                                            <span className="text-xs text-slate-500 font-medium">{idx === 0 ? "Main Image" : `Image ${idx + 1}`}</span>
                                            <input type="file" hidden onChange={(e) => handleImageChange(e, imageSetters[idx])} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.images && <p className="mt-2 text-rose-500 text-xs">{errors.images}</p>}
                    </div>

                    {/* Basic Details */}
                    <div className="bg-[#0f111a] border border-slate-800 rounded-xl p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Product Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Cotton Classic Tee" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <p className="text-rose-500 text-xs">{errors.name}</p>}
                            </div>

                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Category</label>
                                <select 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm cursor-pointer"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Kids">Kids</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Description</label>
                            <textarea 
                                rows="4"
                                placeholder="Write a detailed description of the product..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {errors.description && <p className="text-rose-500 text-xs">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Price (INR)</label>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                {errors.price && <p className="text-rose-500 text-xs">{errors.price}</p>}
                            </div>

                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Stock Quantity</label>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                                {errors.stock && <p className="text-rose-500 text-xs">{errors.stock}</p>}
                            </div>

                             <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Sub Category</label>
                                <select 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors text-sm cursor-pointer"
                                    value={subCategory}
                                    onChange={(e) => setSubCategory(e.target.value)}
                                >
                                    <option value="Topwear">Topwear</option>
                                    <option value="Bottomwear">Bottomwear</option>
                                    <option value="Winterwear">Winterwear</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-300">Available Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {["S", "M", "L", "XL", "XXL"].map(s => (
                                    <button 
                                        key={s}
                                        type="button"
                                        onClick={() => handleSizeToggle(s)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                                            sizes.includes(s) 
                                            ? "bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2 ring-offset-[#0f111a]" 
                                            : "bg-slate-900 border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {errors.sizes && <p className="text-rose-500 text-xs">{errors.sizes}</p>}
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                             <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${bestseller ? "bg-indigo-600 border-indigo-600" : "bg-slate-900 border-slate-700 group-hover:border-slate-500"}`}>
                                    {bestseller && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} className="hidden" />
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Mark as Bestseller</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                "Create Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddProduct.propTypes = {
    token: PropTypes.string.isRequired
};

export default AddProduct;