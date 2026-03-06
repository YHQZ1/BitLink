import { enqueueTrackAnalyticsBatch } from "../queues/analytics.queue.js";

const buffer = [];
const MAX_BATCH = 100;
const MAX_BUFFER = 1000;
const FLUSH_INTERVAL = 2000;

let flushing = false;

export function addAnalyticsEvent(event) {
  if (buffer.length >= MAX_BUFFER) {
    console.warn("Analytics buffer overflow, dropping event");
    return;
  }

  buffer.push(event);

  if (buffer.length >= MAX_BATCH) {
    flush();
  }
}

async function flush() {
  if (flushing || buffer.length === 0) return;

  flushing = true;

  const batch = buffer.splice(0, buffer.length);

  try {
    await enqueueTrackAnalyticsBatch(batch);
  } catch (err) {
    console.error("Failed to enqueue analytics batch:", err.message);
  } finally {
    flushing = false;
  }
}

setInterval(flush, FLUSH_INTERVAL);

process.on("SIGTERM", flush);
process.on("SIGINT", flush);
