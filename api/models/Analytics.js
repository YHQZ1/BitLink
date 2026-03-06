import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  link: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
  userAgent: String,
  referrer: {
    type: String,
    default: "Direct",
  },
  country: {
    type: String,
    default: "Unknown",
  },
  city: String,
  deviceType: {
    type: String,
    enum: ["Mobile", "Desktop", "Tablet"],
    default: "Desktop",
  },
  browser: String,
  operatingSystem: String,
});

analyticsSchema.index({ link: 1, timestamp: -1 });

analyticsSchema.index(
  { timestamp: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);

export default mongoose.model("Analytics", analyticsSchema);
