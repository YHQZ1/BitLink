// src/models/Analytics.js
import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  referrer: {
    type: String,
    default: "Direct",
  },
  country: {
    type: String,
    default: "Unknown",
  },
  city: {
    type: String,
  },
  deviceType: {
    type: String,
    enum: ["Mobile", "Desktop", "Tablet"],
    default: "Desktop",
  },
  browser: {
    type: String,
  },
  operatingSystem: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for faster queries
analyticsSchema.index({ link: 1, timestamp: -1 });
analyticsSchema.index({ timestamp: -1 });

export default mongoose.model("Analytics", analyticsSchema);