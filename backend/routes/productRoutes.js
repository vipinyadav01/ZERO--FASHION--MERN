import express from "express";
import {
  listProduct,
  addProduct,
  removeProduct,
  singleProduct,
  getLowStockProducts,
  updateProduct,
} from "../controllers/productController.js";
import adminAuth from "../middleware/adminAuth.js";
import multer from "../middleware/multer.js";
import { insertSampleData } from "../sampleData.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  multer.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  adminAuth,
  addProduct
);
productRouter.post("/remove", adminAuth, removeProduct);
productRouter.post("/single", singleProduct);
productRouter.get("/list", listProduct);
productRouter.get("/low-stock", adminAuth, getLowStockProducts);
productRouter.put("/update/:id", adminAuth, updateProduct);

productRouter.post("/add-sample-data", async (req, res) => {
  try {
    const result = await insertSampleData();
    res.json({ 
      success: true, 
      message: `${result.length} sample products added successfully`,
      products: result.length 
    });
  } catch (error) {
    console.error("Error adding sample data:", error);
    res.json({ success: false, message: error.message });
  }
});

export default productRouter;
