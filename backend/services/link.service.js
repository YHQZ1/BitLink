import Link from "../models/Link.js";
import QRCode from "qrcode";
import mongoose from "mongoose";
import { isValidUrl } from "../utils/validateUrl.js";
import redis from "../lib/redis.js";
import { enqueueTrackAnalytics } from "../queues/analytics.queue.js";

const REDIRECT_CACHE_TTL = 60 * 60 * 24;

export const createUserLink = async (userId, data) => {
  const { originalUrl, customAlias } = data;

  if (!originalUrl || !isValidUrl(originalUrl)) {
    throw new Error("Invalid URL");
  }

  if (customAlias) {
    const exists = await Link.findOne({ shortCode: customAlias });
    if (exists) throw new Error();
  }

  const link = new Link({
    originalUrl,
    shortCode: customAlias || undefined,
    user: userId,
  });

  const baseUrl = process.env.BASE_URL;
  link.qrCode = await QRCode.toDataURL(`${baseUrl}/r/${link.shortCode}`);

  await link.save();
  return sanitizeLink(link);
};

export const createGuestLink = async (data) => {
  const { originalUrl, customAlias, sessionId } = data;

  if (!originalUrl) {
    throw new Error("NO_URL");
  }

  if (!isValidUrl(originalUrl)) {
    throw new Error("INVALID_URL");
  }

  if (!sessionId) {
    throw new Error("INVALID_SESSION");
  }

  const existing = await Link.countDocuments({ sessionId, user: null });
  if (existing >= 1) {
    throw new Error("GUEST_LIMIT");
  }

  if (customAlias) {
    const exists = await Link.findOne({ shortCode: customAlias });
    if (exists) {
      throw new Error("ALIAS_TAKEN");
    }
  }

  const link = new Link({
    originalUrl,
    shortCode: customAlias || undefined,
    sessionId,
    user: null,
    isGuestLink: true,
  });

  const baseUrl = process.env.BASE_URL;
  link.qrCode = await QRCode.toDataURL(`${baseUrl}/r/${link.shortCode}`);

  await link.save();
  return sanitizeLink(link);
};

export const getUserLinks = async (userId) => {
  const links = await Link.find({ user: userId }).sort({ createdAt: -1 });
  return links.map(sanitizeLink);
};

export const updateUserLink = async (userId, linkId, data) => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) throw new Error();

  const link = await Link.findOne({ _id: linkId, user: userId });
  if (!link) throw new Error();

  const { originalUrl, customAlias } = data;

  if (originalUrl) {
    if (!isValidUrl(originalUrl)) {
      throw new Error("Invalid URL");
    }

    link.originalUrl = originalUrl;
    await redis.del(`link:${link.shortCode}`);
  }

  if (customAlias && customAlias !== link.shortCode) {
    const oldShortCode = link.shortCode;

    const exists = await Link.findOne({
      shortCode: customAlias,
      _id: { $ne: linkId },
    });
    if (exists) throw new Error();

    link.shortCode = customAlias;

    const baseUrl = process.env.BASE_URL;
    link.qrCode = await QRCode.toDataURL(`${baseUrl}/r/${customAlias}`);

    await redis.del(`link:${oldShortCode}`);
  }

  await link.save();
  return sanitizeLink(link);
};

export const deleteUserLink = async (userId, linkId) => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) throw new Error();

  const link = await Link.findOne({ _id: linkId, user: userId });
  if (!link) throw new Error();

  await redis.del(`link:${link.shortCode}`);
  await Link.deleteOne({ _id: linkId });
  await mongoose.model("Analytics").deleteMany({ link: linkId });
};

export const migrateGuestLinks = async (userId, sessionId) => {
  if (!sessionId) throw new Error();

  const result = await Link.updateMany(
    { sessionId, user: null },
    { $set: { user: userId, isGuestLink: false, sessionId: null } },
  );

  return { migratedCount: result.modifiedCount || 0 };
};

export const resolveRedirect = async (code, req) => {
  const cacheKey = `link:${code}`;

  // 1️⃣ Try Redis cache (ONLY if redis exists)
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const { originalUrl } = JSON.parse(cached);

        // fire-and-forget analytics
        trackAnalyticsFromCache(code, req).catch(() => {});

        if (!originalUrl || typeof originalUrl !== "string") {
          throw new Error("INVALID_URL");
        }

        return originalUrl.trim();
      }
    } catch (err) {
      // cache must NEVER break redirect
      console.warn("Redis cache read failed:", err.message);
    }
  }

  // 2️⃣ Fetch from MongoDB
  const link = await Link.findOne({ shortCode: code, isActive: true });
  if (!link) {
    throw new Error("NOT_FOUND");
  }

  if (!link.originalUrl || typeof link.originalUrl !== "string") {
    throw new Error("INVALID_URL");
  }

  // 3️⃣ Update link stats (non-blocking correctness)
  link.clicks += 1;
  link.lastAccessed = new Date();
  link.lastActivity = new Date();

  await link.save();

  const cleanUrl = link.originalUrl.trim();

  // 4️⃣ Store in Redis cache (best-effort)
  if (redis) {
    redis
      .set(cacheKey, JSON.stringify({ originalUrl: cleanUrl }), {
        EX: REDIRECT_CACHE_TTL,
      })
      .catch((err) => console.warn("Redis cache write failed:", err.message));
  }

  // 5️⃣ Fire analytics asynchronously (must NOT block redirect)
  enqueueTrackAnalytics({
    linkId: link._id.toString(),
    shortCode: link.shortCode,
    ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || null,
    userAgent: req.headers["user-agent"] || null,
    referrer: req.get("Referer") || "Direct",
    timestamp: Date.now(),
  }).catch(() => {});

  return cleanUrl;
};

const trackAnalyticsFromCache = async (shortCode, req) => {
  const link = await Link.findOne({ shortCode });
  if (!link) return;

  link.clicks += 1;
  link.lastAccessed = new Date();
  link.lastActivity = new Date();

  await link.save();
  enqueueTrackAnalytics({
    linkId: link._id.toString(),
    shortCode: link.shortCode,
    ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || null,
    userAgent: req.headers["user-agent"] || null,
    referrer: req.get("Referer") || "Direct",
    timestamp: Date.now(),
  }).catch(() => {});
};

const sanitizeLink = (link) => ({
  id: link._id,
  originalUrl: link.originalUrl,
  shortUrl: link.shortUrl,
  shortCode: link.shortCode,
  clicks: link.clicks,
  createdAt: link.createdAt,
  lastAccessed: link.lastAccessed || null,
  lastActivity: link.lastActivity || null,
  isGuestLink: link.isGuestLink || false,
  qrCode: link.qrCode || null,
});
