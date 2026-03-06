import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

export const hashPassword = async (password) => {
  if (!password || typeof password !== "string") {
    throw new AppError("Please provide a valid password.", 400);
  }

  if (password.length < 8) {
    throw new AppError(
      "Your password must be at least eight characters long.",
      400,
    );
  }

  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password, hash) => {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
};
