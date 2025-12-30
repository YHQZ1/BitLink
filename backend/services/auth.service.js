import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { hashPassword, verifyPassword } from "./password.service.js";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const signupUser = async ({ email, password, name }) => {
  if (!email || !password) throw new Error();

  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new Error();

  const passwordHash = await hashPassword(password);

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
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) throw new Error();

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !user.passwordHash) throw new Error();

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new Error();

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
  let user = await User.findOne({
    authProviders: { $elemMatch: { provider, providerId } },
  });

  let isNewUser = false;

  if (!user && email) {
    user = await User.findOne({ email });
    if (user) {
      user.authProviders.push({ provider, providerId });
      if (avatar) user.avatar = avatar;
      await user.save();
    }
  }

  if (!user) {
    user = await User.create({
      email,
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
