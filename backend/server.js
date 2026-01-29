import dotenv from "dotenv";
import { createApp } from "./app.js";
import connectDB from "./lib/db.js";
import http from "http";
import { register } from "./lib/metrics.js";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

if (!process.env.BASE_URL || !process.env.CLIENT_URL) {
  throw new Error("Missing required environment variables");
}

async function startServer() {
  await connectDB();

  const app = createApp();
  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  const METRICS_PORT = 9100;

  http
    .createServer(async (req, res) => {
      if (req.url === "/metrics") {
        res.setHeader("Content-Type", register.contentType);
        res.end(await register.metrics());
        return;
      }

      res.statusCode = 404;
      res.end();
    })
    .listen(METRICS_PORT, () => {
      console.log(`Metrics server running on port ${METRICS_PORT}`);
    });
}

startServer()
  .then(async () => {
    if (process.env.NODE_ENV === "production") {
      try {
        await import("./workers/analytics.worker.js");
        console.log("Analytics worker started (same service)");
      } catch (err) {
        console.error("Failed to start analytics worker", err);
      }
    }
  })
  .catch((err) => {
    console.error("Server startup failed", err);
    process.exit(1);
  });
