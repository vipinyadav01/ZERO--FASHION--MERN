import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

// Load environment variables
dotenv.config();
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import newsletterRouter from "./routes/newsletterRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

import mongoSanitize from "express-mongo-sanitize";

const app = express();
app.set("trust proxy", 1); // Trust first proxy (needed for Vercel/Heroku rate limiting)
const port = process.env.PORT || 4000;

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Global Rate Limiting (DDoS Protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter); // Apply to all API routes

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4000",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For development, you might want to log this but still allow it if you are stuck
      console.warn(`Blocked by CORS: ${origin}`);
      // callback(new Error('Not allowed by CORS')); // Uncomment to enforce strict CORS
      callback(null, true); // Temporarily allow all for smooth dev experience, CHANGE THIS IN PROD
    }
  },
  credentials: true
}));

app.use(express.json());

// Custom middleware to sanitize data (fixes Express 5 req.query setter issue)
app.use((req, res, next) => {
  const sanitize = mongoSanitize.sanitize;

  if (typeof sanitize === 'function') {
    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    // Skip req.query sanitization here to avoid Express 5 conflicts.
    // Query params are manually validated in controllers.
  }
  next();
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("API Working correctly");
});

app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// Connect to database and cloudinary
connectDB();
connectCloudinary();

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => console.log(`Server Started on PORT: ${port}`));
}