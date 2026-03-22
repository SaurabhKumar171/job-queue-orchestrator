import { FastifyInstance } from "fastify";
import { getAllDLQ, getDLQEntry, removeDLQEntry } from "../queues/dlq";
import { enqueue } from "../queues/client";
import { queueMap } from "./jobs";

export async function dlqRoutes(app: FastifyInstance) {
  app.get("/dlq", async () => getAllDLQ());

  app.post("/dlq/:jobId/replay", async (req, reply) => {
    const { jobId } = req.params as { jobId: string };
    const entry = getDLQEntry(jobId);
    if (!entry) return reply.status(404).send({ error: "Not found" });

    const replayId = `${jobId}-replay-${Date.now()}`;
    await enqueue(queueMap[entry.queue], replayId, entry.data, 1);
    removeDLQEntry(jobId);

    return { ok: true, replayJobId: replayId };
  });
}
