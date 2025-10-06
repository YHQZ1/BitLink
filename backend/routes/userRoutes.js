// src/routes/userRoutes.js
import express from "express";
import { getCurrentUser, updateUserProfile } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected with auth middleware
router.get("/profile", protect, getCurrentUser);
router.put("/profile", protect, updateUserProfile);

export default router;