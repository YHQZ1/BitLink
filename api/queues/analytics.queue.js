import { Queue } from "bullmq";
import redis from "../lib/redis.js";

let analyticsQueue = null;

if (process.env.NODE_ENV !== "test" && redis) {
  analyticsQueue = new Queue("analytics", {
    connection: redis,
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  });
}

export const enqueueTrackAnalyticsBatch = async (events) => {
  if (!analyticsQueue || !events?.length) return;

  try {
    await analyticsQueue.add("track_click_batch", events, {
      removeOnComplete: true,
      removeOnFail: false,
    });
  } catch (err) {
    console.error(
      "Unable to queue analytics events for processing:",
      err.message,
    );
  }
};
