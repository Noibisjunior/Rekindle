"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reminder = void 0;
const mongoose_1 = require("mongoose");
const reminderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    connectionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Connection", required: true },
    remindAt: { type: Date, required: true },
    channel: { type: String, enum: ["push", "email"], default: "email" },
    message: { type: String, required: true },
    sent: { type: Boolean, default: false },
}, { timestamps: true });
exports.Reminder = (0, mongoose_1.model)("Reminder", reminderSchema);
