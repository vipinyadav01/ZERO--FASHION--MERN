import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

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
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());

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