// src/models/Link.js
import mongoose from "mongoose";
import shortid from "shortid";

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      unique: true,
      default: shortid.generate,
    },
    shortUrl: {
      type: String,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: null,
    },
    qrCode: {
      type: String, // store QR as a data URL or file path
    },
    expiresAt: {
      type: Date, // optional – for link expiry
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Generate full shortUrl before saving (if not set)
linkSchema.pre("save", function (next) {
  if (!this.shortUrl) {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    this.shortUrl = `${baseUrl}/${this.shortCode}`;
  }
  next();
});

export default mongoose.model("Link", linkSchema);
