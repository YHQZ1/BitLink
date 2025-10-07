import express from "express";
import { 
  createLink, 
  redirectToOriginal, 
  getUserLinks, 
  deleteLink,
  updateLink,
  getLinkAnalytics,
  getUserStats,
  getGlobalAnalytics,
  createGuestLink, 
} from "../controllers/linkController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (require JWT)
router.post("/shorten", protect, createLink);
router.get("/user", protect, getUserLinks);
router.get("/analytics/:id", protect, getLinkAnalytics);
router.get("/global-analytics", protect, getGlobalAnalytics);
router.put("/:id", protect, updateLink);
router.delete("/:id", protect, deleteLink);
router.get("/stats", protect, getUserStats);

// ADD THESE NEW ROUTES:
router.post("/guest/shorten", createGuestLink); // Public route for guest shortening

// Public redirect route
router.get("/:code", redirectToOriginal);

export default router;