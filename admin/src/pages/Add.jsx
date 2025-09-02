import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../constants";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { 
    UploadCloud, 
    X, 
    Check, 
    Star, 
    Package, 
    DollarSign, 
    Tag, 
    Image as ImageIcon,
    Loader2,
    AlertCircle,
    Save,
    Plus
} from "lucide-react";

const AddProduct = ({ token }) => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Men");
    const [subCategory, setSubCategory] = useState("Topwear");
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        return () => {
            [image1, image2, image3, image4].forEach((img) => {
                if (img?.preview) URL.revokeObjectURL(img.preview);
            });
        };
    }, [image1, image2, image3, image4]);

    const validateImage = (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        const maxSize = 5 * 1024 * 1024;
        if (!validTypes.includes(file.type)) {
            toast.error("Please upload a valid image (JPEG, PNG, GIF, WEBP)");
            return false;
        }
        if (file.size > maxSize) {
            toast.error("Image size should be less than 5MB");
            return false;
        }
        return true;
    };

    const handleImageChange = (e, setImage) => {
        const file = e.target.files[0];
        if (file && validateImage(file)) {
            setImage({ file, preview: URL.createObjectURL(file) });
        } else {
            e.target.value = null;
        }
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOver(index);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(null);
    };

    const handleDrop = (e, setImage, index) => {
        e.preventDefault();
        setDragOver(null);
        const file = e.dataTransfer.files[0];
        if (file && validateImage(file)) {
            setImage({ file, preview: URL.createObjectURL(file) });
        }
    };

    const removeImage = (setImage) => {
        setImage(null);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!name.trim()) newErrors.name = "Product name is required";
        if (!description.trim()) newErrors.description = "Product description is required";
        if (!price || price <= 0) newErrors.price = "Please enter a valid price";
        if (!sizes.length) newErrors.sizes = "Please select at least one size";
        if (!image1) newErrors.images = "Please upload at least one image";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setPrice("");
        setSizes([]);
        setBestseller(false);
        setCategory("Men");
        setSubCategory("Topwear");
        setErrors({});
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors before submitting");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("price", parseFloat(price));
            formData.append("description", description.trim());
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("bestseller", bestseller);
            formData.append("sizes", JSON.stringify(sizes));

            if (image1) formData.append("image1", image1.file);
            if (image2) formData.append("image2", image2.file);
            if (image3) formData.append("image3", image3.file);
            if (image4) formData.append("image4", image4.file);

            const response = await axios.post(
                `${backendUrl}/api/product/add`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Product added successfully!");
                resetForm();
            } else {
                toast.error(response.data.message || "Failed to add product");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred while submitting the form");
        } finally {
            setLoading(false);
        }
    };

    const handleSizeToggle = (size) => {
        setSizes((prev) =>
            prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
        );
        if (errors.sizes) {
            setErrors(prev => ({ ...prev, sizes: null }));
        }
    };

    const handleInputChange = (field, value) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
        
        switch (field) {
            case 'name': setName(value); break;
            case 'description': setDescription(value); break;
            case 'price': setPrice(value); break;
            case 'category': setCategory(value); break;
            case 'subCategory': setSubCategory(value); break;
        }
    };

    const imageSetters = [setImage1, setImage2, setImage3, setImage4];
    const images = [image1, image2, image3, image4];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-14 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Enhanced Header */}
                <div className="text-center mb-8 lg:mb-12">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 mb-6">
                        <Package className="w-6 h-6 text-indigo-400" />
                        <span className="text-slate-300 font-medium">Product Management</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-4">
                        Add New Product
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
                        Create and customize your product listing with detailed information and high-quality images
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-6 lg:space-y-8">
                    {/* Enhanced Image Upload Section */}
                    <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-purple-500/20">
                                <ImageIcon className="w-5 h-5 text-purple-400" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Product Images</h2>
                            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                                Up to 4 images
                            </span>
                        </div>
                        
                        {errors.images && (
                            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-400" />
                                <span className="text-red-400 text-sm">{errors.images}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {images.map((image, index) => (
                                <div key={index} className="group relative">
                                    <label
                                        htmlFor={`image${index + 1}`}
                                        className={`relative cursor-pointer block transition-all duration-300 hover:scale-[1.02] ${
                                            dragOver === index ? 'scale-[1.02]' : ''
                                        }`}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, imageSetters[index], index)}
                                    >
                                        <div className={`
                                            relative w-full aspect-square rounded-2xl border-2 border-dashed overflow-hidden
                                            transition-all duration-300 group-hover:border-indigo-500/50
                                            ${image ? 'border-slate-600/50 bg-slate-700/30' : 'border-slate-600/30 bg-slate-700/20'}
                                            ${dragOver === index ? 'border-indigo-500 bg-indigo-500/10' : ''}
                                        `}>
                                            {image ? (
                                                <>
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={image.preview}
                                                        alt={`Product ${index + 1}`}
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    removeImage(imageSetters[index]);
                                                                }}
                                                                className="p-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                                                    <div className="p-3 rounded-xl bg-slate-600/30 mb-3 group-hover:bg-indigo-500/20 transition-colors">
                                                        <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-slate-400 font-medium">
                                                        {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        Click or drag
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        onChange={(e) => {
                                            handleImageChange(e, imageSetters[index]);
                                            if (errors.images) setErrors(prev => ({ ...prev, images: null }));
                                        }}
                                        type="file"
                                        id={`image${index + 1}`}
                                        hidden
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                    />
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-4 p-4 rounded-xl bg-slate-700/30 border border-slate-600/30">
                            <h4 className="text-sm font-medium text-slate-300 mb-2">Image Guidelines:</h4>
                            <ul className="text-xs text-slate-400 space-y-1">
                                <li>• Recommended size: 800x800px or higher</li>
                                <li>• Supported formats: JPEG, PNG, GIF, WEBP</li>
                                <li>• Maximum file size: 5MB per image</li>
                                <li>• First image will be used as the main product image</li>
                            </ul>
                        </div>
                    </div>

                    {/* Enhanced Form Fields Section */}
                    <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl space-y-6 lg:space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-indigo-500/20">
                                <Tag className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Product Details</h2>
                        </div>

                        {/* Product Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">Product Name *</label>
                            <input
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                value={name}
                                className={`w-full px-4 py-3 sm:py-4 bg-slate-700/50 backdrop-blur-sm text-white border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 hover:bg-slate-700/70 ${
                                    errors.name 
                                        ? 'border-red-500/50 focus:ring-red-500/50' 
                                        : 'border-slate-600/50 focus:ring-indigo-500/50 hover:border-slate-500/50'
                                }`}
                                type="text"
                                placeholder="Enter a descriptive product name"
                                required
                            />
                            {errors.name && (
                                <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">Product Description *</label>
                            <textarea
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                value={description}
                                className={`w-full px-4 py-3 sm:py-4 bg-slate-700/50 backdrop-blur-sm text-white border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 hover:bg-slate-700/70 resize-none ${
                                    errors.description 
                                        ? 'border-red-500/50 focus:ring-red-500/50' 
                                        : 'border-slate-600/50 focus:ring-indigo-500/50 hover:border-slate-500/50'
                                }`}
                                placeholder="Describe your product features, materials, and benefits"
                                rows="4"
                                required
                            />
                            {errors.description && (
                                <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        {/* Category, Subcategory, Price Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">Category *</label>
                                <select
                                    value={category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full px-4 py-3 sm:py-4 bg-slate-700/50 backdrop-blur-sm text-white border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:bg-slate-700/70 hover:border-slate-500/50"
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Kids">Kids</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">Sub Category *</label>
                                <select
                                    value={subCategory}
                                    onChange={(e) => handleInputChange('subCategory', e.target.value)}
                                    className="w-full px-4 py-3 sm:py-4 bg-slate-700/50 backdrop-blur-sm text-white border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 hover:bg-slate-700/70 hover:border-slate-500/50"
                                >
                                    <option value="Topwear">Topwear</option>
                                    <option value="Bottomwear">Bottomwear</option>
                                    <option value="Winterwear">Winterwear</option>
                                </select>
                            </div>
                            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                <label className="block text-sm font-semibold text-slate-300">
                                    <DollarSign className="w-4 h-4 inline mr-1" />
                                    Price *
                                </label>
                                <input
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    value={price}
                                    className={`w-full px-4 py-3 sm:py-4 bg-slate-700/50 backdrop-blur-sm text-white border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-300 hover:bg-slate-700/70 ${
                                        errors.price 
                                            ? 'border-red-500/50 focus:ring-red-500/50' 
                                            : 'border-slate-600/50 focus:ring-indigo-500/50 hover:border-slate-500/50'
                                    }`}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    required
                                />
                                {errors.price && (
                                    <div className="flex items-center gap-2 text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.price}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Sizes */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-slate-300">Available Sizes *</label>
                            {errors.sizes && (
                                <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.sizes}
                                </div>
                            )}
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                                {["S", "M", "L", "XL", "XXL"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeToggle(size)}
                                        type="button"
                                        className={`relative px-4 py-3 sm:py-4 rounded-2xl border text-center font-medium transition-all duration-300 hover:scale-[1.02] ${
                                            sizes.includes(size) 
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25" 
                                                : "bg-slate-700/50 border-slate-600/50 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-600/50"
                                        }`}
                                    >
                                        {sizes.includes(size) && (
                                            <Check className="w-4 h-4 absolute top-1 right-1" />
                                        )}
                                        <span className="text-sm sm:text-base font-bold">{size}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced Bestseller Toggle */}
                        <div className="relative">
                            <div className="flex items-center justify-between p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-amber-500/20">
                                        <Star className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <label htmlFor="bestseller" className="text-base font-semibold text-white cursor-pointer">
                                            Mark as Bestseller
                                        </label>
                                        <p className="text-sm text-slate-400">Highlight this product as a top seller</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        onChange={() => setBestseller(!bestseller)}
                                        checked={bestseller}
                                        type="checkbox"
                                        id="bestseller"
                                        className="sr-only peer"
                                    />
                                    <div className="relative w-14 h-7 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-500"></div>
                                </label>
                            </div>
                        </div>

                        {/* Enhanced Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full sm:w-auto mx-auto flex items-center justify-center gap-3 px-8 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-2xl transition-all duration-300 ${
                                    loading 
                                        ? "bg-slate-600 text-slate-300 cursor-not-allowed" 
                                        : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/25"
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Adding Product...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Add Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;