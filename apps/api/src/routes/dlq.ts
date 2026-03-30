import { FastifyInstance } from "fastify";
import { listDLQ, replayJob } from "../services/dlqService";

export async function dlqRoutes(app: FastifyInstance) {
  app.get("/dlq", async () => {
    return listDLQ();
  });

  app.post("/dlq/:jobId/replay", async (req, reply) => {
    const { jobId } = req.params as { jobId: string };
    const result = await replayJob(jobId);

    if (!result.ok) {
      const status = result.reason === "not_found" ? 404 : 400;
      return reply.status(status).send({ error: result.reason });
    }

    return result;
  });
}
