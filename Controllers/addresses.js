import asyncHandler from "express-async-handler";
import connection from "../Db/Index.js";

const getUserAddresses = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const query = "SELECT * FROM Shipping_addresses WHERE User_id = ?";
    connection.query(query, [userId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json(data);
    });
});

const addAddress = asyncHandler(async (req, res) => {
    const { userId, fullAddress, state, city, zipCode } = req.body;
    const query = "INSERT INTO Shipping_addresses (User_id, Full_address, State, City, Zip_code) VALUES (?, ?, ?, ?, ?)";
    connection.query(query, [userId, fullAddress, state, city, zipCode], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(201).json({ message: "Address added successfully" });
    });
});

const updateAddress = asyncHandler(async (req, res) => {
    const { addressId, fullAddress, state, city, zipCode } = req.body;
    const query = "UPDATE Shipping_addresses SET Full_address = ?, State = ?, City = ?, Zip_code = ? WHERE Id = ?";
    connection.query(query, [fullAddress, state, city, zipCode, addressId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json({ message: "Address updated successfully" });
    });
});

const removeAddress = asyncHandler(async (req, res) => {
    const addressId = req.params.addressId;
    const query = "DELETE FROM Shipping_addresses WHERE Id = ?";
    connection.query(query, [addressId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json({ message: "Address removed successfully" });
    });
});

export { getUserAddresses, addAddress, updateAddress, removeAddress };