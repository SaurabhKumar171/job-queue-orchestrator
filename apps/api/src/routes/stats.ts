import { FastifyInstance } from "fastify";
import { getQueueStats } from "../services/statsService";

export async function statsRoutes(app: FastifyInstance) {
  app.get("/stats", async () => {
    return getQueueStats();
  });
}
