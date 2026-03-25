import Fastify from "fastify";
import { QUEUE_NAMES, PRIORITIES } from "@repo/shared";
import "./queues/workers"; // starts all workers on boot
import { emailQueue, enqueue } from "./queues/client";
import { jobRoutes } from "./routes/jobs";
import { register } from "./metrics";
import { config } from "./config";
import { v4 as uuidv4 } from "uuid";

const app = Fastify({ logger: true });

app.get("/health", async () => ({ ok: true }));

app.get("/test-job", async () => {
  const job = await enqueue(
    emailQueue,
    `job-${uuidv4()}`,
    { to: "hello@test.com", subject: "Test" },
    1,
  );
  return { jobId: job.id };
});

app.get("/metrics", async (req, reply) => {
  reply.header("Content-Type", register.contentType);
  return register.metrics();
});

app.register(jobRoutes);

app.listen({ port: config.port }, (err) => {
  if (err) {
    (app.log as any).error(err);
    process.exit(1);
  }
});
