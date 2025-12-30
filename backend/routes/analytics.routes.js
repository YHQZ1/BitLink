import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getLinkAnalyticsController,
  getGlobalAnalyticsController,
  getUserStatsController,
} from "../controllers/analytics.controller.js";

const router = Router();

router.use(protect);

router.get("/stats", getUserStatsController);
router.get("/global", getGlobalAnalyticsController);
router.get("/link/:id", getLinkAnalyticsController);

export default router;
