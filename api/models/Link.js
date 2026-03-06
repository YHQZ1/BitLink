import mongoose from "mongoose";
import { nanoid } from "nanoid";

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
      default: () => nanoid(7),
      index: true,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
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
  { timestamps: true },
);

linkSchema.index({ shortCode: 1, isActive: 1 });
linkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

linkSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  delete obj.sessionId;
  return obj;
};

export default mongoose.model("Link", linkSchema);
