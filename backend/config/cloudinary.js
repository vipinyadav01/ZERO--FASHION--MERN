import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_KEY) {
    console.warn("Cloudinary credentials missing");
    return;
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });

  console.log("Connected to Cloudinary");
};

export default connectCloudinary;
