import client from "prom-client";

client.collectDefaultMetrics({
  prefix: "bitlink_",
});

export const httpRequestDuration = new client.Histogram({
  name: "bitlink_http_request_duration_seconds",
  help: "HTTP request latency",
  labelNames: ["method", "route", "status"],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

export const httpRequestCount = new client.Counter({
  name: "bitlink_http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status"],
});

export const register = client.register;
