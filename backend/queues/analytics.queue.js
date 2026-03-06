import { Queue } from "bullmq";
import redis from "../lib/redis.js";

let analyticsQueue = null;

if (process.env.NODE_ENV !== "test") {
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
    limiter: {
      max: 5000,
      duration: 1000,
    },
  });
}

export const enqueueTrackAnalytics = async (payload) => {
  if (!analyticsQueue) return;

  await analyticsQueue.add("track_click", payload, {
    jobId: `${payload.linkId}:${payload.timestamp}`,
  });
};
