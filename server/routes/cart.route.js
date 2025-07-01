import express from "express";
import {
  getCart,
  addToCart,
  deleteCartItem,
  updateCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:id", getCart);
router.post("/create", addToCart);
router.delete("/delete/:id", deleteCartItem);
router.put("/update/:id", updateCart);

export default router;
