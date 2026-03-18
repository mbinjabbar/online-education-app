import express from "express";
import { login, signup } from "../controllers/auth.controller.js";
import upload from "../middleware/upload.middleware.js";
import { validate, validateLogin, validateSignup } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post('/login', validateLogin, validate, login);
router.post('/signup', upload.single("image"), validateSignup, validate, signup);

export default router;