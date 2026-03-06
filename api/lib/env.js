import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.resolve(
  __dirname,
  process.env.NODE_ENV === "production"
    ? "../.env.production"
    : "../.env.development",
);

if (fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.error(
      "Failed to load environment configuration:",
      result.error.message,
    );
    process.exit(1);
  }
} else {
  console.warn(
    `Environment file not found at ${envPath}, using system environment variables`,
  );
}
