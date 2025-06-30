import express from "express";
import { getCart, addToCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:id", getCart);
router.post("/create", addToCart);

export default router;
