import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  try {
    // Check if all required Cloudinary credentials are present
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
      console.warn("⚠️  Cloudinary credentials not found in environment variables");
      console.warn("   Image upload functionality will be disabled");
      console.warn("   Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_SECRET_KEY");
      return;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
    
    console.log("✅ Connected to Cloudinary successfully!");
  } catch (error) {
    console.error("❌ Error connecting to Cloudinary:", error.message);
    console.warn("   Image upload functionality will be limited");
  }
};

export default connectCloudinary;
