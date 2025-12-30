import Analytics from "../models/Analytics.js";
import Link from "../models/Link.js";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import mongoose from "mongoose";

export const trackAnalytics = async (link, req) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const ua = parser.getResult();

  let ip =
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    null;

  if (ip?.includes("::ffff:")) ip = ip.split(":").pop();

  let country = "Unknown";
  let city = "Unknown";

  const isLocal =
    !ip ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.") ||
    ip.startsWith("fc00:") ||
    ip.startsWith("fe80:");

  if (isLocal) {
    country = "Local Network";
    city = "Local";
  } else {
    const geo = geoip.lookup(ip);
    if (geo) {
      country = geo.country || "Unknown";
      city = geo.city || "Unknown";
    }
  }

  const deviceType =
    ua.device.type === "mobile"
      ? "Mobile"
      : ua.device.type === "tablet"
      ? "Tablet"
      : "Desktop";

  const referrer = req.get("Referer") || "Direct";

  await Analytics.create({
    link: link._id,
    ipAddress: ip,
    userAgent: req.headers["user-agent"],
    referrer,
    country,
    city,
    deviceType,
    browser: ua.browser.name || "Unknown",
    operatingSystem: ua.os.name || "Unknown",
  });
};

export const getLinkAnalytics = async (userId, linkId, range = "all") => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) throw new Error();

  const link = await Link.findOne({ _id: linkId, user: userId });
  if (!link) throw new Error();

  const { startDate, endDate } = getDateRange(range);

  const query = { link: linkId };
  if (startDate) query.timestamp = { $gte: startDate, $lte: endDate };

  const data = await Analytics.find(query);

  return processAnalyticsData(data, link, range);
};

export const getGlobalAnalytics = async (userId, range = "30d") => {
  const { startDate, endDate } = getDateRange(range);

  const links = await Link.find({ user: userId });
  const linkIds = links.map((l) => l._id);

  const analytics = await Analytics.find({
    link: { $in: linkIds },
    timestamp: { $gte: startDate, $lte: endDate },
  });

  const totalLinks = links.length;
  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const avgClicks = totalLinks ? Math.round(totalClicks / totalLinks) : 0;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const activeLinks = links.filter(
    (l) => l.lastActivity && l.lastActivity > thirtyDaysAgo
  ).length;

  return {
    totalLinks,
    totalClicks,
    avgClicks,
    activeLinks,
    topLinks: links
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(sanitizeLink),
    trafficSources: getTrafficSources(analytics),
    geographicData: getGeographicData(analytics),
    deviceDistribution: getDeviceDistribution(analytics),
    growthData: getGrowthData(analytics, range),
  };
};

export const getUserStats = async (userId) => {
  const stats = await Link.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalLinks: { $sum: 1 },
        totalClicks: { $sum: "$clicks" },
        activeLinks: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$lastActivity", null] },
                  {
                    $gte: [
                      "$lastActivity",
                      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  const s = stats[0] || {
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
  };

  return {
    ...s,
    avgClicks: s.totalLinks ? Math.round(s.totalClicks / s.totalLinks) : 0,
  };
};

/* ---------- helpers ---------- */

const getDateRange = (range) => {
  const endDate = new Date();
  let startDate = null;

  if (range === "7d") startDate = new Date(endDate - 7 * 86400000);
  if (range === "30d") startDate = new Date(endDate - 30 * 86400000);
  if (range === "90d") startDate = new Date(endDate - 90 * 86400000);

  return { startDate, endDate };
};

const processAnalyticsData = (data, link, range) => ({
  totalClicks: data.length,
  clicksOverTime: getClicksOverTime(data, range),
  referrers: getReferrers(data),
  countries: getCountries(data),
  devices: getDevices(data),
  browsers: getBrowsers(data),
  peakHours: getPeakHours(data),
  link: sanitizeLink(link),
});

const sanitizeLink = (link) => ({
  id: link._id,
  shortCode: link.shortCode,
  shortUrl: link.shortUrl,
  originalUrl: link.originalUrl,
  clicks: link.clicks,
  createdAt: link.createdAt,
  lastAccessed: link.lastAccessed,
});

/* ---------- analytics helpers ---------- */

const getClicksOverTime = (data, range) => {
  const grouped = {};
  data.forEach((e) => {
    const d = new Date(e.timestamp);
    const key =
      range === "7d"
        ? d.toISOString().slice(0, 13) + ":00"
        : d.toISOString().split("T")[0];
    grouped[key] = (grouped[key] || 0) + 1;
  });
  return Object.entries(grouped).map(([date, clicks]) => ({ date, clicks }));
};

const getReferrers = (data) => {
  const m = {};
  data.forEach((e) => {
    const r = categorizeReferrer(e.referrer);
    m[r] = (m[r] || 0) + 1;
  });
  return Object.entries(m).map(([source, count]) => ({ source, count }));
};

const categorizeReferrer = (r = "") => {
  const s = r.toLowerCase();
  if (!r || r === "Direct") return "Direct";
  if (s.includes("facebook") || s.includes("twitter")) return "Social";
  if (s.includes("mail")) return "Email";
  if (s.includes("google") || s.includes("bing")) return "Search";
  return "Other";
};

const getCountries = (data) => countBy(data, "country");
const getDevices = (data) => countBy(data, "deviceType");
const getBrowsers = (data) => countBy(data, "browser");

const countBy = (data, key) => {
  const m = {};
  data.forEach((e) => {
    const v = e[key] || "Unknown";
    m[v] = (m[v] || 0) + 1;
  });
  return Object.entries(m).map(([k, c]) => ({ [key]: k, count: c }));
};

const getPeakHours = (data) => {
  const h = {};
  data.forEach((e) => {
    const d = new Date(e.timestamp);
    const hour = d.getUTCHours();
    h[hour] = (h[hour] || 0) + 1;
  });
  return Object.entries(h).map(([hour, clicks]) => ({ hour, clicks }));
};

const getTrafficSources = (data) => getReferrers(data);
const getGeographicData = (data) => getCountries(data);
const getDeviceDistribution = (data) => getDevices(data);
const getGrowthData = (data) => getClicksOverTime(data);
