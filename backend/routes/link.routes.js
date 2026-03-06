import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createLink,
  createGuestLinkController,
  getLinks,
  updateLink,
  deleteLink,
  migrateGuestLinksController,
  redirectToOriginal,
} from "../controllers/link.controller.js";
import { rateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

// Guest link creation
router.post(
  "/guest/shorten",
  rateLimit({
    keyPrefix: "rl:guest",
    limit: 5,
    windowSec: 60,
    keyGenerator: (req) => req.body.sessionId || req.ip,
  }),
  createGuestLinkController,
);

// Redirect endpoint
router.get(
  "/r/:code",
  rateLimit({
    keyPrefix: "rl:redirect",
    limit: 1000,
    windowSec: 60,
    keyGenerator: (req) =>
      req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip,
  }),
  redirectToOriginal,
);

// Protected routes
router.use(protect);

router.post(
  "/shorten",
  rateLimit({
    keyPrefix: "rl:user",
    limit: 30,
    windowSec: 60,
    keyGenerator: (req) => req.user.id,
  }),
  createLink,
);

router.get("/me", getLinks);

router.put(
  "/:id",
  rateLimit({
    keyPrefix: "rl:user",
    limit: 30,
    windowSec: 60,
    keyGenerator: (req) => req.user.id,
  }),
  updateLink,
);

router.delete(
  "/:id",
  rateLimit({
    keyPrefix: "rl:user",
    limit: 30,
    windowSec: 60,
    keyGenerator: (req) => req.user.id,
  }),
  deleteLink,
);

router.post("/migrate", migrateGuestLinksController);

export default router;
