import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

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
                if (img) URL.revokeObjectURL(img.preview);
            });
        };
    }, [image1, image2, image3, image4]);

    const validateImage = (file) => {
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        const maxSize = 5 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            toast.error("Please upload a valid image file (JPEG, PNG, GIF, WEBP)");
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

        if (!name.trim()) {
            toast.error("Please enter product name");
            return;
        }

        if (!description.trim()) {
            toast.error("Please enter product description");
            return;
        }

        if (!price || price <= 0) {
            toast.error("Please enter a valid price");
            return;
        }

        if (!sizes.length) {
            toast.error("Please select at least one size");
            return;
        }

        if (!image1) {
            toast.error("Please upload at least one image");
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
                        token: token,
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
            prev.includes(size)
                ? prev.filter((item) => item !== size)
                : [...prev, size]
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 hover:text-blue-600 transition-colors duration-300">
                Add New Product
            </h2>

            <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-center gap-8">
                <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <p className="mb-4 text-center text-xl font-semibold text-gray-700">Upload Images</p>
                    <div className="flex gap-6 justify-center flex-wrap">
                        {[image1, image2, image3, image4].map((image, index) => (
                            <label
                                key={index}
                                htmlFor={`image${index + 1}`}
                                className="cursor-pointer transform transition-all duration-300 hover:scale-110 hover:rotate-2"
                            >
                                <img
                                    className="w-28 h-28 object-cover border-2 border-gray-200 rounded-lg hover:border-blue-500"
                                    src={image ? image.preview : assets.upload_area}
                                    alt=""
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

                <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg space-y-8 hover:shadow-2xl transition-shadow duration-300">
                    <div className="transform transition-all duration-300 hover:translate-x-2">
                        <label className="block mb-2 font-medium text-gray-700">Product Name</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400"
                            type="text"
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div className="transform transition-all duration-300 hover:translate-x-2">
                        <label className="block mb-2 font-medium text-gray-700">Product Description</label>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400"
                            placeholder="Enter product description"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
                            <label className="block mb-2 font-medium text-gray-700">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400"
                            >
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>

                        <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
                            <label className="block mb-2 font-medium text-gray-700">Sub Category</label>
                            <select
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400"
                            >
                                <option value="Topwear">Topwear</option>
                                <option value="Bottomwear">Bottomwear</option>
                                <option value="Winterwear">Winterwear</option>
                            </select>
                        </div>

                        <div className="transform transition-all duration-300 hover:translate-y-[-4px]">
                            <label className="block mb-2 font-medium text-gray-700">Price</label>
                            <input
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:border-blue-400"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter price"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Available Sizes</label>
                        <div className="flex flex-wrap gap-6">
                            {["S", "M", "L", "XL", "XXL"].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleSizeToggle(size)}
                                    type="button"
                                    className={`px-6 py-3 border-2 rounded-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${sizes.includes(size)
                                            ? "bg-blue-500 text-white"
                                            : "bg-white text-gray-700 border-gray-300"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                        <input
                            onChange={() => setBestseller(!bestseller)}
                            checked={bestseller}
                            type="checkbox"
                            id="bestseller"
                            className="h-5 w-5 cursor-pointer"
                        />
                        <label htmlFor="bestseller" className="font-semibold text-gray-700">Bestseller</label>
                    </div>

                    <div className="flex justify-center gap-8 mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                        >
                            {loading ? "Adding..." : "Add Product"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
