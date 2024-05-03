import asyncHandler from "express-async-handler";
import connection from "../Db/Index.js";

const getProducts = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM Products";
    connection.query(query, (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json(data);
    });
});

const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const query = "SELECT * FROM Products WHERE id = ?";
    connection.query(query, [productId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        if (data.length === 0) {
            res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(data[0]);
    });
});

const getProductsByCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const query = "SELECT * FROM Products WHERE Cat_id = ?";
    connection.query(query, [categoryId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json(data);
    });
});

const searchProducts = asyncHandler(async (req, res) => {
    const { Query } = req.body;
    const searchQuery = "%" + Query + "%";
    const query = "SELECT * FROM Products WHERE Product_name LIKE ?";
    connection.query(query, [searchQuery], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json(data);
    });
});

const addProduct = asyncHandler(async (req, res) => {
    const { productName, category, description, price, stockQuantity, status ,image } = req.body;
    const query = "INSERT INTO Products (Product_name, Cat_id, Description, Price, Stock_quantity, Status ,imageUrl) VALUES (?, ?, ?, ?, ?, ?,?)";
    connection.query(query, [productName, category, description, price, stockQuantity, status,image], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }else{

            res.status(201).json({ message: "Product added successfully" });
        }
    });
});

export { getProducts, getProductById, getProductsByCategory, searchProducts, addProduct };