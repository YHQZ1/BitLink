import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    console.error(
      "MongoDB connection string is missing. Please set the MONGODB_URI environment variable.",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;

    console.log("MongoDB connection established");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB connection lost");
      isConnected = false;
    });
  } catch (err) {
    console.error(
      "Failed to establish MongoDB connection. The application cannot start.",
      err.message,
    );
    process.exit(1);
  }
};

export default connectDB;
