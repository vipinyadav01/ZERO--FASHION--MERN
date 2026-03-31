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
        <div className="min-h-screen p-6 lg:p-10 font-sans text-brand-text-primary bg-brand-bg">
            <div className="max-w-4xl mx-auto space-y-10">
                
                {/* Header */}
                <div className="flex justify-between items-end border-b border-brand-border pb-8">
                    <div>
                        <h1 className="text-3xl font-black text-brand-text-primary mb-2 uppercase tracking-tight">New Archive Item</h1>
                        <p className="text-brand-text-secondary text-[10px] font-bold uppercase tracking-widest">Register a new product into the catalog</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={resetForm}
                        className="text-brand-text-secondary hover:text-brand-text-primary text-[10px] font-black uppercase tracking-widest transition-colors mb-1"
                    >
                        Reset Form
                    </button>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-10">
                    
                    {/* Image Upload */}
                    <div className="bg-white border border-brand-border rounded-none p-8">
                        <h3 className="text-[10px] font-black text-brand-text-secondary mb-6 uppercase tracking-widest block">Product Imagery</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group aspect-square bg-brand-surface border border-brand-border rounded-none hover:border-black transition-all overflow-hidden border-dashed">
                                    {img ? (
                                        <>
                                            <img src={img.preview} className="w-full h-full object-cover brightness-[0.98]" alt={`Product ${idx + 1}`} />
                                            <button 
                                                type="button"
                                                onClick={() => imageSetters[idx](null)}
                                                className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-600 hover:text-white border border-brand-border text-brand-text-primary rounded-none backdrop-blur-sm transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                            <UploadCloud className="w-8 h-8 text-brand-text-secondary mb-3 group-hover:text-black transition-colors" />
                                            <span className="text-[10px] text-brand-text-secondary font-black uppercase tracking-widest">{idx === 0 ? "Main" : `Image 0${idx + 1}`}</span>
                                            <input type="file" hidden onChange={(e) => handleImageChange(e, imageSetters[idx])} accept="image/*" />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.images && <p className="mt-3 text-red-600 text-[10px] font-black uppercase tracking-widest">{errors.images}</p>}
                    </div>

                    {/* Basic Details */}
                    <div className="bg-white border border-brand-border rounded-none p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Archive Name</label>
                                <input 
                                    type="text" 
                                    placeholder="E.G. COTTON CLASSIC TEE" 
                                    className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary uppercase text-[10px] font-black tracking-widest placeholder:text-brand-text-secondary/30 focus:outline-none focus:border-brand-accent transition-colors"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{errors.name}</p>}
                            </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Primary Collection</label>
                                <div className="relative">
                                    <select 
                                        className="appearance-none w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary uppercase text-[10px] font-black tracking-widest focus:outline-none focus:border-brand-accent transition-colors cursor-pointer"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Detail Description</label>
                            <textarea 
                                rows="4"
                                placeholder="PROVIDE DETAILED ARCHIVE ANALYSIS..."
                                className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary uppercase text-[10px] font-black tracking-widest placeholder:text-brand-text-secondary/30 focus:outline-none focus:border-brand-accent transition-colors resize-none leading-relaxed"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {errors.description && <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Unit Price (INR)</label>
                                <input 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                {errors.price && <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{errors.price}</p>}
                            </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Inventory Stock</label>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    className="w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-brand-accent transition-colors"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                                {errors.stock && <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{errors.stock}</p>}
                            </div>

                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Secondary Tag</label>
                                <select 
                                    className="appearance-none w-full bg-white border border-brand-border rounded-none px-5 py-4 text-brand-text-primary uppercase text-[10px] font-black tracking-widest focus:outline-none focus:border-brand-accent transition-colors cursor-pointer"
                                    value={subCategory}
                                    onChange={(e) => setSubCategory(e.target.value)}
                                >
                                    <option value="Topwear">Topwear</option>
                                    <option value="Bottomwear">Bottomwear</option>
                                    <option value="Winterwear">Winterwear</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <label className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest">Available Sizes</label>
                            <div className="flex flex-wrap gap-3">
                                {["S", "M", "L", "XL", "XXL"].map(s => (
                                    <button 
                                        key={s}
                                        type="button"
                                        onClick={() => handleSizeToggle(s)}
                                        className={`w-12 h-12 rounded-none text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center border ${
                                            sizes.includes(s) 
                                            ? "bg-brand-accent border-brand-accent text-white" 
                                            : "bg-white border-brand-border text-brand-text-secondary hover:border-black hover:text-black"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {errors.sizes && <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{errors.sizes}</p>}
                        </div>

                        <div className="pt-8 border-t border-brand-border">
                             <label className="flex items-center gap-4 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-none border flex items-center justify-center transition-all ${bestseller ? "bg-brand-accent border-brand-accent" : "bg-white border-brand-border group-hover:border-black"}`}>
                                    {bestseller && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <input type="checkbox" checked={bestseller} onChange={() => setBestseller(!bestseller)} className="hidden" />
                                <span className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest group-hover:text-black transition-colors">Mark as Bestseller / Featured</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-12 py-4 bg-brand-accent hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-none transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Synchronizing...
                                </>
                            ) : (
                                "Commit to Archive"
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