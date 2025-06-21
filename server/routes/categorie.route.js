import express from "express";
import {
  getCategories,
  createCategories,
  updateCategories,
  deleteCategories,
} from "../controllers/categorie.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/create", createCategories);
router.put("/update/:id", updateCategories);
router.delete("/delete/:id", deleteCategories);

export default router;
