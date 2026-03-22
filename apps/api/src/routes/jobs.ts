import { FastifyInstance } from "fastify";
import {
  emailQueue,
  reportQueue,
  webhookQueue,
  enqueue,
} from "../queues/client";
import { PRIORITIES } from "@repo/shared";
import crypto from "crypto";

export const queueMap = {
  email: emailQueue,
  report: reportQueue,
  webhook: webhookQueue,
};

export async function jobRoutes(app: FastifyInstance) {
  app.post(
    "/jobs",
    {
      schema: {
        body: {
          type: "object",
          required: ["type", "payload"],
          properties: {
            type: { type: "string", enum: ["email", "report", "webhook"] },
            priority: {
              type: "string",
              enum: ["high", "normal", "low"],
              default: "normal",
            },
            payload: { type: "object" },
          },
        },
      },
    },
    async (req, reply) => {
      const { type, priority = "normal", payload } = req.body as any;
      const queue = queueMap[type as keyof typeof queueMap];
      const jobId = `${type}-${crypto.randomUUID()}`;
      const priorityNum =
        PRIORITIES[priority.toUpperCase() as keyof typeof PRIORITIES];

      const job = await enqueue(queue, jobId, payload, priorityNum);

      return reply.status(202).send({
        jobId: job.id,
        status: "queued",
        queue: type,
        priority,
      });
    },
  );
}
