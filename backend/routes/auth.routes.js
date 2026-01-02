import { Router } from "express";
import {
  signup,
  login,
  githubLogin,
  githubCallback,
  googleLogin,
  googleCallback,
} from "../controllers/auth.controller.js";
import { authRateLimit } from "../middleware/authRateLimit.middleware.js";

const router = Router();

router.post("/signup", authRateLimit({ windowSec: 60, max: 3 }), signup);
router.post("/login", authRateLimit({ windowSec: 60, max: 5 }), login);

router.get("/github", githubLogin);
router.get(
  "/github/callback",
  authRateLimit({ windowSec: 60, max: 20 }),
  githubCallback
);

router.get("/google", googleLogin);
router.get(
  "/google/callback",
  authRateLimit({ windowSec: 60, max: 20 }),
  googleCallback
);

export default router;
