import express from "express";
import { getOrderById,getUserOrders,placeOrder } from "../Controllers/order.js";
const orderRouter = express.Router();

orderRouter.post("/", getUserOrders);
orderRouter.get("/:id", getOrderById);
orderRouter.post("/place", placeOrder);   


export default orderRouter;

