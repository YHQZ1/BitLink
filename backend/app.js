import express from "express";
import cors from "cors";
import os from "os";
import { httpRequestDuration, httpRequestCount } from "./lib/metrics.js";

import authRoutes from "./routes/auth.routes.js";
import linkRoutes from "./routes/link.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import userRoutes from "./routes/user.routes.js";
// import { redirectToOriginal } from "./controllers/link.controller.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", true);

  const allowedOrigins = new Set([
    "http://localhost:5173",
    "https://bitlk.in",
    "https://www.bitlk.in",
  ]);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.has(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = process.hrtime();

    res.on("finish", () => {
      const [sec, nano] = process.hrtime(start);
      const duration = sec + nano / 1e9;

      const route = req.route?.path || req.path || "unknown";

      httpRequestDuration.observe(
        {
          method: req.method,
          route,
          status: res.statusCode,
        },
        duration,
      );

      httpRequestCount.inc({
        method: req.method,
        route,
        status: res.statusCode,
      });
    });

    next();
  });

  app.get("/", (req, res) => {
    res.status(200).json({
      service: "BitLink API",
      status: "running",
    });
  });

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/_debug/instance", (req, res) => {
    res.json({
      hostname: os.hostname(),
      pid: process.pid,
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/links", linkRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/user", userRoutes);

  // app.get("/r/:code", redirectToOriginal);

  app.use("/", linkRoutes);

  app.use((err, req, res) => {
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}
