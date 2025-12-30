import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    link: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
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
  },
  { timestamps: true }
);

analyticsSchema.index({ link: 1, timestamp: -1 });

export default mongoose.model("Analytics", analyticsSchema);
