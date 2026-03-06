import { Router } from "express";
import protect from "../middlewares/auth.middleware.js";
import { rateLimit } from "../middlewares/rateLimit.middleware.js";
import {
  getLinkAnalyticsController,
  getGlobalAnalyticsController,
  getUserStatsController,
} from "../controllers/analytics.controller.js";

const router = Router();

router.use(protect);

const userLimiter = rateLimit({
  keyPrefix: "rl:user",
  limit: 60,
  windowSec: 60,
  keyGenerator: (req) => req.user.id,
});

router.get("/stats", userLimiter, getUserStatsController);
router.get("/global", userLimiter, getGlobalAnalyticsController);
router.get("/link/:id", userLimiter, getLinkAnalyticsController);

export default router;
