import Link from "../models/Link.js";
import QRCode from "qrcode";
import mongoose from "mongoose";
import { isValidUrl } from "../utils/validateUrl.js";
import redis from "../lib/redis.js";
import { addAnalyticsEvent } from "../lib/analyticsBuffer.js";
import AppError from "../utils/AppError.js";

const REDIRECT_CACHE_TTL = 60 * 60 * 24;

export const createUserLink = async (userId, data) => {
  const { originalUrl, customAlias } = data;

  if (!originalUrl || !isValidUrl(originalUrl)) {
    throw new AppError("Please enter a valid URL.", 400);
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
      throw new AppError(
        "This custom alias is already taken. Please choose another one.",
        409,
      );
    }
    throw err;
  }

  return sanitizeLink(link);
};

export const createGuestLink = async (data) => {
  const { originalUrl, customAlias, sessionId } = data;

  if (!originalUrl) {
    throw new AppError("Please provide a URL to shorten.", 400);
  }

  if (!isValidUrl(originalUrl)) {
    throw new AppError("Please enter a valid URL.", 400);
  }

  if (!sessionId) {
    throw new AppError("Your session could not be verified.", 400);
  }

  const existing = await Link.countDocuments({
    sessionId,
    user: null,
  });

  if (existing >= 1) {
    throw new AppError(
      "Guest users can create only one shortened link. Please sign in to create more.",
      403,
    );
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

  try {
    await link.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError(
        "This custom alias is already taken. Please choose another one.",
        409,
      );
    }
    throw err;
  }

  return sanitizeLink(link);
};

export const getUserLinks = async (userId) => {
  const links = await Link.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return links.map(sanitizeLink);
};

export const updateUserLink = async (userId, linkId, data) => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    throw new AppError("The link you are trying to update is invalid.", 400);
  }

  const link = await Link.findOne({ _id: linkId, user: userId });

  if (!link) {
    throw new AppError("The requested link could not be found.", 404);
  }

  const { originalUrl, customAlias } = data;

  if (originalUrl) {
    if (!isValidUrl(originalUrl)) {
      throw new AppError("Please enter a valid URL.", 400);
    }

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
      throw new AppError(
        "This custom alias is already taken. Please choose another one.",
        409,
      );
    }
    throw err;
  }

  return sanitizeLink(link);
};

export const deleteUserLink = async (userId, linkId) => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) {
    throw new AppError("The link you are trying to delete is invalid.", 400);
  }

  const link = await Link.findOne({ _id: linkId, user: userId });

  if (!link) {
    throw new AppError("The requested link could not be found.", 404);
  }

  if (redis) {
    await redis.del(`link:${link.shortCode}`);
  }

  await Link.deleteOne({ _id: linkId });
  await mongoose.model("Analytics").deleteMany({ link: linkId });
};

export const migrateGuestLinks = async (userId, sessionId) => {
  if (!sessionId) {
    throw new AppError("Your session could not be verified.", 400);
  }

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

export const resolveRedirect = async (code, req) => {
  const cacheKey = `link:${code}`;

  if (redis) {
    try {
      const cached = await redis.get(cacheKey);

      if (cached) {
        const { originalUrl, linkId } = JSON.parse(cached);

        await Link.updateOne(
          { _id: linkId },
          {
            $inc: { clicks: 1 },
            $set: {
              lastAccessed: new Date(),
              lastActivity: new Date(),
            },
          },
        );

        addAnalyticsEvent({
          linkId,
          ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || null,
          userAgent: req.headers["user-agent"] || null,
          referrer: req.get("Referer") || "Direct",
          timestamp: Date.now(),
        });

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

  if (!link) {
    throw new AppError(
      "This shortened link does not exist or has been disabled.",
      404,
    );
  }

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
        JSON.stringify({
          originalUrl: cleanUrl,
          linkId: link._id.toString(),
        }),
        "EX",
        REDIRECT_CACHE_TTL,
        "NX",
      )
      .catch((err) => console.warn("Redis write failed:", err.message));
  }

  addAnalyticsEvent({
    linkId: link._id.toString(),
    ip: req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || null,
    userAgent: req.headers["user-agent"] || null,
    referrer: req.get("Referer") || "Direct",
    timestamp: Date.now(),
  });

  return cleanUrl;
};

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
