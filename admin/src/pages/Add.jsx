import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
    UploadCloud,
    Star,
    DollarSign,
    Image as ImageIcon,
    Type,
    Sparkles} from "lucide-react";

const AddProduct = ({ token }) => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [discountPercent] = useState(0);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
        if (!name.trim()) newErrors.name = "Asset name required";
        if (!description.trim()) newErrors.description = "Manifest description required";
        if (!price || price <= 0) newErrors.price = "Valuation invalid";
        if (sizes.length === 0) newErrors.sizes = "Variant scale required";
        if (!image1) newErrors.images = "Primary visual required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [name, description, price, sizes, image1]);

    const resetForm = useCallback(() => {
        setName(""); setDescription(""); setPrice(""); setSizes([]); 
        setBestseller(false); 
        setImage1(null); setImage2(null); setImage3(null); setImage4(null);
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("price", parseFloat(price));
            formData.append("description", description.trim());
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("discountPercent", Number(discountPercent) || 0);
            formData.append("sizes", JSON.stringify(sizes));

            if (image1) formData.append("image1", image1.file);
            if (image2) formData.append("image2", image2.file);
            if (image3) formData.append("image3", image3.file);
            if (image4) formData.append("image4", image4.file);

            const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Asset ingested successfully");
                resetForm();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Ingestion sync error", error);
            toast.error("Ingestion failure: System error");
        } finally {
            setLoading(false);
        }
    };

    const handleSizeToggle = (size) => {
        setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
    };

    const images = [image1, image2, image3, image4];
    const imageSetters = [setImage1, setImage2, setImage3, setImage4];

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-10 font-['Montserrat']">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Product Studio Header */}
                <header className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0f] border border-slate-800/60 p-8 sm:p-12 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 blur-[100px] -mr-48 -mt-48 rounded-full animate-pulse"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Sparkles className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                                    Product <span className="text-emerald-500">Studio</span>
                                </h1>
                            </div>
                            <p className="text-slate-400 text-lg font-medium max-w-md">
                                Design your catalog. Ingest high-fidelity product data into the global inventory repository.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button type="button" onClick={resetForm} className="px-8 py-5 bg-slate-900 border border-slate-800 text-slate-400 font-black uppercase text-xs tracking-widest rounded-2xl hover:text-white transition-all">
                                Wipe Form
                            </button>
                        </div>
                    </div>
                </header>

                <form onSubmit={onSubmitHandler} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Panel: Media Management */}
                    <div className="lg:col-span-5 space-y-8">
                        <section className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-8 lg:p-10 shadow-xl">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3 italic">
                                <ImageIcon className="w-5 h-5 text-indigo-400" />
                                Visual Assets
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className={`relative group aspect-[3/4] rounded-3xl border-2 border-dashed transition-all duration-500 overflow-hidden ${img ? "border-solid border-slate-700 bg-slate-900" : "border-slate-800 hover:border-indigo-500/50 bg-[#06060a]"}`}>
                                        {img ? (
                                            <>
                                                <img src={img.preview} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" alt="" />
                                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-all bg-gradient-to-t from-black via-black/40 to-transparent">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => imageSetters[idx](null)}
                                                        className="w-full py-3 bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-500 transition-colors"
                                                    >
                                                        Discard
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center p-6 text-center group">
                                                <UploadCloud className="w-10 h-10 text-slate-800 group-hover:text-indigo-500 transition-colors mb-4" />
                                                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-normal">
                                                    {idx === 0 ? "PRIMARY_MASTER" : `AUXILIARY_0${idx}`}
                                                </p>
                                                <input type="file" hidden onChange={(e) => handleImageChange(e, imageSetters[idx])} accept="image/*" />
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {errors.images && <p className="mt-4 text-rose-500 text-[10px] font-black tracking-widest uppercase text-center">{errors.images}</p>}
                        </section>
                    </div>

                    {/* Right Panel: Specifications */}
                    <div className="lg:col-span-7 space-y-8">
                        <section className="bg-[#0a0a0f] border border-slate-800/60 rounded-[2.5rem] p-8 lg:p-10 shadow-xl space-y-10">
                            
                            {/* Product Manifest */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter border-b border-slate-800 pb-4 italic">Product Manifest</h3>
                                
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Type className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                        <input 
                                            type="text" 
                                            placeholder="OFFERING NAME (E.G. MIDNIGHT OVERSIZED TEE)" 
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-16 pr-6 py-5 text-white font-black placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all uppercase italic"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative">
                                        <textarea 
                                            placeholder="COMPOSITION AND TECHNICAL SPECIFICATIONS..." 
                                            rows="4"
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-5 text-white font-medium placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Classification and Valuation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Market Segment</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["Men", "Women", "Kids"].map(c => (
                                            <button 
                                                key={c}
                                                type="button"
                                                onClick={() => setCategory(c)}
                                                className={`py-3 rounded-xl border font-black text-[10px] tracking-widest transition-all ${category === c ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"}`}
                                            >
                                                {c.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Pricing Strategy</p>
                                    <div className="relative">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                                        <input 
                                            type="number" 
                                            placeholder="VALUATION (INR)" 
                                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-white font-black text-2xl placeholder-slate-600 italic"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Variant Scale (Sizes) */}
                            <div className="space-y-4">
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex justify-between items-baseline">
                                    Variant Scale
                                    <span className="text-indigo-400 font-medium tracking-normal lowercase italic">{sizes.length} active variants</span>
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {["S", "M", "L", "XL", "XXL"].map(s => (
                                        <button 
                                            key={s}
                                            type="button"
                                            onClick={() => handleSizeToggle(s)}
                                            className={`w-14 h-14 rounded-xl border flex items-center justify-center font-black transition-all ${sizes.includes(s) ? "bg-white text-slate-950 border-white shadow-xl scale-110" : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600"}`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Operational Flags */}
                            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setBestseller(!bestseller)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${bestseller ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/10" : "bg-slate-900 border-slate-800 text-slate-500"}`}
                                    >
                                        <Star className={`w-4 h-4 ${bestseller ? "fill-amber-500" : ""}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Hero Asset</span>
                                    </button>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-[2rem] transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:grayscale"
                                >
                                    {loading ? "INITIALIZING..." : "COMMIT ASSET"}
                                </button>
                            </div>
                        </section>
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