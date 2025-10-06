// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { redirectToOriginal } from "./controllers/linkController.js";

dotenv.config();

const app = express();

// CLIENT_URL = process.env.PROD_URL || "http://localhost:5173";

// Middleware
app.use(express.json());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/user", userRoutes);

app.get("/:code", redirectToOriginal);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "BitLink API is working!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
