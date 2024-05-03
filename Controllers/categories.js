import asyncHandler from "express-async-handler";
import connection from "../Db/Index.js";

const getAllCategories = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM Categories";
    connection.query(query, (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json(data);
    });
});

const getCategoryById = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    const query = "SELECT * FROM Categories WHERE id = ?";
    connection.query(query, [categoryId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        if (data.length === 0) {
            res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(data[0]);
    });
});

const getProductsByCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    const query = "SELECT * FROM Products WHERE Cat_id = ?";
    connection.query(query, [categoryId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        else{
            
            res.status(200).json(data);
        }
    });
});

const addCategory = asyncHandler(async (req, res) => {
    const { categoryName, urlSlug, parentCategoryId, image } = req.body;
    const query = "INSERT INTO Categories (Category_name, Url_slug, Parent_cat_id,imageUrl) VALUES (?, ?, ?,?)";
    connection.query(query, [categoryName, urlSlug, parentCategoryId, image], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }else{
            res.status(201).json({ message: "Category added successfully" });
        }
    });
});

export { getAllCategories, getCategoryById, getProductsByCategory, addCategory };