import express from "express";
import {
  signup,
  login,
  githubLogin,
  githubCallback,
  googleLogin,
  googleCallback,
} from "../controllers/authController.js";

const router = express.Router();

/* ---------------- LOCAL AUTH ---------------- */
router.post("/signup", signup);
router.post("/login", login);

/* ---------------- GITHUB OAUTH ---------------- */
router.get("/github", githubLogin);
router.get("/github/callback", githubCallback);

/* ---------------- GOOGLE OAUTH ---------------- */
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);

export default router;
