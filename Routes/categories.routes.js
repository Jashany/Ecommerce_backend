import express from "express";
import { getCategoryById,addCategory,getAllCategories,getProductsByCategory } from "../Controllers/categories.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:categoryId", getCategoryById);
categoryRouter.get("/:categoryId/products", getProductsByCategory);
categoryRouter.post("/add", addCategory);

export default categoryRouter;