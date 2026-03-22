export const QUEUE_NAMES = {
  EMAIL: "email",
  REPORT: "report",
  WEBHOOK: "webhook",
} as const;

export const PRIORITIES = {
  HIGH: 1, // user is waiting
  NORMAL: 5, // standard work
  LOW: 10, // can wait minutes
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
export type Priority = (typeof PRIORITIES)[keyof typeof PRIORITIES];
