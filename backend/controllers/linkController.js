import Link from "../models/Link.js";
import Analytics from "../models/Analytics.js";
import QRCode from "qrcode";
import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";
import mongoose from "mongoose";

// Create a new short link with optional custom alias
export const createLink = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    if (!originalUrl)
      return res.status(400).json({ error: "Original URL is required" });

    const userId = req.user.userId;
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    // Check if custom alias is provided and unique
    if (customAlias) {
      const existingLink = await Link.findOne({ shortCode: customAlias });
      if (existingLink) {
        return res.status(400).json({ error: "Custom alias already taken" });
      }
    }

    const link = new Link({
      originalUrl,
      shortCode: customAlias || undefined,
      user: userId,
    });

    // Generate QR code for the short URL
    const qrCode = await QRCode.toDataURL(`${baseUrl}/${link.shortCode}`);
    link.qrCode = qrCode;

    await link.save();

    res.status(201).json({
      message: "Short link created successfully",
      link,
    });
  } catch (error) {
    console.error("Error creating link:", error);
    res.status(500).json({ error: error.message });
  }
};

// Redirect to original URL with analytics tracking
export const redirectToOriginal = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOne({ shortCode: code });
    if (!link) return res.status(404).json({ error: "Link not found" });

    // Check expiry
    if (link.expiresAt && link.expiresAt < new Date()) {
      link.isActive = false;
      await link.save();
      return res.status(410).json({ error: "Link has expired" });
    }

    // Track analytics
    await trackAnalytics(link, req);

    // Update click count, last accessed, and last activity
    link.clicks += 1;
    link.lastAccessed = new Date();
    link.lastActivity = new Date(); // Track last activity
    link.isActive = true; // Mark as active
    await link.save();

    return res.redirect(link.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to track analytics
const trackAnalytics = async (link, req) => {
  try {
    const parser = new UAParser(req.headers["user-agent"]);
    const uaResult = parser.getResult();

    // Determine device type
    let deviceType = "Desktop";
    if (uaResult.device.type === "mobile") deviceType = "Mobile";
    if (uaResult.device.type === "tablet") deviceType = "Tablet";

    // Get referrer
    const referrer = req.get("Referer") || req.get("Referrer") || "Direct";

    // Get IP address and country
    let ipAddress =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    // Handle IPv6 format (::ffff:127.0.0.1 -> 127.0.0.1)
    if (ipAddress && ipAddress.includes("::ffff:")) {
      ipAddress = ipAddress.split(":").pop();
    }

    // Get country from IP
    let country = "Unknown";
    let city = "Unknown";

    if (ipAddress && ipAddress !== "::1" && ipAddress !== "127.0.0.1") {
      const geo = geoip.lookup(ipAddress);
      if (geo) {
        country = geo.country || "Unknown";
        city = geo.city || "Unknown";
      }
    } else {
      // For localhost, you might want to set a default or test value
      country = "Localhost";
      city = "Local";
    }

    const analytics = new Analytics({
      link: link._id,
      ipAddress,
      userAgent: req.headers["user-agent"],
      referrer: referrer,
      country: country,
      city: city,
      deviceType,
      browser: uaResult.browser.name || "Unknown",
      operatingSystem: uaResult.os.name || "Unknown",
    });

    await analytics.save();
    console.log(`📊 Analytics tracked: ${country}, ${deviceType}, ${referrer}`);
  } catch (error) {
    console.error("Error tracking analytics:", error);
    // Don't throw error - we don't want to break the redirect
  }
};

// Get analytics for a specific link
export const getLinkAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { range = "all" } = req.query;
    const userId = req.user.userId;

    // Verify the link belongs to the user
    const link = await Link.findOne({ _id: id, user: userId });
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Calculate date range
    let startDate;
    const endDate = new Date();

    switch (range) {
      case "7d":
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Build query
    const query = { link: id };
    if (range !== "all") {
      query.timestamp = { $gte: startDate, $lte: endDate };
    }

    // Get analytics data
    const analyticsData = await Analytics.find(query);

    // Process data for frontend
    const processedData = processAnalyticsData(analyticsData, link, range);

    res.json(processedData);
  } catch (error) {
    console.error("Error fetching link analytics:", error);
    res.status(500).json({ error: error.message });
  }
};

// Process analytics data for frontend
const processAnalyticsData = (analyticsData, link, range) => {
  const totalClicks = analyticsData.length;

  // Clicks over time
  const clicksOverTime = getClicksOverTime(analyticsData, range);

  // Referrers
  const referrers = getReferrers(analyticsData);

  // Countries
  const countries = getCountries(analyticsData);

  // Devices
  const devices = getDevices(analyticsData);

  // Browsers
  const browsers = getBrowsers(analyticsData);

  // Peak hours
  const peakHours = getPeakHours(analyticsData);

  return {
    totalClicks,
    clicksOverTime,
    referrers,
    countries,
    devices,
    browsers,
    peakHours,
    link: {
      _id: link._id,
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      shortCode: link.shortCode,
      clicks: link.clicks,
      createdAt: link.createdAt,
      lastAccessed: link.lastAccessed,
    },
  };
};

