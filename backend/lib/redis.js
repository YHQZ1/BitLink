import { createClient } from "redis";

let redis = null;

if (process.env.REDIS_URL) {
  redis = createClient({
    url: process.env.REDIS_URL,
  });

  redis.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  redis.connect().catch((err) => {
    console.error("Redis connection failed", err);
  });
}

export default redis;
