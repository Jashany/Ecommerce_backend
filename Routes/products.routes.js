import express from "express";
import { getProductsByCategory,getProductById,getProducts,searchProducts,addProduct } from "../Controllers/products.controller.js";
const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);
productRouter.get("/category/:id", getProductsByCategory);
productRouter.post("/search", searchProducts);
productRouter.post("/add", addProduct);

export default productRouter;