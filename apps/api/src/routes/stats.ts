import { emailQueue, reportQueue, webhookQueue } from "../queues/client";

export async function statsRoutes(app) {
  app.get("/stats", async () => {
    const queues = await Promise.all(
      [emailQueue, reportQueue, webhookQueue].map(async (q) => {
        const counts = await q.getJobCounts(
          "waiting",
          "active",
          "completed",
          "failed",
        );
        return { name: q.name, ...counts };
      }),
    );
    return { queues };
  });
}
