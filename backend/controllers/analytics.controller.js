import {
  getLinkAnalytics,
  getGlobalAnalytics,
  getUserStats,
} from "../services/analytics.service.js";

export const getLinkAnalyticsController = async (req, res) => {
  try {
    const { range = "all", timeZone = "UTC" } = req.query;

    const data = await getLinkAnalytics(
      req.user.id,
      req.params.id,
      range,
      timeZone,
    );

    res.json(data);
  } catch (err) {
    console.error("Link analytics error:", err.message);
    res.status(400).json({ error: "Failed to fetch link analytics" });
  }
};

export const getGlobalAnalyticsController = async (req, res) => {
  try {
    const { range = "30d", timeZone = "UTC" } = req.query;

    const data = await getGlobalAnalytics(req.user.id, range, timeZone);

    res.json(data);
  } catch (err) {
    console.error("Global analytics error:", err.message);
    res.status(400).json({ error: "Failed to fetch global analytics" });
  }
};

export const getUserStatsController = async (req, res) => {
  try {
    const stats = await getUserStats(req.user.id);
    res.json(stats);
  } catch (err) {
    console.error("User stats error:", err.message);
    res.status(400).json({ error: "Failed to fetch user stats" });
  }
};
