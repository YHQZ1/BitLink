/* eslint-disable no-unused-vars */
import Analytics from "../models/Analytics.js";
import Link from "../models/Link.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

export const getLinkAnalytics = async (
  userId,
  linkId,
  range = "all",
  timeZone = "UTC",
) => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    throw new AppError("The link identifier provided is not valid.", 400);
  }

  const link = await Link.findById(linkId).lean();

  if (!link) {
    throw new AppError("The requested link could not be found.", 404);
  }

  const { startDate, endDate } = getDateRange(range);

  const query = { link: new mongoose.Types.ObjectId(linkId) };

  if (startDate) {
    query.timestamp = { $gte: startDate, $lte: endDate };
  }

  const data = await Analytics.find(query).lean();

  return {
    totalClicks: link.clicks,
    clicksOverTime: getClicksOverTime(data, range, timeZone),
    referrers: getTrafficSources(data),
    countries: getGeographicData(data),
    devices: getDeviceDistribution(data),
    browsers: getBrowsers(data),
    peakHours: getPeakHours(data, timeZone),
    link: sanitizeLink(link),
  };
};

export const getGlobalAnalytics = async (
  userId,
  range = "30d",
  timeZone = "UTC",
) => {
  const { startDate, endDate } = getDateRange(range);

  const links = await Link.find({ user: userId })
    .select("_id clicks lastActivity shortCode originalUrl createdAt")
    .lean();

  const linkIds = links.map((l) => l._id);

  const query = { link: { $in: linkIds } };

  if (range !== "all") {
    query.timestamp = { $gte: startDate, $lte: endDate };
  }

  const analytics = await Analytics.find(query).lean();

  const totalLinks = links.length;

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  const avgClicks = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const activeLinks = links.filter(
    (l) => l.lastActivity && l.lastActivity > thirtyDaysAgo,
  ).length;

  const geographicData = getGeographicData(analytics);

  if (geographicData.length === 0 && totalClicks > 0) {
    geographicData.push({
      country: "Local",
      count: totalClicks,
    });
  }

  return {
    totalLinks,
    totalClicks,
    avgClicks,
    activeLinks,
    topLinks: links
      .slice()
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

  const s = stats[0] || {
    totalLinks: 0,
    totalClicks: 0,
    activeLinks: 0,
  };

  return {
    ...s,
    avgClicks: s.totalLinks > 0 ? Math.round(s.totalClicks / s.totalLinks) : 0,
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

const sanitizeLink = (link) => {
  const baseUrl = process.env.BASE_URL;

  return {
    id: link._id,
    shortCode: link.shortCode,
    shortUrl: `${baseUrl}/r/${link.shortCode}`,
    originalUrl: link.originalUrl,
    clicks: link.clicks,
    createdAt: link.createdAt,
    lastAccessed: link.lastAccessed,
  };
};

const getClicksOverTime = (data, range, timeZone) => {
  const grouped = {};

  data.forEach((e) => {
    const d = new Date(e.timestamp);

    const dateKey =
      range === "7d"
        ? new Intl.DateTimeFormat("en-CA", {
            hour: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour12: false,
            timeZone,
          }).format(d)
        : new Intl.DateTimeFormat("en-CA", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone,
          }).format(d);

    grouped[dateKey] = (grouped[dateKey] || 0) + 1;
  });

  return Object.entries(grouped).map(([date, clicks]) => ({
    date,
    clicks,
  }));
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
  ) {
    return "Social";
  }

  if (s.includes("mail") || s.includes("gmail") || s.includes("outlook")) {
    return "Email";
  }

  if (s.includes("google") || s.includes("bing") || s.includes("yahoo")) {
    return "Search";
  }

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

const getPeakHours = (data, timeZone) => {
  const hours = {};

  data.forEach((e) => {
    const d = new Date(e.timestamp);

    const hour = Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone,
      }).format(d),
    );

    hours[hour] = (hours[hour] || 0) + 1;
  });

  return Object.entries(hours)
    .map(([hour, clicks]) => ({
      hour: Number(hour),
      clicks,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
};
