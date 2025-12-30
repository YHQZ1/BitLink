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
      index: true,
    },
    shortUrl: String,
    clicks: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: null,
    },
    qrCode: String,
    expiresAt: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: null,
    },
    sessionId: {
      type: String,
      index: true,
      sparse: true,
    },
    isGuestLink: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

linkSchema.pre("save", function (next) {
  if (!this.shortUrl) {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    this.shortUrl = `${baseUrl}/r/${this.shortCode}`;
  }
  next();
});

export default mongoose.model("Link", linkSchema);
