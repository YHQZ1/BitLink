import IORedis from "ioredis";

let redis = null;

if (process.env.REDIS_URL) {
  redis = new IORedis(process.env.REDIS_URL, {
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  });

  redis.on("connect", () => {
    console.log("Redis cache connected");
  });

  redis.on("error", (err) => {
    console.error("Redis cache error:", err.message);
  });
}

export default redis;
