import { env } from "./env";
import { ConnectionOptions } from "bullmq";

export const redisConnection: ConnectionOptions["connection"] = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
};
