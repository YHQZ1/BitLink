import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { hashPassword, verifyPassword } from "./password.service.js";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

export const signupUser = async ({ email, password, name }) => {
  if (!email || !password) {
    throw new Error("INVALID_INPUT");
  }

  const normalizedEmail = email.toLowerCase();

  const passwordHash = await hashPassword(password);

  try {
    const user = await User.create({
      email: normalizedEmail,
      name,
      passwordHash,
      authProviders: [{ provider: "local", providerId: normalizedEmail }],
    });

    return {
      token: signToken(user._id),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("EMAIL_EXISTS");
    }
    throw err;
  }
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("INVALID_INPUT");
  }

  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "_id email name passwordHash",
  );

  if (!user || !user.passwordHash) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    token: signToken(user._id),
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  };
};

export const oauthLogin = async ({
  provider,
  providerId,
  email,
  name,
  avatar,
}) => {
  const normalizedEmail = email?.toLowerCase();

  let user = await User.findOne({
    authProviders: { $elemMatch: { provider, providerId } },
  });

  let isNewUser = false;

  if (!user && normalizedEmail) {
    user = await User.findOne({ email: normalizedEmail });

    if (user) {
      if (
        !user.authProviders.some(
          (p) => p.provider === provider && p.providerId === providerId,
        )
      ) {
        user.authProviders.push({ provider, providerId });
      }

      if (avatar && user.avatar !== avatar) {
        user.avatar = avatar;
      }

      await user.save();
    }
  }

  if (!user) {
    user = await User.create({
      email: normalizedEmail,
      name,
      avatar,
      authProviders: [{ provider, providerId }],
    });

    isNewUser = true;
  }

  return {
    token: signToken(user._id),
    isNewUser,
  };
};
