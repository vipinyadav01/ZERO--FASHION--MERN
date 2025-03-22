import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Async connection wrapper to catch errors
const startServer = async () => {
    try {
        await connectDB();
        console.log("MongoDB connected successfully");
        await connectCloudinary();
        console.log("Cloudinary connected successfully");
    } catch (error) {
        console.error("Startup error:", error);
        process.exit(1); // Exit locally, log on Vercel
    }
};

// Run connections
startServer().catch((error) => console.error("Failed to start server:", error));

app.use(express.json());

// CORS configuration
app.use(
    cors({
        origin: "https://zeroadmin.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log("Headers:", req.headers);
    next();
});

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
    console.error("Error stack:", err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Local development
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => console.log(`Server Started on PORT: ${port}`));
}

export default app;