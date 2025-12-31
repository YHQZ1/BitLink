import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app.js";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

if (!process.env.BASE_URL || !process.env.CLIENT_URL) {
  throw new Error("Missing required environment variables");
}

async function startServer() {
  await mongoose.connect(process.env.MONGODB_URI);

  const app = createApp();
  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
