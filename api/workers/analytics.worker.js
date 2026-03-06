import "../lib/env.js";

import { Worker } from "bullmq";
import { UAParser } from "ua-parser-js";
import Analytics from "../models/Analytics.js";
import connectDB from "../lib/db.js";
import redis from "../lib/redis.js";
import http from "http";
import { register } from "../lib/metrics.js";
import client from "prom-client";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MongoDB connection string is missing. Please set the MONGODB_URI environment variable.",
  );
}

if (!process.env.REDIS_URL) {
  throw new Error(
    "Redis connection string is missing. Please set the REDIS_URL environment variable.",
  );
}

export const analyticsJobsProcessed = new client.Counter({
  name: "bitlink_analytics_jobs_processed_total",
  help: "Total analytics jobs processed",
  labelNames: ["status"],
});

export const analyticsJobDuration = new client.Histogram({
  name: "bitlink_analytics_job_duration_seconds",
  help: "Analytics job processing duration",
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
(async () => {
  await connectDB();

  const worker = new Worker(
    "analytics",
    async (job) => {
      const start = process.hrtime();

      try {
        if (job.name !== "track_click_batch") {
          console.warn(
            `Analytics worker received an unknown job type: ${job.name}`,
          );
          return;
        }

        const events = job.data;

        if (!events || events.length === 0) {
          console.warn("Analytics worker received an empty batch");
          return;
        }

        const docs = events.map((e) => {
          const ua = new UAParser(e.userAgent || "").getResult();

          return {
            link: e.linkId,
            ipAddress: e.ip,
            userAgent: e.userAgent,
            referrer: e.referrer,
            country: "Unknown",
            city: "Unknown",
            deviceType:
              ua.device.type === "mobile"
                ? "Mobile"
                : ua.device.type === "tablet"
                  ? "Tablet"
                  : "Desktop",
            browser: ua.browser.name || "Unknown",
            operatingSystem: ua.os.name || "Unknown",
            timestamp: new Date(e.timestamp),
          };
        });

        await Analytics.insertMany(docs, { ordered: false });

        analyticsJobsProcessed.inc({ status: "success" }, docs.length);
      } catch (err) {
        analyticsJobsProcessed.inc({ status: "failed" });

        console.error(
          "Analytics worker failed while processing a batch:",
          err.message,
        );

        throw err;
      } finally {
        const [sec, nano] = process.hrtime(start);
        const duration = sec + nano / 1e9;

        analyticsJobDuration.observe(duration);
      }
    },
    {
      connection: redis,
      concurrency: 10,
    },
  );

  worker.on("failed", (job, err) => {
    console.error(
      `Analytics worker job ${job?.id} failed after retry attempts:`,
      err.message,
    );
  });
})();

const METRICS_PORT = 9101;

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
    console.log(
      `Analytics worker metrics server running on port ${METRICS_PORT}`,
    );
  });
