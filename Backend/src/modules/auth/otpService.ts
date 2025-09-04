import { Otp } from "./otpModel";
import { transporter } from "../../config/mailer";
import crypto from "crypto";

export async function sendOtp(email: string) {
  const code = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 mins

  await Otp.deleteMany({ email }); // remove old codes
  await Otp.create({ email, code, expiresAt });

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

  otp.verified = true;
  await otp.save();
  return true;
}
