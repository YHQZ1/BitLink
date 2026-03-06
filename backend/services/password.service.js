import bcrypt from "bcryptjs";

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

export const hashPassword = async (password) => {
  if (!password || typeof password !== "string") {
    throw new Error("PASSWORD_REQUIRED");
  }

  if (password.length < 8) {
    throw new Error("PASSWORD_TOO_WEAK");
  }

  return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password, hash) => {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
};
