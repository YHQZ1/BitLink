import { Router } from "express";
import {
  signup,
  login,
  githubLogin,
  githubCallback,
  googleLogin,
  googleCallback,
} from "../controllers/auth.controller.js";
import { authRateLimit } from "../middlewares/authRateLimit.middleware.js";

const router = Router();

// Local authentication
router.post("/signup", authRateLimit({ windowSec: 60, max: 5 }), signup);
router.post("/login", authRateLimit({ windowSec: 60, max: 5 }), login);

// OAuth entry points
router.get("/github", authRateLimit({ windowSec: 60, max: 20 }), githubLogin);

router.get(
  "/github/callback",
  authRateLimit({ windowSec: 60, max: 20 }),
  githubCallback,
);

router.get("/google", authRateLimit({ windowSec: 60, max: 20 }), googleLogin);

router.get(
  "/google/callback",
  authRateLimit({ windowSec: 60, max: 20 }),
  googleCallback,
);

export default router;
