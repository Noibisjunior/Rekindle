// import { Queue } from "bullmq";
// import { redisConnection } from "../config/redis";

// export const REMINDER_QUEUE = "reminders";

// export const reminderQueue = new Queue(REMINDER_QUEUE, {
//   connection: redisConnection,
//   defaultJobOptions: {
//     attempts: 3,
//     backoff: { type: "exponential", delay: 15_000 },
//     removeOnComplete: true,
//     removeOnFail: 50,
//   },
// });
 