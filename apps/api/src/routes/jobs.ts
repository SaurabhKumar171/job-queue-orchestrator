import { FastifyInstance } from "fastify";
import { enqueueJob, getJobById } from "../services/jobService";

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
      const result = await enqueueJob(req.body as any);
      return reply.status(202).send(result);
      //     ↑ route only knows about HTTP status codes
    },
  );

  app.get("/jobs/:jobId", async (req, reply) => {
    const { jobId } = req.params as { jobId: string };
    const job = await getJobById(jobId);
    if (!job) return reply.status(404).send({ error: "Job not found" });
    return job;
  });
}
