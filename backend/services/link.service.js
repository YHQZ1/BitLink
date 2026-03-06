import Link from "../models/Link.js";
import QRCode from "qrcode";
import mongoose from "mongoose";
import { isValidUrl } from "../utils/validateUrl.js";
import redis from "../lib/redis.js";
import { enqueueTrackAnalytics } from "../queues/analytics.queue.js";

const REDIRECT_CACHE_TTL = 60 * 60 * 24;

/*
CREATE USER LINK
*/
export const createUserLink = async (userId, data) => {
  const { originalUrl, customAlias } = data;

  if (!originalUrl || !isValidUrl(originalUrl)) {
    throw new Error("INVALID_URL");
  }

  const link = new Link({
    originalUrl,
    shortCode: customAlias || undefined,
    user: userId,
  });

  const baseUrl = process.env.BASE_URL;
  link.qrCode = await QRCode.toDataURL(`${baseUrl}/r/${link.shortCode}`);

  try {
    await link.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("ALIAS_TAKEN");
    }
    throw err;
  }

  return sanitizeLink(link);
};

/*
CREATE GUEST LINK
*/
export const createGuestLink = async (data) => {
  const { originalUrl, customAlias, sessionId } = data;

  if (!originalUrl) throw new Error("NO_URL");
  if (!isValidUrl(originalUrl)) throw new Error("INVALID_URL");
  if (!sessionId) throw new Error("INVALID_SESSION");

  const existing = await Link.countDocuments({
    sessionId,
    user: null,
  });

  if (existing >= 1) throw new Error("GUEST_LIMIT");

  const link = new Link({
    originalUrl,
    shortCode: customAlias || undefined,
    sessionId,
    user: null,
    isGuestLink: true,
  });

  const baseUrl = process.env.BASE_URL;
  link.qrCode = await QRCode.toDataURL(`${baseUrl}/r/${link.shortCode}`);

  try {
    await link.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("ALIAS_TAKEN");
    }
    throw err;
  }

  return sanitizeLink(link);
};

/*
GET USER LINKS
*/
export const getUserLinks = async (userId) => {
  const links = await Link.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return links.map(sanitizeLink);
};

/*
UPDATE USER LINK
*/
export const updateUserLink = async (userId, linkId, data) => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    throw new Error("INVALID_ID");
  }

  const link = await Link.findOne({ _id: linkId, user: userId });
  if (!link) throw new Error("NOT_FOUND");

  const { originalUrl, customAlias } = data;

  if (originalUrl) {
    if (!isValidUrl(originalUrl)) throw new Error("INVALID_URL");

    link.originalUrl = originalUrl;

    if (redis) {
      await redis.del(`link:${link.shortCode}`);
    }
  }

  if (customAlias && customAlias !== link.shortCode) {
    const oldShortCode = link.shortCode;

    link.shortCode = customAlias;

    const baseUrl = process.env.BASE_URL;
    link.qrCode = await QRCode.toDataURL(`${baseUrl}/r/${customAlias}`);

    if (redis) {
      await redis.del(`link:${oldShortCode}`);
    }
  }

  try {
    await link.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("ALIAS_TAKEN");
    }
    throw err;
  }

  return sanitizeLink(link);
};

/*
DELETE USER LINK
*/
export const deleteUserLink = async (userId, linkId) => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    throw new Error("INVALID_ID");
  }

  const link = await Link.findOne({ _id: linkId, user: userId });
  if (!link) throw new Error("NOT_FOUND");

  if (redis) {
    await redis.del(`link:${link.shortCode}`);
  }

  await Link.deleteOne({ _id: linkId });
  await mongoose.model("Analytics").deleteMany({ link: linkId });
};

/*
MIGRATE GUEST LINKS
*/
export const migrateGuestLinks = async (userId, sessionId) => {
  if (!sessionId) throw new Error("INVALID_SESSION");

  const result = await Link.updateMany(
    { sessionId, user: null },
    {
      $set: {
        user: userId,
        isGuestLink: false,
        sessionId: null,
      },
    },
  );

  return { migratedCount: result.modifiedCount || 0 };
};

/*
RESOLVE REDIRECT
*/
export const resolveRedirect = async (code, req) => {
  const cacheKey = `link:${code}`;

  if (redis) {
    try {
      const cached = await redis.get(cacheKey);

      if (cached) {
        const { originalUrl } = JSON.parse(cached);

        trackAnalytics(code, req).catch(() => {});

        return originalUrl.trim();
      }
    } catch (err) {
      console.warn("Redis read failed:", err.message);
    }
  }

  const link = await Link.findOne({
    shortCode: code,
    isActive: true,
  }).lean();

  if (!link) throw new Error("NOT_FOUND");

  const cleanUrl = link.originalUrl.trim();

  await Link.updateOne(
    { _id: link._id },
    {
      $inc: { clicks: 1 },
      $set: {
        lastAccessed: new Date(),
        lastActivity: new Date(),
      },
    },
  );

  if (redis) {
    redis
      .set(
        cacheKey,
        JSON.stringify({ originalUrl: cleanUrl }),
        "EX",
        REDIRECT_CACHE_TTL,
      )
      .catch((err) => console.warn("Redis write failed:", err.message));
  }

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

/*
TRACK ANALYTICS FOR CACHE HITS
*/
const trackAnalytics = async (shortCode, req) => {
  await Link.updateOne(
    { shortCode },
    {
      $inc: { clicks: 1 },
      $set: {
        lastAccessed: new Date(),
        lastActivity: new Date(),
      },
    },
  );

  enqueueTrackAnalytics({
    linkId: null,
    shortCode,
    ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || null,
    userAgent: req.headers["user-agent"] || null,
    referrer: req.get("Referer") || "Direct",
    timestamp: Date.now(),
  }).catch(() => {});
};

/*
SANITIZE LINK OUTPUT
*/
const sanitizeLink = (link) => {
  const baseUrl = process.env.BASE_URL;

  return {
    id: link._id,
    originalUrl: link.originalUrl,
    shortCode: link.shortCode,
    shortUrl: `${baseUrl}/r/${link.shortCode}`,
    clicks: link.clicks,
    createdAt: link.createdAt,
    lastAccessed: link.lastAccessed || null,
    lastActivity: link.lastActivity || null,
    isGuestLink: link.isGuestLink || false,
    qrCode: link.qrCode || null,
  };
};
