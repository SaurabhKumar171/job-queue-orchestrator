export type DLQEntry = {
  jobId: string;
  queue: string;
  data: unknown;
  error: string;
  failedAt: Date;
};

const dlqStore = new Map<string, DLQEntry>();

export function addToDLQ(entry: DLQEntry) {
  dlqStore.set(entry.jobId, entry);
}

export function getDLQEntry(jobId: string) {
  return dlqStore.get(jobId);
}

export function getAllDLQ() {
  return Array.from(dlqStore.values());
}

export function removeDLQEntry(jobId: string) {
  dlqStore.delete(jobId);
}
