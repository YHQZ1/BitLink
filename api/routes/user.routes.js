import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  updateUserProfile,
  deleteAccount,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getCurrentUser);
router.put("/", updateUserProfile);
router.delete("/", deleteAccount);

export default router;
