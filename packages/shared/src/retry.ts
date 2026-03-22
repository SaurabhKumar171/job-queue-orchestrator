export function backoffDelay(
  attempt: number,
  baseMs = 1000,
  maxMs = 60_000,
): number {
  const exp = Math.min(baseMs * Math.pow(2, attempt), maxMs);
  const jitter = Math.random() * 0.3 * exp; // spread ±30%
  return Math.floor(exp + jitter);
}
