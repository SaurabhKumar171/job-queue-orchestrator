import { emailQueue, reportQueue, webhookQueue } from "../queues/client";
import { getAllDLQ } from "../queues/dlq";

export async function getQueueStats() {
  const queues = await Promise.all(
    [emailQueue, reportQueue, webhookQueue].map(async (q) => {
      const counts = await q.getJobCounts(
        "waiting",
        "active",
        "completed",
        "failed",
        "delayed",
      );
      return { name: q.name, ...counts };
    }),
  );

  // Business rule: compute a system health signal
  const totalWaiting = queues.reduce((s, q) => s + (q.waiting ?? 0), 0);
  const totalFailed = queues.reduce((s, q) => s + (q.failed ?? 0), 0);
  const dlqCount = getAllDLQ().length;

  const health =
    dlqCount > 10 || totalFailed > 50
      ? "degraded"
      : totalWaiting > 5000
        ? "busy"
        : "healthy";

  return {
    queues,
    totals: { waiting: totalWaiting, failed: totalFailed, dlq: dlqCount },
    health,
  };
}
