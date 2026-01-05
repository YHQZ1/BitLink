import dotenv from "dotenv";
import { createApp } from "./app.js";
import connectDB from "./lib/db.js";

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
  await connectDB();

  const app = createApp();
  const port = Number(process.env.PORT) || 3000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
