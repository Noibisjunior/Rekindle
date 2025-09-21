"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    email: { type: String, required: true, lowercase: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    verified: { type: Boolean, default: false },
    used: { type: Boolean, default: false }, // prevent reuse
}, { timestamps: true });
// Auto-delete expired OTPs from DB
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.Otp = (0, mongoose_1.model)("Otp", otpSchema);
