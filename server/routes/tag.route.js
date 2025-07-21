import express from "express";
import { showTags, createTag, editTag } from "../controllers/tag.controller.js";

const router = express.Router();

router.get("/tags", showTags);
router.get("/tags/:id", showTags); // Supports both all tags and single tag
router.post("/tags", createTag);
router.put("/tags/:id", editTag);

export default router;
