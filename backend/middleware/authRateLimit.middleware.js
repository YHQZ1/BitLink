import redis from "../lib/redis.js";

export const authRateLimit = ({ windowSec = 60, max = 5 } = {}) => {
  return async (req, res, next) => {
    try {
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "unknown";

      const key = `auth:${ip}`;
      const attempts = await redis.incr(key);

      if (attempts === 1) {
        await redis.expire(key, windowSec);
      }

      if (attempts > max) {
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
