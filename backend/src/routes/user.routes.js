import express from "express";
import { getUserProfile, updateUser, deleteUser } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { validate, validateUpdateUser } from "../middleware/validate.middleware.js";

const router = express.Router();

router.get("/", protect, getUserProfile);
router.put("/:id", protect, upload.single("image"), validateUpdateUser, validate, updateUser);
router.delete("/:id", protect, deleteUser);

export default router;