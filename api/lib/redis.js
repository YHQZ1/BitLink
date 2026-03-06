import IORedis from "ioredis";

let redis = null;

if (process.env.REDIS_URL) {
  redis = new IORedis(process.env.REDIS_URL, {
    lazyConnect: true,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,

    retryStrategy(times) {
      return Math.min(times * 50, 2000);
    },
  });

  redis.on("connect", () => {
    console.log("Redis cache connected");
  });

  redis.on("reconnecting", () => {
    console.warn("Redis reconnecting");
  });

  redis.on("error", (err) => {
    console.error("Redis cache error:", err.message);
  });

  redis.on("end", () => {
    console.warn("Redis connection closed");
  });
}

export default redis;
