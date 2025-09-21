"use strict";
// import "dotenv/config";
// import { Worker, Job, Queue } from "bullmq";
// import { connectDB } from "../config/db";
// import { redisConnection } from "../config/redis";
// import { REMINDER_QUEUE } from "../modules/reminders/reminderQueue";
// import { Reminder } from "../modules/reminders/reminderModel";
// import { notifyByEmail } from "../modules/notifications/webpushService";
// (async () => {
//   await connectDB();
//   // Create queue instance (to re-enqueue jobs if needed)
//   const reminderQueue = new Queue(REMINDER_QUEUE, { connection: redisConnection });
//   const worker = new Worker(
//     REMINDER_QUEUE,
//     async (job: Job) => {
//       const { reminderId } = job.data as { reminderId: string };
//       const reminder = await Reminder.findById(reminderId).populate<{ userId: any }>("userId");
//       if (!reminder || reminder.sent) return;
//       if (reminder.channel === "email") {
//         const to = reminder.userId.email;
//         const subject = "Follow-up reminder";
//         const body = reminder.message;
//         await notifyByEmail(to, subject, body);
//       }
//       reminder.sent = true;
//       await reminder.save();
//     },
//     { connection: redisConnection }
//   );
//   // Catch up overdue reminders
//   worker.on("ready", async () => {
//     const now = new Date();
//     const late = await Reminder.find({ sent: false, remindAt: { $lte: now } }).lean();
//     for (const r of late) {
//       await reminderQueue.add("sendReminder", { reminderId: r._id.toString() });
//     }
//   });
//   worker.on("failed", (job, err) => {
//     console.error("Reminder job failed", job?.id, err);
//   });
// })();
