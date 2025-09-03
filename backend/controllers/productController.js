import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../models/productModel.js";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// function for adding a product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    if (!name || !description || !price || !category || !subCategory) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        // Convert buffer to stream for Cloudinary
        const stream = Readable.from(item.buffer);
        
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );
          
          stream.pipe(uploadStream);
        });
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imageUrl,
      date: Date.now(),
    };

    const product = new ProductModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for listing products
const listProduct = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing a product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id)
      return res.json({ success: false, message: "Product ID is required" });

    await ProductModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId)
      return res.json({ success: false, message: "Product ID is required" });

    const product = await ProductModel.findById(productId);
    if (!product)
      return res.json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get low stock products for notifications (Admin)
const getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const products = await ProductModel.find({
      stock: { $lte: parseInt(threshold) }
    })
    .sort({ stock: 1 })
    .limit(10)
    .select("_id name stock price category")
    .lean();

    res.json({ 
      success: true, 
      products 
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProduct, addProduct, removeProduct, singleProduct, getLowStockProducts };
