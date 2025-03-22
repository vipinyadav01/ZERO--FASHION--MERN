import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to database and cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());

// Explicit CORS configuration
app.use(
    cors({
        origin: "https://zeroadmin.vercel.app", // Restrict to your frontend
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
        credentials: true, // If you use cookies or auth headers
    })
);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    next();
});

// Handle preflight OPTIONS requests globally
app.options("*", cors()); // Ensure preflight requests are handled

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
    res.send("API Working correctly");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Start server locally (for development)
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => console.log(`Server Started on PORT: ${port}`));
}

// Export for Vercel
export default app; 