import {
  register,
  Counter,
  Gauge,
  Histogram,
  collectDefaultMetrics,
} from "prom-client";

collectDefaultMetrics(); // CPU, memory, event loop

export const jobsTotal = new Counter({
  name: "jobs_total",
  help: "Total jobs enqueued",
  labelNames: ["queue", "priority"] as const,
});

export const jobDuration = new Histogram({
  name: "job_duration_seconds",
  help: "Job processing time",
  labelNames: ["queue", "status"] as const,
  buckets: [0.1, 0.5, 1, 5, 10, 30, 60],
});

export const dlqGauge = new Gauge({
  name: "dlq_size",
  help: "Jobs in dead-letter queue",
  labelNames: ["queue"] as const,
});

export const queueDepth = new Gauge({
  name: "queue_depth",
  help: "Waiting jobs per queue",
  labelNames: ["queue"] as const,
});

export { register };
