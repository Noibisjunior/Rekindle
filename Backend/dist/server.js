"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const reminderWorker_1 = require("./modules/reminders/reminderWorker");
(async () => {
    const PORT = Number(env_1.env.PORT) || 4000;
    await (0, db_1.connectDB)();
    app_1.default.listen(PORT, "0.0.0.0", () => {
        console.log(`API running on http://0.0.0.0:${PORT}`);
    });
    (0, reminderWorker_1.startReminderWorker)();
    console.log("⏰ Reminder worker started...");
})();
