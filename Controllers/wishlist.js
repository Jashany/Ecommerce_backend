import asyncHandler from "express-async-handler";
import connection from "../Db/Index.js";

const getWishlistItems = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const query = "SELECT * FROM Wishlist WHERE User_id = ?";
    connection.query(query, [userId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json(data);
    });
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;
    const query = "INSERT INTO Wishlist (User_id, Product_id) VALUES (?, ?)";
    connection.query(query, [userId, productId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(201).json({ message: "Product added to wishlist successfully" });
    });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
    const { userId, productId } = req.body;
    const query = "DELETE FROM Wishlist WHERE User_id = ? AND Product_id = ?";
    connection.query(query, [userId, productId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json({ message: "Product removed from wishlist successfully" });
    });
});

export { getWishlistItems, addToWishlist, removeFromWishlist };