"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startReminderWorker = startReminderWorker;
const reminderModel_1 = require("./reminderModel");
const userModel_1 = require("../users/userModel");
const connectionModel_1 = require("../connections/connectionModel");
const mailer_1 = require("../../config/mailer");
async function startReminderWorker() {
    setInterval(async () => {
        const now = new Date();
        try {
            // Find all due and unsent reminders
            const reminders = await reminderModel_1.Reminder.find({
                remindAt: { $lte: now },
                sent: false,
            });
            for (const r of reminders) {
                try {
                    // Get user who created the reminder
                    const user = await userModel_1.User.findById(r.userId).select("name email");
                    // Get both users in the connection
                    const connection = await connectionModel_1.Connection.findById(r.connectionId)
                        .populate("aUserId bUserId", "name email");
                    if (!user || !connection)
                        continue;
                    // Figure out who the "other user" is
                    const aUser = connection.aUserId;
                    const bUser = connection.bUserId;
                    const otherUser = aUser._id.toString() === user._id.toString() ? bUser : aUser;
                    // Send email to the creator
                    await mailer_1.transporter.sendMail({
                        from: "Rekindle <no-reply@rekindle.com>",
                        to: user.email,
                        subject: "Follow-up Reminder",
                        text: `It's time to follow up with your connection.\n\nMessage: ${r.message}`,
                    });
                    // Send email to the other user
                    if (otherUser?.email) {
                        await mailer_1.transporter.sendMail({
                            from: "Rekindle <no-reply@rekindle.com>",
                            to: otherUser.email,
                            subject: `Follow-up Reminder from ${otherUser.email}`,
                            text: `${otherUser.email} set a reminder to follow up with you.\n\nMessage: ${r.message}`,
                        });
                    }
                    r.sent = true;
                    await r.save();
                }
                catch (err) {
                    console.error("Failed to process reminder:", err);
                }
            }
        }
        catch (err) {
            console.error("Error checking reminders:", err);
        }
    }, 60000); // run every 1 minute
}
