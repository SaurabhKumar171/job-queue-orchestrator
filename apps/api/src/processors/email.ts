import { Job } from "bullmq";

export async function processEmail(job: Job) {
  console.log(`[email] Processing job ${job.id}`, job.data);

  // Simulate work (sending email takes ~200ms)
  await new Promise((resolve) => setTimeout(resolve, 200));

  console.log(`[email] Done job ${job.id}`);
  return { sent: true, to: job.data.to };
}
