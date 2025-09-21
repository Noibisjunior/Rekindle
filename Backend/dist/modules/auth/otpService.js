"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
const otpModel_1 = require("./otpModel");
const mailer_1 = require("../../config/mailer");
const crypto_1 = __importDefault(require("crypto"));
const userModel_1 = require("../users/userModel");
async function sendOtp(email) {
    const code = crypto_1.default.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins
    // delete old codes for this email
    await otpModel_1.Otp.deleteMany({ email });
    // save new code
    await otpModel_1.Otp.create({ email, code, expiresAt });
    // send email
    await mailer_1.transporter.sendMail({
        from: '"Rekindle" <no-reply@Rekindle.com>',
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${code}. It will expire in 10 minutes.`,
    });
    return true;
}
async function verifyOtp(email, code) {
    const otp = await otpModel_1.Otp.findOne({ email, code });
    if (!otp)
        throw new Error("InvalidCode");
    if (otp.expiresAt < new Date())
        throw new Error("ExpiredCode");
    if (otp.used)
        throw new Error("CodeAlreadyUsed");
    // mark OTP as used (one-time)
    otp.verified = true;
    otp.used = true;
    await otp.save();
    // mark user verified (if exists)
    const user = await userModel_1.User.findOneAndUpdate({ email }, { $set: { isVerified: true } }, { new: true });
    if (!user)
        throw new Error("UserNotFound");
    return user; //  return actual verified user
}
