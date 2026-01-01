import Analytics from "../models/Analytics.js";
import Link from "../models/Link.js";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import mongoose from "mongoose";

export const trackAnalytics = async (link, req) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const ua = parser.getResult();

  let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || null;

  if (ip?.includes("::ffff:")) ip = ip.split(":").pop();
  if (ip === "::1") ip = "127.0.0.1";

  let country = "Unknown";
  let city = "Unknown";

  const isPrivateIP =
    !ip ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.");

  if (isPrivateIP) {
    country = "Local";
    city = "Local";
  } else {
    const geo = geoip.lookup(ip);
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

  return {
    totalClicks: data.length,
    clicksOverTime: getClicksOverTime(data, range),
    referrers: getTrafficSources(data),
    countries: getGeographicData(data),
    devices: getDeviceDistribution(data),
    browsers: getBrowsers(data),
    peakHours: getPeakHours(data),
    link: sanitizeLink(link),
  };
};

export const getGlobalAnalytics = async (userId, range = "30d") => {
  const { startDate, endDate } = getDateRange(range);

  const links = await Link.find({ user: userId });
  const linkIds = links.map((l) => l._id);

  const query = { link: { $in: linkIds } };
  if (range !== "all") query.timestamp = { $gte: startDate, $lte: endDate };

  const analytics = await Analytics.find(query);

  const totalLinks = links.length;
  const totalClicks = links.reduce((s, l) => s + l.clicks, 0);
  const avgClicks = totalLinks ? Math.round(totalClicks / totalLinks) : 0;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const activeLinks = links.filter(
    (l) => l.lastActivity && l.lastActivity > thirtyDaysAgo
  ).length;

  const geographicData = getGeographicData(analytics);
  if (geographicData.length === 0 && totalClicks > 0)
    geographicData.push({ country: "Local", count: totalClicks });

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
    geographicData,
    deviceDistribution: getDeviceDistribution(analytics),
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

  const s = stats[0] || { totalLinks: 0, totalClicks: 0, activeLinks: 0 };
  return {
    ...s,
    avgClicks: s.totalLinks ? Math.round(s.totalClicks / s.totalLinks) : 0,
  };
};

const getDateRange = (range) => {
  const endDate = new Date();
  let startDate = null;

  if (range === "7d") startDate = new Date(endDate - 7 * 86400000);
  if (range === "30d") startDate = new Date(endDate - 30 * 86400000);
  if (range === "90d") startDate = new Date(endDate - 90 * 86400000);

  return { startDate, endDate };
};

const sanitizeLink = (link) => ({
  id: link._id,
  shortCode: link.shortCode,
  shortUrl: link.shortUrl,
  originalUrl: link.originalUrl,
  clicks: link.clicks,
  createdAt: link.createdAt,
  lastAccessed: link.lastAccessed,
});

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

const getTrafficSources = (data) => {
  const sources = {};
  data.forEach((e) => {
    const source = categorizeReferrer(e.referrer);
    sources[source] = (sources[source] || 0) + 1;
  });
  return Object.entries(sources)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

const categorizeReferrer = (r = "") => {
  const s = r.toLowerCase();
  if (!r || r === "Direct") return "Direct";
  if (
    s.includes("facebook") ||
    s.includes("twitter") ||
    s.includes("instagram") ||
    s.includes("linkedin")
  )
    return "Social";
  if (s.includes("mail") || s.includes("gmail") || s.includes("outlook"))
    return "Email";
  if (s.includes("google") || s.includes("bing") || s.includes("yahoo"))
    return "Search";
  return "Other";
};

const getGeographicData = (data) => {
  const countries = {};
  data.forEach((e) => {
    let country = e.country || "Unknown";
    if (country === "Local Network") country = "Local";
    if (!country || country.trim() === "") country = "Unknown";
    countries[country] = (countries[country] || 0) + 1;
  });
  return Object.entries(countries)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};

const getDeviceDistribution = (data) => {
  const devices = {};
  data.forEach((e) => {
    const device = e.deviceType || "Desktop";
    devices[device] = (devices[device] || 0) + 1;
  });
  return Object.entries(devices)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);
};

const getBrowsers = (data) => {
  const browsers = {};
  data.forEach((e) => {
    const browser = e.browser || "Unknown";
    browsers[browser] = (browsers[browser] || 0) + 1;
  });
  return Object.entries(browsers).map(([browser, count]) => ({
    browser,
    count,
  }));
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
