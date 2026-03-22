import { Worker } from "bullmq";
import { connection } from "./redis";
import { backoffDelay } from "@repo/shared";
import { processEmail } from "../processors/email";
import { addToDLQ } from "./dlq";

export const workers = [
  new Worker("email", processEmail, {
    connection,
    concurrency: 10,
    settings: {
      backoffStrategy: (attempt) => backoffDelay(attempt),
    },
  }),
];

// Graceful shutdown — finish in-flight jobs before exit
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, draining workers...");
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
});

workers[0].on("failed", (job, err) => {
  if (!job) return;
  const maxAttempts = job.opts.attempts ?? 1;
  if (job.attemptsMade >= maxAttempts) {
    addToDLQ({
      jobId: job.id!,
      queue: job.queueName,
      data: job.data,
      error: err.message,
      failedAt: new Date(),
    });
  }
});
