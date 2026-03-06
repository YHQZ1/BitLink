import redis from "../lib/redis.js";

export const authRateLimit = ({ windowSec = 60, max = 5 } = {}) => {
  return async (req, res, next) => {
    try {
      if (!redis) return next();

      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.ip ||
        "unknown";

      const key = `auth:${ip}`;

      const attempts = await redis.incr(key);

      if (attempts === 1) {
        await redis.expire(key, windowSec);
      }

      const remaining = Math.max(max - attempts, 0);

      res.setHeader("X-RateLimit-Limit", max);
      res.setHeader("X-RateLimit-Remaining", remaining);

      if (attempts > max) {
        res.setHeader("Retry-After", windowSec);

        return res.status(429).json({
          error: "Too many authentication attempts. Try again later.",
        });
      }

      next();
    } catch {
      next();
    }
  };
};
