import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import AppError from "../utils/AppError.js";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

export const signupUser = async ({ email, password, name }) => {
  if (!email || !password) {
    throw new AppError(
      "Please provide both an email address and a password to create your account.",
      400,
    );
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
      throw new AppError(
        "An account with this email address already exists.",
        409,
      );
    }
    throw err;
  }
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError(
      "Please enter both your email address and password to sign in.",
      400,
    );
  }

  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "_id email name passwordHash",
  );

  if (!user || !user.passwordHash) {
    throw new AppError(
      "The email address or password you entered is incorrect.",
      401,
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    throw new AppError(
      "The email address or password you entered is incorrect.",
      401,
    );
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

      if (!user.avatar && avatar) {
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
