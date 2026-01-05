import { Queue } from "bullmq";

let analyticsQueue = null;

if (process.env.NODE_ENV !== "test") {
  analyticsQueue = new Queue("analytics", {
    connection: {
      url: process.env.REDIS_URL,
    },
  });
}

export const enqueueTrackAnalytics = async (payload) => {
  if (!analyticsQueue) return;

  await analyticsQueue.add("track_click", payload, {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
};
