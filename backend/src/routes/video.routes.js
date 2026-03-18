import express from "express";
import { getVideos, createVideo, updateVideo, deleteVideo } from "../controllers/video.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getVideos);
router.post("/", protect, createVideo);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

export default router;