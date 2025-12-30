import dotenv from "dotenv";
import mongoose from "mongoose";
import { createApp } from "./app.js";

dotenv.config();

async function startServer() {
  await mongoose.connect(process.env.MONGODB_URI);

  const app = createApp();
  const port = Number(process.env.PORT) || 3000;

  app.listen(port);
}

startServer();
