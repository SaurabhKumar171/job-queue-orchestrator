import { getAllDLQ, getDLQEntry, removeDLQEntry } from "../queues/dlq";
import {
  emailQueue,
  reportQueue,
  webhookQueue,
  enqueue,
} from "../queues/client";
import type { Queue } from "bullmq";

const queueMap: Record<string, Queue> = {
  email: emailQueue,
  report: reportQueue,
  webhook: webhookQueue,
};

export function listDLQ() {
  // Business rule: sort newest failures first
  return getAllDLQ().sort(
    (a, b) => new Date(b.failedAt).getTime() - new Date(a.failedAt).getTime(),
  );
}

export async function replayJob(jobId: string) {
  const entry = getDLQEntry(jobId);

  if (!entry) {
    return { ok: false, reason: "not_found" } as const;
  }

  const queue = queueMap[entry.queue];
  if (!queue) {
    return { ok: false, reason: "unknown_queue" } as const;
  }

  // Business rule: replays always jump to HIGH priority — user is waiting for this
  const replayId = `${jobId}-replay-${Date.now()}`;
  await enqueue(queue, replayId, entry.data, 1);
  removeDLQEntry(jobId);

  return { ok: true, replayJobId: replayId } as const;
}
