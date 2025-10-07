// src/routes/authRoutes.js
import express from "express";
import { signup, login, githubLogin, githubCallback } from "../controllers/authController.js";

const router = express.Router();

// Local authentication
router.post("/signup", signup);
router.post("/login", login);

// GitHub OAuth authentication
router.get("/github", githubLogin);              
router.get("/github/callback", githubCallback); 

export default router;
