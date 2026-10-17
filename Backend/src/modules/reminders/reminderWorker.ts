import { Reminder } from "./reminderModel";
import { User } from "../users/userModel";
import { Connection } from "../connections/connectionModel";
import { transporter } from "../../config/mailer";

export async function startReminderWorker() {
  setInterval(async () => {
    const now = new Date();

    try {
      const reminders = await Reminder.find({
        remindAt: { $lte: now },
        sent: false,
      });

      for (const r of reminders) {
        try {
          const user = await User.findById(r.userId).select(
            "email name photoUrl profile.fullName profile.photoUrl"
          );
          const connection = await Connection.findById(r.connectionId)
            .populate({
              path: "aUserId",
              select: "email name photoUrl profile.fullName profile.photoUrl",
            })
            .populate({
              path: "bUserId",
              select: "email name photoUrl profile.fullName profile.photoUrl",
            });

          if (!user || !connection) continue;

          const aUser = connection.aUserId as any;
          const bUser = connection.bUserId as any;
          const otherUser = aUser?._id?.toString() === user._id.toString() ? bUser : aUser;
          const userName = user.profile?.fullName || user.name || user.email;

          if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log(`[Reminder] Development mode: reminder for ${user.email}: ${r.message}`);
            r.sent = true;
            await r.save();
            continue;
          }

          await transporter.sendMail({
            from: "Rekindle <no-reply@rekindle.com>",
            to: user.email,
            subject: "Follow-up Reminder",
            text: `It's time to follow up with your connection.\n\nMessage: ${r.message}`,
          });

          if (otherUser?.email) {
            await transporter.sendMail({
              from: "Rekindle <no-reply@rekindle.com>",
              to: otherUser.email,
              subject: `Follow-up Reminder from ${userName}`,
              text: `${userName} set a reminder to follow up with you.\n\nMessage: ${r.message}`,
            });
          }

          r.sent = true;
          await r.save();
        } catch (err) {
          console.error("Failed to process reminder:", err);
        }
      }
    } catch (err) {
      console.error("Error checking reminders:", err);
    }
  }, 60_000);
}
