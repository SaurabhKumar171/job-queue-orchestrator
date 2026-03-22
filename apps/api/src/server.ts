import Fastify from "fastify";
import { QUEUE_NAMES, PRIORITIES } from "@repo/shared";
import "./queues/workers"; // starts all workers on boot
import { emailQueue, enqueue } from "./queues/client";
import { jobRoutes } from "./routes/jobs";

const app = Fastify({ logger: true });

app.get("/health", async () => ({ ok: true }));

app.get("/test-job", async () => {
  const job = await enqueue(
    emailQueue,
    "test-email-002",
    { to: "hello@test.com", subject: "Test" },
    1,
  );
  return { jobId: job.id };
});

app.register(jobRoutes);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    (app.log as any).error(err);
    process.exit(1);
  }
});
