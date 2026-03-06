import mongoose from "mongoose";

const authProviderSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["github", "google", "local"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: String,
    avatar: String,
    authProviders: {
      type: [authProviderSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one auth provider required",
      },
    },
    passwordHash: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.index(
  {
    "authProviders.provider": 1,
    "authProviders.providerId": 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      "authProviders.provider": { $exists: true },
      "authProviders.providerId": { $exists: true },
    },
  },
);

export default mongoose.model("User", userSchema);
