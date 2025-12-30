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
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    name: String,
    avatar: String,
    authProviders: {
      type: [authProviderSchema],
      required: true,
    },
    passwordHash: String,
  },
  { timestamps: true }
);

userSchema.index(
  { "authProviders.provider": 1, "authProviders.providerId": 1 },
  { unique: true }
);

export default mongoose.model("User", userSchema);
