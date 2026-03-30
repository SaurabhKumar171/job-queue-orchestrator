import crypto from "crypto";
import {
  emailQueue,
  reportQueue,
  webhookQueue,
  enqueue,
} from "../queues/client";
import { PRIORITIES } from "@repo/shared";
import type { Queue } from "bullmq";
import { jobsTotal } from "../metrics";

const queueMap: Record<string, Queue> = {
  email: emailQueue,
  report: reportQueue,
  webhook: webhookQueue,
};

export type EnqueueInput = {
  type: "email" | "report" | "webhook";
  priority: "high" | "normal" | "low";
  payload: Record<string, unknown>;
};

export type EnqueueResult = {
  jobId: string;
  status: "queued";
  queue: string;
  priority: string;
};

export async function enqueueJob(input: EnqueueInput): Promise<EnqueueResult> {
  const queue = queueMap[input.type];
  const jobId = `${input.type}-${crypto.randomUUID()}`;
  const priorityNum =
    PRIORITIES[input.priority.toUpperCase() as keyof typeof PRIORITIES];

  // Business rule: reports are always at least normal priority
  const effectivePriority =
    input.type === "report"
      ? Math.min(priorityNum, PRIORITIES.NORMAL)
      : priorityNum;

  await enqueue(queue, jobId, input.payload, effectivePriority);

  // Track metric here in the service — not in the route
  jobsTotal.inc({ queue: input.type, priority: input.priority });

  return {
    jobId,
    status: "queued",
    queue: input.type,
    priority: input.priority,
  };
}

export async function getJobById(jobId: string) {
  // Try each queue until we find the job
  for (const queue of Object.values(queueMap)) {
    const job = await queue.getJob(jobId);
    if (job) {
      const state = await job.getState();
      return {
        jobId: job.id,
        state,
        queue: job.queueName,
        priority: job.opts.priority,
        attempts: job.attemptsMade,
        maxAttempts: job.opts.attempts,
        data: job.data,
        returnValue: job.returnvalue,
        failedReason: job.failedReason,
        createdAt: job.timestamp,
        processedAt: job.processedOn,
        finishedAt: job.finishedOn,
      };
    }
  }
  return null;
}
