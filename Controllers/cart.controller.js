import asyncHandler from "express-async-handler";
import connection from "../Db/Index.js";
const getCartItems = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    
    const query = " SELECT Carts.*, products.Product_Name, products.Description, products.Price ,products.imageUrl FROM Carts INNER JOIN Products ON Carts.Product_id = products.Id WHERE Carts.User_id = ?";
    connection.query(query, [userId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        else{

            res.status(200).json(data);
        }
    });
});

const   addToCart = asyncHandler(async (req, res) => {
    const { userId, productId, quantity } = req.body;
    const query = "INSERT INTO Carts (User_id, Product_id, Quantity) VALUES (?, ?, ?)";
    connection.query(query, [userId, productId, quantity], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }else{

            res.status(201).json({ message: "Product added to cart successfully" });
        }
    });
});

const updateCartItem = asyncHandler(async (req, res) => {
    const { cartItemId, quantity } = req.body;
    console.log(cartItemId, quantity)
    const query = "UPDATE Carts SET Quantity = ? WHERE Id = ?";
    connection.query(query, [quantity, cartItemId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        else{
            res.status(200).json({ message: "Cart item updated successfully" });
        }
    });
});

const removeCartItem = asyncHandler(async (req, res) => {
    const {cartItemId} = req.body ;
    console.log(cartItemId)
    const query = "DELETE FROM carts WHERE Id = ?";
    connection.query(query, [cartItemId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        else{

            res.status(200).json({ message: "Cart item removed successfully" });
        }
    });
});

const clearCart = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const query = "DELETE FROM Carts WHERE User_id = ?";
    connection.query(query, [userId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json({ message: "Cart cleared successfully" });
    });
});

export { getCartItems, addToCart, updateCartItem, removeCartItem, clearCart };