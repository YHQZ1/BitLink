import { Router } from "express";
import {
  signup,
  login,
  githubLogin,
  githubCallback,
  googleLogin,
  googleCallback,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

router.get("/health", healthCheck);

export default router;
