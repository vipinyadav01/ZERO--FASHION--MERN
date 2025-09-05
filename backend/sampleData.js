import ProductModel from "./models/productModel.js";

const sampleProducts = [
  {
    name: "Classic White T-Shirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear",
    price: 599,
    image: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    bestseller: true,
    date: new Date()
  },
  {
    name: "Elegant Black Dress",
    description: "Stylish black dress for formal occasions",
    price: 1299,
    image: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop"
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["XS", "S", "M", "L"],
    bestseller: false,
    date: new Date()
  },
  {
    name: "Kids Colorful Jacket",
    description: "Warm and colorful jacket for children",
    price: 899,
    image: [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop"
    ],
    category: "Kids",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    bestseller: true,
    date: new Date()
  },
  {
    name: "Men's Denim Jeans",
    description: "Classic blue denim jeans with perfect fit",
    price: 1599,
    image: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    ],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["30", "32", "34", "36"],
    bestseller: true,
    date: new Date()
  },
  {
    name: "Women's Summer Top",
    description: "Light and breezy summer top for hot days",
    price: 799,
    image: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop"
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["XS", "S", "M", "L", "XL"],
    bestseller: false,
    date: new Date()
  }
];

export const insertSampleData = async () => {
  try {
    // Clear existing products
    await ProductModel.deleteMany({});
    
    // Insert sample products
    const result = await ProductModel.insertMany(sampleProducts);
    console.log(`${result.length} sample products inserted successfully`);
    return result;
  } catch (error) {
    console.error("Error inserting sample data:", error);
    throw error;
  }
};

export default sampleProducts;
