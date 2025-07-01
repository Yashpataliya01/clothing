import express from "express";
import {
  createHeader,
  getHeader,
  updateHeader,
  deleteHeader,
} from "../controllers/header.controller.js";

const router = express.Router();

router.get("/", getHeader);
router.post("/create", createHeader);
router.put("/:id", updateHeader);
router.delete("/:id", deleteHeader);

export default router;
