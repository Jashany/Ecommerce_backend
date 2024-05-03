import express from "express";
import { getWishlistItems,removeFromWishlist,addToWishlist } from "../Controllers/wishlist.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/:userId", getWishlistItems);
wishlistRouter.post("/add", addToWishlist);
wishlistRouter.delete("/remove/:wishlistItemId", removeFromWishlist);

export default wishlistRouter;