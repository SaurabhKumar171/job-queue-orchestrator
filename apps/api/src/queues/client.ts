import { Queue } from "bullmq";
import { connection } from "./redis";
import { QUEUE_NAMES } from "@repo/shared";

export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, { connection });
export const reportQueue = new Queue(QUEUE_NAMES.REPORT, { connection });
export const webhookQueue = new Queue(QUEUE_NAMES.WEBHOOK, { connection });

// Helper: idempotent enqueue (same jobId = no duplicate)
export async function enqueue(
  queue: Queue,
  jobId: string,
  data: unknown,
  priority = 5,
) {
  return queue.add(jobId, data, {
    jobId,
    priority,
    attempts: 5,
    backoff: { type: "custom" },
    removeOnComplete: { count: 1000 },
    removeOnFail: false,
  });
}
