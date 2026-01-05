import { Queue } from "bullmq";

const connection = {
  url: process.env.REDIS_URL,
};

export const analyticsQueue = new Queue("analytics", {
  connection,
});

export const enqueueTrackAnalytics = async (payload) => {
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
