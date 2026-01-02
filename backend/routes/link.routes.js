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

router.post(
  "/guest/shorten",
  rateLimit({
    keyPrefix: "rl:guest",
    limit: 5,
    windowSec: 60,
    keyGenerator: (req) => req.body.sessionId,
  }),
  createGuestLinkController
);

router.get(
  "/r/:code",
  rateLimit({
    keyPrefix: "rl:redirect",
    limit: 1000,
    windowSec: 60,
    keyGenerator: (req) => req.ip,
  }),
  redirectToOriginal
);

router.use(protect);

router.post(
  "/shorten",
  rateLimit({
    keyPrefix: "rl:user",
    limit: 30,
    windowSec: 60,
    keyGenerator: (req) => req.user.id,
  }),
  createLink
);

router.get("/me", getLinks);
router.put("/:id", updateLink);
router.delete("/:id", deleteLink);
router.post("/migrate", migrateGuestLinksController);

export default router;
