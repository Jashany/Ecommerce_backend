import express from "express";
import { addAddress,getUserAddresses,updateAddress,removeAddress} from "../Controllers/addresses.js";

const addressRouter = express.Router();

addressRouter.get("/:userId", getUserAddresses);
addressRouter.post("/add", addAddress);
addressRouter.put("/update", updateAddress);
addressRouter.delete("/remove/:addressId", removeAddress);

export default addressRouter;