import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import newsletterRouter from "./routes/newsletterRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to database and cloudinary with error handling
try {
  await connectDB();
  await connectCloudinary();
} catch (error) {
  console.error('Error during initialization:', error);
  // Continue with the app even if connections fail
}

// CORS Configuration for production
const corsOptions = {
  origin: [
    'https://zerofashion.vercel.app',
    'https://zero-fashion-frontend.vercel.app',
    'https://zeroadmin.vercel.app',

    'http://localhost:5173',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  console.log(`${req.method} ${req.url}`);
  next();
});

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/newsletter", newsletterRouter);

app.get("/", (req, res) => {
  res.send("API Working correctly");
});
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Export for Vercel serverless functions
export default app;

// Start server only if not in production (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server Started on PORT: ${port}`));
}