import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { UploadCloud } from "lucide-react";

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
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!name.trim()) return toast.error("Please enter product name");
        if (!description.trim()) return toast.error("Please enter product description");
        if (!price || price <= 0) return toast.error("Please enter a valid price");
        if (!sizes.length) return toast.error("Please select at least one size");
        if (!image1) return toast.error("Please upload at least one image");

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
    };

    return (
        <div className="min-h-screen bg-[#131313] p-6 py-20">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-white text-center mb-8">
                    Add New Product
                </h2>

                <form onSubmit={onSubmitHandler} className="space-y-8">
                    {/* Image Upload Section */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl p-6 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/20 transition-all duration-300">
                        <p className="text-xl font-semibold text-[#939393] text-center mb-6">Upload Images</p>
                        <div className="flex flex-wrap gap-6 justify-center">
                            {[image1, image2, image3, image4].map((image, index) => (
                                <label
                                    key={index}
                                    htmlFor={`image${index + 1}`}
                                    className="relative cursor-pointer group transition-all duration-300 hover:scale-105"
                                >
                                    <img
                                        className="w-28 h-28 object-cover rounded-xl border-2 border-[#939393]/20 group-hover:border-[#ff6200]/50"
                                        src={image ? image.preview : assets.upload_area}
                                        alt={`Upload ${index + 1}`}
                                    />
                                    <UploadCloud
                                        size={24}
                                        className="absolute inset-0 m-auto text-[#ff6200] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                    <input
                                        onChange={(e) => handleImageChange(e, [setImage1, setImage2, setImage3, setImage4][index])}
                                        type="file"
                                        id={`image${index + 1}`}
                                        hidden
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Form Fields Section */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl p-6 border border-[#939393]/20 shadow-lg hover:shadow-[#ff6200]/20 transition-all duration-300 space-y-8">
                        {/* Product Name */}
                        <div>
                            <label className="block mb-2 font-medium text-[#939393]">Product Name</label>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                type="text"
                                placeholder="Enter product name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block mb-2 font-medium text-[#939393]">Product Description</label>
                            <textarea
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                placeholder="Enter product description"
                                rows="4"
                                required
                            />
                        </div>

                        {/* Category, Subcategory, Price */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block mb-2 font-medium text-[#939393]">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Kids">Kids</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 font-medium text-[#939393]">Sub Category</label>
                                <select
                                    value={subCategory}
                                    onChange={(e) => setSubCategory(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                >
                                    <option value="Topwear">Topwear</option>
                                    <option value="Bottomwear">Bottomwear</option>
                                    <option value="Winterwear">Winterwear</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 font-medium text-[#939393]">Price</label>
                                <input
                                    onChange={(e) => setPrice(e.target.value)}
                                    value={price}
                                    className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-[#939393]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6200] transition-all duration-300 hover:border-[#ff6200]/50"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter price"
                                    required
                                />
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block mb-2 font-medium text-[#939393]">Available Sizes</label>
                            <div className="flex flex-wrap gap-4">
                                {["S", "M", "L", "XL", "XXL"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => handleSizeToggle(size)}
                                        type="button"
                                        className={`px-6 py-3 rounded-xl border border-[#939393]/20 text-white transition-all duration-300 hover:border-[#ff6200] hover:bg-[#ff6200]/10 ${sizes.includes(size) ? "bg-[#ff6200] border-[#ff6200]" : "bg-[#1a1a1a]"}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bestseller */}
                        <div className="flex items-center gap-4">
                            <input
                                onChange={() => setBestseller(!bestseller)}
                                checked={bestseller}
                                type="checkbox"
                                id="bestseller"
                                className="h-5 w-5 text-[#ff6200] bg-[#1a1a1a] border-[#939393]/20 rounded focus:ring-[#ff6200] cursor-pointer"
                            />
                            <label htmlFor="bestseller" className="font-medium text-[#939393]">Bestseller</label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-3 bg-[#ff6200] text-white font-bold rounded-xl transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#ff4500] hover:shadow-[#ff6200]/50 hover:-translate-y-1"}`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h-8z" />
                                        </svg>
                                        Adding...
                                    </span>
                                ) : (
                                    "Add Product"
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