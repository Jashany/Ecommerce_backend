import express from "express";
import { applyOffer,getAllOffers,addOffer,getOfferById} from "../Controllers/offers.js";

const offerRouter = express.Router();

offerRouter.get("/", getAllOffers);
offerRouter.get("/:offerId", getOfferById);
offerRouter.post("/add", addOffer);
offerRouter.post("/apply", applyOffer);


export default offerRouter;