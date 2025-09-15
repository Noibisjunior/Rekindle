import { Reminder } from "./reminderModel";
import { User } from "../users/userModel";
import { Connection } from "../connections/connectionModel";
import { transporter } from "../../config/mailer"; 

export async function startReminderWorker() {
  setInterval(async () => {
    const now = new Date();

    try {
      // Find all due and unsent reminders
      const reminders = await Reminder.find({
        remindAt: { $lte: now },
        sent: false,
      });

      for (const r of reminders) {
        try {
          // Get user who created the reminder
          const user = await User.findById(r.userId).select("name email");
          // Get both users in the connection
          const connection = await Connection.findById(r.connectionId)
            .populate("aUserId bUserId", "name email");

          if (!user || !connection) continue;

          // Figure out who the "other user" is
          const aUser = connection.aUserId as any;
          const bUser = connection.bUserId as any;
          const otherUser = aUser._id.toString() === user._id.toString() ? bUser : aUser;

          // Send email to the creator
          await transporter.sendMail({
            from: "Rekindle <no-reply@rekindle.com>",
            to: user.email,
            subject: "Follow-up Reminder",
            text: `It's time to follow up with your connection.\n\nMessage: ${r.message}`,
          });

          // Send email to the other user
          if (otherUser?.email) {
            await transporter.sendMail({
              from: "Rekindle <no-reply@rekindle.com>",
              to: otherUser.email,
              subject: `Follow-up Reminder from ${otherUser.email}`,
              text: `${otherUser.email} set a reminder to follow up with you.\n\nMessage: ${r.message}`,
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
  }, 60_000); // run every 1 minute
}
