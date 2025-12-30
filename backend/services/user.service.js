import User from "../models/User.js";
import { hashPassword, verifyPassword } from "./password.service.js";

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select("_id email name createdAt");
  if (!user) throw new Error();
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
};

export const updateUser = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new Error();

  const { email, name, currentPassword, newPassword } = data;

  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists) throw new Error();
    user.email = email.toLowerCase();
  }

  if (name && name !== user.name) {
    user.name = name;
  }

  if (newPassword) {
    if (!currentPassword) throw new Error();
    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) throw new Error();
    user.passwordHash = await hashPassword(newPassword);
  }

  await user.save();

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
};
