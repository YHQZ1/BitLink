import IORedis from "ioredis";

let redis = null;

if (process.env.REDIS_URL) {
  redis = new IORedis(process.env.REDIS_URL, {
    lazyConnect: true,
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
    enableOfflineQueue: false,

    retryStrategy(times) {
      return Math.min(times * 50, 2000);
    },
  });

  redis.on("connect", () => {
    console.log("Redis cache connected");
  });

  redis.on("error", (err) => {
    console.error("Redis cache error:", err.message);
  });
}

export default redis;
