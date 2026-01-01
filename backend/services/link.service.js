import Link from "../models/Link.js";
import QRCode from "qrcode";
import mongoose from "mongoose";
import { trackAnalytics } from "./analytics.service.js";

export const createUserLink = async (userId, data) => {
  const { originalUrl, customAlias } = data;
  if (!originalUrl) throw new Error();

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
  if (!originalUrl || !sessionId) throw new Error();

  const existing = await Link.find({ sessionId, user: null });
  if (existing.length >= 1) throw new Error();

  if (customAlias) {
    const exists = await Link.findOne({ shortCode: customAlias });
    if (exists) throw new Error();
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

  if (originalUrl) link.originalUrl = originalUrl;

  if (customAlias && customAlias !== link.shortCode) {
    const exists = await Link.findOne({
      shortCode: customAlias,
      _id: { $ne: linkId },
    });
    if (exists) throw new Error();

    link.shortCode = customAlias;
    const baseUrl = process.env.BASE_URL;
    link.qrCode = await QRCode.toDataURL(`${baseUrl}/r/${customAlias}`);
  }

  await link.save();
  return sanitizeLink(link);
};

export const deleteUserLink = async (userId, linkId) => {
  if (!mongoose.Types.ObjectId.isValid(linkId)) throw new Error();

  const link = await Link.findOne({ _id: linkId, user: userId });
  if (!link) throw new Error();

  await Link.deleteOne({ _id: linkId });
  await mongoose.model("Analytics").deleteMany({ link: linkId });
};

export const migrateGuestLinks = async (userId, sessionId) => {
  if (!sessionId) throw new Error();

  const result = await Link.updateMany(
    { sessionId, user: null },
    { $set: { user: userId, isGuestLink: false, sessionId: null } }
  );

  return { migratedCount: result.modifiedCount || 0 };
};

export const resolveRedirect = async (code, req) => {
  const link = await Link.findOne({ shortCode: code });
  if (!link) throw new Error();

  if (link.expiresAt && link.expiresAt < new Date()) {
    link.isActive = false;
    await link.save();
    throw new Error();
  }

  link.clicks += 1;
  link.lastAccessed = new Date();
  link.lastActivity = new Date();
  link.isActive = true;

  await link.save();
  await trackAnalytics(link, req);

  return link.originalUrl;
};

const sanitizeLink = (link) => ({
  id: link._id,
  originalUrl: link.originalUrl,
  shortUrl: link.shortUrl,
  shortCode: link.shortCode,
  clicks: link.clicks,
  createdAt: link.createdAt,
  isGuestLink: link.isGuestLink || false,
  qrCode: link.qrCode || null,
});
