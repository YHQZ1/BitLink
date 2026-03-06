import redis from "../lib/redis.js";

export const rateLimit = ({ keyPrefix, limit, windowSec, keyGenerator }) => {
  return async (req, res, next) => {
    try {
      if (!redis) return next();

      const identifier = keyGenerator(req);
      if (!identifier) return next();

      const cleanId = String(identifier).trim();
      const key = `${keyPrefix}:${cleanId}`;

      const count = await redis.incr(key);

      if (count === 1) {
        await redis.expire(key, windowSec);
      }

      const remaining = Math.max(limit - count, 0);

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remaining);

      if (count > limit) {
        res.setHeader("Retry-After", windowSec);

        return res.status(429).json({
          error: "Too many requests. Please slow down.",
        });
      }

      next();
    } catch (err) {
      console.error("Rate limit error:", keyPrefix, err.message);
      next();
    }
  };
};
