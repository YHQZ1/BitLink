import {
  getLinkAnalytics,
  getGlobalAnalytics,
  getUserStats,
} from "../services/analytics.service.js";

export const getLinkAnalyticsController = async (req, res, next) => {
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
    console.error("Error retrieving link analytics:", err.message);
    next(err);
  }
};

export const getGlobalAnalyticsController = async (req, res, next) => {
  try {
    const { range = "30d", timeZone = "UTC" } = req.query;

    const data = await getGlobalAnalytics(req.user.id, range, timeZone);

    res.json(data);
  } catch (err) {
    console.error("Error retrieving global analytics:", err.message);
    next(err);
  }
};

export const getUserStatsController = async (req, res, next) => {
  try {
    const stats = await getUserStats(req.user.id);

    res.json(stats);
  } catch (err) {
    console.error("Error retrieving user statistics:", err.message);
    next(err);
  }
};
