import { Otp } from "./otpModel";
import { transporter } from "../../config/mailer";
import crypto from "crypto";
import { User } from "../users/userModel";

export async function sendOtp(email: string) {
  const code = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins

  // delete old codes for this email
  await Otp.deleteMany({ email });

  // save new code
  await Otp.create({ email, code, expiresAt });

  // send email
  await transporter.sendMail({
    from: '"Rekindle" <no-reply@Rekindle.com>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${code}. It will expire in 10 minutes.`,
  });

  return true;
}

export async function verifyOtp(email: string, code: string) {
  const otp = await Otp.findOne({ email, code });

  if (!otp) throw new Error("InvalidCode");
  if (otp.expiresAt < new Date()) throw new Error("ExpiredCode");
  if (otp.used) throw new Error("CodeAlreadyUsed");

  // mark OTP as used (one-time)
  otp.verified = true;
  otp.used = true;
  await otp.save();

  // mark user verified (if exists)
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { isVerified: true } },
    { new: true }
  );

  if (!user) throw new Error("UserNotFound");

  return user; //  return actual verified user
}