// Helper functions to process analytics data
const getClicksOverTime = (data, range) => {
  const format = range === "7d" ? "hour" : "date";
  const grouped = {};

  data.forEach((entry) => {
    const date = new Date(entry.timestamp);
    let key;

    if (format === "hour") {
      key = date.toISOString().slice(0, 13) + ":00"; // Group by hour
    } else {
      key = date.toISOString().split("T")[0]; // Group by date
    }

    grouped[key] = (grouped[key] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([date, clicks]) => ({
      date,
      clicks,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const getReferrers = (data) => {
  const referrers = {};
  data.forEach((entry) => {
    const source = categorizeReferrer(entry.referrer);
    referrers[source] = (referrers[source] || 0) + 1;
  });

  return Object.entries(referrers)
    .map(([source, count]) => ({
      source,
      count,
    }))
    .sort((a, b) => b.count - a.count);
};

const categorizeReferrer = (referrer) => {
  if (!referrer || referrer === "Direct") return "Direct";

  const lowerReferrer = referrer.toLowerCase();
  if (
    lowerReferrer.includes("facebook") ||
    lowerReferrer.includes("twitter") ||
    lowerReferrer.includes("instagram") ||
    lowerReferrer.includes("linkedin")
  ) {
    return "Social Media";
  }
  if (lowerReferrer.includes("mail") || lowerReferrer.includes("email")) {
    return "Email";
  }
  if (
    lowerReferrer.includes("google") ||
    lowerReferrer.includes("bing") ||
    lowerReferrer.includes("yahoo") ||
    lowerReferrer.includes("duckduckgo")
  ) {
    return "Search";
  }

  return "Other";
};

const getCountries = (data) => {
  const countries = {};
  data.forEach((entry) => {
    const country = entry.country || "Unknown";
    countries[country] = (countries[country] || 0) + 1;
  });

  return Object.entries(countries)
    .map(([country, count]) => ({
      country,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 countries
};

const getDevices = (data) => {
  const devices = {};
  data.forEach((entry) => {
    const device = entry.deviceType || "Unknown";
    devices[device] = (devices[device] || 0) + 1;
  });

  return Object.entries(devices)
    .map(([device, count]) => ({
      device,
      count,
    }))
    .sort((a, b) => b.count - a.count);
};

const getBrowsers = (data) => {
  const browsers = {};
  data.forEach((entry) => {
    const browser = entry.browser || "Unknown";
    browsers[browser] = (browsers[browser] || 0) + 1;
  });

  return Object.entries(browsers)
    .map(([browser, count]) => ({
      browser,
      count,
    }))
    .sort((a, b) => b.count - a.count);
};

const getPeakHours = (data) => {
  const hours = {};
  data.forEach((entry) => {
    const hour = new Date(entry.timestamp).getHours();
    const hourStr = `${hour.toString().padStart(2, "0")}:00`;
    hours[hourStr] = (hours[hourStr] || 0) + 1;
  });

  return Object.entries(hours)
    .map(([hour, clicks]) => ({ hour, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5); // Top 5 hours
};

// Update a link
export const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { originalUrl, customAlias } = req.body;
    const userId = req.user.userId;

    const link = await Link.findOne({ _id: id, user: userId });
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    // Update original URL if provided
    if (originalUrl) {
      link.originalUrl = originalUrl;
    }

    // Update custom alias if provided
    if (customAlias && customAlias !== link.shortCode) {
      // Check if new alias is unique
      const existingLink = await Link.findOne({
        shortCode: customAlias,
        _id: { $ne: id },
      });
      if (existingLink) {
        return res.status(400).json({ error: "Custom alias already taken" });
      }
      link.shortCode = customAlias;

      // Regenerate shortUrl and QR code
      const baseUrl = process.env.BASE_URL || "http://localhost:3000";
      link.shortUrl = `${baseUrl}/${customAlias}`;
      link.qrCode = await QRCode.toDataURL(`${baseUrl}/${customAlias}`);
    }

    await link.save();

    res.json({
      message: "Link updated successfully",
      link,
    });
  } catch (error) {
    console.error("Error updating link:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all links for a user
export const getUserLinks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const links = await Link.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: links.length,
      links,
    });
  } catch (error) {
    console.error("Error fetching user links:", error);
    res.status(500).json({ error: error.message });
  }
};

//Delete a link
export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const link = await Link.findOne({ _id: id, user: userId });
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    await Link.findByIdAndDelete(id);
    res.status(200).json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Calculate active links (links with activity in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

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
                    { $gte: ["$lastActivity", thirtyDaysAgo] },
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

    const defaultStats = {
      totalLinks: 0,
      totalClicks: 0,
      activeLinks: 0,
      avgClicks: 0,
    };

    const resultStats = stats[0] || defaultStats;

    // Calculate average clicks
    resultStats.avgClicks =
      resultStats.totalLinks > 0
        ? Math.round(resultStats.totalClicks / resultStats.totalLinks)
        : 0;

    res.json(resultStats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: error.message });
  }
};
