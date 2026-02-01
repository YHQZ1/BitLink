import redis from "../lib/redis.js";

export const rateLimit = ({ keyPrefix, limit, windowSec, keyGenerator }) => {
  return async (req, res, next) => {
    try {
      if (!redis) {
        return next();
      }

      const identifier = keyGenerator(req);
      if (!identifier) return next();

      const key = `${keyPrefix}:${identifier}`;

      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, windowSec);
      }

      if (count > limit) {
        return res.status(429).json({
          error: "Too many requests. Please slow down.",
        });
      }

      next();
    } catch (err) {
      console.error("Rate limit error:", err);
      next();
    }
  };
};
