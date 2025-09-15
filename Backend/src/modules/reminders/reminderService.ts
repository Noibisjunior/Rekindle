import dayjs from "dayjs";
import { Reminder } from "./reminderModel";

export async function createReminder(
  userId: string,
  connectionId: string,
  remindAt: Date,
  channel: "push" | "email",
  message: string
) {
  // no queue for now
  const reminder = await Reminder.create({
    userId,
    connectionId,
    remindAt,
    channel,
    message,
  });
  return reminder;
}

export async function listReminders(userId: string) {
  return Reminder.find({ userId }).populate("connectionId", "profile").sort({ remindAt: 1 }).lean();
}

export async function cancelReminder(userId: string, reminderId: string) {
  return Reminder.findOneAndDelete({ _id: reminderId, userId });
}




/* import dayjs from "dayjs";
import { Reminder } from "./reminderModel";
import { reminderQueue } from "./reminderQueue";

export async function createReminder(userId: string, connectionId: string, remindAt: Date, channel: "push" | "email", message: string) {
  const reminder = await Reminder.create({ userId, connectionId, remindAt, channel, message });

  // Schedule job in BullMQ
  const delay = Math.max(0, dayjs(remindAt).diff(dayjs()));
  await reminderQueue.add("sendReminder", { reminderId: reminder._id.toString() }, { delay });

  return reminder;
}

export async function listReminders(userId: string) {
  return Reminder.find({ userId }).sort({ remindAt: 1 }).lean();
}

export async function cancelReminder(userId: string, reminderId: string) {
  const r = await Reminder.findOneAndDelete({ _id: reminderId, userId });
  return r;
}

*/
