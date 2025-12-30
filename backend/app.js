import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { redirectToOriginal } from "./controllers/linkController.js";

export function createApp() {
  const app = express();

  const allowedOrigins = ["https://btlink.vercel.app", "http://localhost:5173"];

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/links", linkRoutes);
  app.use("/api/user", userRoutes);

  app.get("/", (_, res) => {
    res.json({ message: "BitLink API is working!" });
  });

  app.get("/:code", redirectToOriginal);

  return app;
}
