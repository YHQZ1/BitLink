import client from "prom-client";

client.collectDefaultMetrics({
  prefix: "bitlink_",
});

export const httpRequestDuration =
  client.register.getSingleMetric("bitlink_http_request_duration_seconds") ||
  new client.Histogram({
    name: "bitlink_http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status"],
    buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10],
  });

export const httpRequestCount =
  client.register.getSingleMetric("bitlink_http_requests_total") ||
  new client.Counter({
    name: "bitlink_http_requests_total",
    help: "Total number of HTTP requests processed",
    labelNames: ["method", "route", "status"],
  });

export const register = client.register;
