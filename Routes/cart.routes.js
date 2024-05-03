import express from "express";
import { getCartItems,addToCart,clearCart,removeCartItem,updateCartItem } from "../Controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.get("/:userId", getCartItems);
cartRouter.post("/add", addToCart);
cartRouter.put("/update", updateCartItem);
cartRouter.delete("/remove", removeCartItem);
cartRouter.delete("/clear/:userId", clearCart);

export default cartRouter;