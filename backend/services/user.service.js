import User from "../models/User.js";
import { hashPassword, verifyPassword } from "./password.service.js";

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("_id email name createdAt");

  if (!user) throw new Error("USER_NOT_FOUND");

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
};

export const updateUser = async (userId, data) => {
  const user = await User.findById(userId).select(
    "_id email name passwordHash createdAt",
  );

  if (!user) throw new Error("USER_NOT_FOUND");

  const { email, name, currentPassword, newPassword } = data;

  if (email && email !== user.email) {
    const normalizedEmail = email.toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) throw new Error("EMAIL_EXISTS");

    user.email = normalizedEmail;
  }

  if (name && name !== user.name) {
    user.name = name;
  }

  if (newPassword) {
    if (!currentPassword) throw new Error("CURRENT_PASSWORD_REQUIRED");

    if (!user.passwordHash) {
      throw new Error("OAUTH_PASSWORD_CHANGE_NOT_ALLOWED");
    }

    if (newPassword.length < 8) {
      throw new Error("PASSWORD_TOO_WEAK");
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) throw new Error("INVALID_CURRENT_PASSWORD");

    user.passwordHash = await hashPassword(newPassword);
  }

  if (user.isModified()) {
    try {
      await user.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new Error("EMAIL_EXISTS");
      }
      throw err;
    }
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
};
