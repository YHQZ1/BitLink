import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getCurrentUser);

export default router;
