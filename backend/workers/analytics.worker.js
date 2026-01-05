import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.resolve(__dirname, "../.env.development"),
  });
}

if (process.env.NODE_ENV === "test") {
  console.log("Worker disabled in test environment");
  process.exit(0);
}

import { Worker } from "bullmq";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import Analytics from "../models/Analytics.js";
import Link from "../models/Link.js";
import connectDB from "../lib/db.js";
import http from "http";
import { register } from "../lib/metrics.js";
import client from "prom-client";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
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
        const { linkId, ip, userAgent, referrer } = job.data;

        const link = await Link.findById(linkId);
        if (!link) return;

        const parser = new UAParser(userAgent || "");
        const ua = parser.getResult();

        let cleanIp = ip;
        if (cleanIp?.includes("::ffff:")) cleanIp = cleanIp.split(":").pop();
        if (cleanIp === "::1") cleanIp = "127.0.0.1";

        let country = "Unknown";
        let city = "Unknown";

        const isPrivateIP =
          !cleanIp ||
          cleanIp === "127.0.0.1" ||
          cleanIp.startsWith("192.168.") ||
          cleanIp.startsWith("10.");

        if (isPrivateIP) {
          country = "Local";
          city = "Local";
        } else {
          const geo = geoip.lookup(cleanIp);
          if (geo && geo.country) {
            country = geo.country;
            city = geo.city || "Unknown";
          }
        }

        const deviceType =
          ua.device.type === "mobile"
            ? "Mobile"
            : ua.device.type === "tablet"
            ? "Tablet"
            : "Desktop";

        await Analytics.create({
          link: link._id,
          ipAddress: cleanIp,
          userAgent,
          referrer,
          country,
          city,
          deviceType,
          browser: ua.browser.name || "Unknown",
          operatingSystem: ua.os.name || "Unknown",
        });

        analyticsJobsProcessed.inc({ status: "success" });
      } catch (err) {
        analyticsJobsProcessed.inc({ status: "failed" });
        throw err;
      } finally {
        const [sec, nano] = process.hrtime(start);
        const duration = sec + nano / 1e9;
        analyticsJobDuration.observe(duration);
      }
    },
    {
      connection: { url: process.env.REDIS_URL },
      concurrency: 5,
    }
  );

  worker.on("completed", (job) => {
    console.log(`Analytics job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Analytics job ${job?.id} failed`, err);
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
    console.log(`Worker metrics running on :${METRICS_PORT}`);
  });
