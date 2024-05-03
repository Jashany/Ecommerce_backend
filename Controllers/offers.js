import asyncHandler from "express-async-handler";
import connection from "../Db/Index.js";
const getAllOffers = asyncHandler(async (req, res) => {
    const query = "SELECT * FROM Offers WHERE Status = 'active'";
    connection.query(query, (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).json(data);
    });
});

const getOfferById = asyncHandler(async (req, res) => {
    const offerId = req.params.offerId;
    const query = "SELECT * FROM Offers WHERE Id = ? AND Status = 'active'";
    connection.query(query, [offerId], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        if (data.length === 0) {
            res.status(404).json({ message: "Offer not found" });
        }
        res.status(200).json(data[0]);
    });
});

const applyOffer = asyncHandler(async (req, res) => {
    const { offerCode } = req.body;
    const query = "SELECT * FROM Offers WHERE Coupon_code = ? AND Status = 'active'";
    connection.query(query, [offerCode], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        if (data.length === 0) {
            res.status(404).json({ message: "Offer not found or expired" });
        } else {
            const offer = data[0];
            let discountAmount;
            if (offer.discount_type === 'fixed') {
                discountAmount = offer.discount_value;
            } else if (offer.discount_type === 'rate') {
                discountAmount = (offer.discount_value / 100) * cartTotal;
            } else {
                res.status(400).json({ message: "Invalid discount type" });
            }
        
            const updatedCartTotal = cartTotal - discountAmount;
            res.status(200).json({ message: "Offer applied successfully", updatedCartTotal });
        }
    });
});

const addOffer = asyncHandler(async (req, res) => {
    const { couponCode, discountType, discountValue, startDate, endDate, description, status } = req.body;
    const query = "INSERT INTO Offers (Coupon_code, Discount_type, Discount_value, Start_date, End_date, Description, Status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    connection.query(query, [couponCode, discountType, discountValue, startDate, endDate, description, status], (err, data) => {
        if (err) {
            res.status(400).json(err);
        }
        res.status(201).json({ message: "Offer added successfully" });
    });
});

export { getAllOffers, getOfferById, applyOffer, addOffer };