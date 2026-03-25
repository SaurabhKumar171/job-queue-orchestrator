import IORedis from "ioredis";
import { config } from "../config";

// export const connection = new IORedis({
//   host: process.env.REDIS_HOST || "localhost",
//   port: 6379,
//   maxRetriesPerRequest: null,
// });

export const connection = new IORedis({
  host: config.redis.host || "localhost",
  port: config.redis.port,
  maxRetriesPerRequest: null,
});
