import User from "../models/User.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import AppError from "../utils/AppError.js";

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select(
    "_id email name avatar createdAt",
  );

  if (!user) {
    throw new AppError("Your account could not be found.", 404);
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    createdAt: user.createdAt,
  };
};

export const updateUser = async (userId, data) => {
  const user = await User.findById(userId).select(
    "_id email name passwordHash createdAt",
  );

  if (!user) {
    throw new AppError("Your account could not be found.", 404);
  }

  const { email, name, currentPassword, newPassword } = data;

  if (email && email !== user.email) {
    const normalizedEmail = email.toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      throw new AppError("This email address is already in use.", 409);
    }

    user.email = normalizedEmail;
  }

  if (name && name !== user.name) {
    user.name = name;
  }

  if (newPassword) {
    if (!currentPassword) {
      throw new AppError(
        "Please enter your current password before setting a new one.",
        400,
      );
    }

    if (!user.passwordHash) {
      throw new AppError(
        "Password changes are not available for accounts created using Google or GitHub.",
        403,
      );
    }

    if (newPassword.length < 8) {
      throw new AppError(
        "Your new password must be at least eight characters long.",
        400,
      );
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);

    if (!valid) {
      throw new AppError("The current password you entered is incorrect.", 401);
    }

    user.passwordHash = await hashPassword(newPassword);
  }

  if (user.isModified()) {
    try {
      await user.save();
    } catch (err) {
      if (err.code === 11000) {
        throw new AppError("This email address is already in use.", 409);
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
