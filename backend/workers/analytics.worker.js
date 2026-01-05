import dotenv from "dotenv";
dotenv.config({ path: "../.env.production" });

import { Worker } from "bullmq";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import Analytics from "../models/Analytics.js";
import Link from "../models/Link.js";
import connectDB from "../lib/db.js";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

(async () => {
  await connectDB();

  const worker = new Worker(
    "analytics",
    async (job) => {
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
