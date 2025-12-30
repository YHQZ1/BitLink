import {
  getLinkAnalytics,
  getGlobalAnalytics,
  getUserStats,
} from "../services/analytics.service.js";

export const getLinkAnalyticsController = async (req, res) => {
  try {
    const data = await getLinkAnalytics(
      req.user.id,
      req.params.id,
      req.query.range
    );
    res.json(data);
  } catch {
    res.status(400).json({ error: "Failed to fetch link analytics" });
  }
};

export const getGlobalAnalyticsController = async (req, res) => {
  try {
    const data = await getGlobalAnalytics(req.user.id, req.query.range);
    res.json(data);
  } catch {
    res.status(400).json({ error: "Failed to fetch global analytics" });
  }
};

export const getUserStatsController = async (req, res) => {
  try {
    const stats = await getUserStats(req.user.id);
    res.json(stats);
  } catch {
    res.status(400).json({ error: "Failed to fetch user stats" });
  }
};
