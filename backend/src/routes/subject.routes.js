import express from "express";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../controllers/subject.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getSubjects);
router.post("/", protect, createSubject);
router.put("/:id", protect, updateSubject);
router.delete("/:id", protect, deleteSubject);

export default router;