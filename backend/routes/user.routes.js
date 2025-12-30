import express from "express";
import protect from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile", protect, getCurrentUser);

export default router;
