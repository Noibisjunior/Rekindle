import { Otp } from "./otpModel";
import { transporter } from "../../config/mailer";
import crypto from "crypto";
import { User } from "../users/userModel";
import { env } from "../../config/env";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function extractSendlibertySender(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/<([^>]+)>/);
  if (match?.[1]) return match[1].trim();
  return trimmed.replace(/^['"]|['"]$/g, '').trim();
}

async function sendWithSendliberty(email: string, code: string) {
  const apiKey = process.env.SENDLIBERTY_API_KEY || env.SENDLIBERTY_API_KEY;
  const apiUrl = process.env.SENDLIBERTY_API_URL || env.SENDLIBERTY_API_URL;
  const configuredFrom = process.env.SENDLIBERTY_FROM || env.SENDLIBERTY_FROM || process.env.SMTP_USER || env.SMTP_USER || "no-reply@rekindle.local";
  const from = extractSendlibertySender(configuredFrom);

  if (!apiKey) {
    throw new Error("SendlibertyApiKeyMissing");
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Verify your Rekindle account",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h2>Your verification code</h2>
          <p>Your OTP code is:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">${code}</p>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
      text: `Your OTP code is ${code}. It will expire in 10 minutes.`,
      replyTo: "support@rekindle.app",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sendliberty rejected OTP email: ${errorText}`);
  }

  return true;
}

export async function sendOtp(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Otp.deleteMany({ email: normalizedEmail });
  await Otp.create({ email: normalizedEmail, code, expiresAt });

  const sendlibertyApiKey = process.env.SENDLIBERTY_API_KEY || env.SENDLIBERTY_API_KEY;
  const smtpConfigured = Boolean(process.env.SMTP_USER || env.SMTP_USER) && Boolean(process.env.SMTP_PASS || env.SMTP_PASS);

  const fallbackError = { message: "All email delivery methods failed" };

  try {
    if (sendlibertyApiKey) {
      try {
        await sendWithSendliberty(normalizedEmail, code);
        return true;
      } catch (error) {
        console.warn("Sendliberty delivery failed; attempting SMTP fallback.", error);
      }
    }

    if (smtpConfigured && transporter) {
      try {
        await transporter.sendMail({
          from: `"Rekindle" <${process.env.SMTP_FROM || env.SMTP_FROM}>`,
          to: normalizedEmail,
          subject: "Your OTP Code",
          text: `Your OTP code is ${code}. It will expire in 10 minutes.`,
        });
        return true;
      } catch (error) {
        console.warn("SMTP delivery failed; falling back to console OTP output.", error);
      }
    }

    console.log(`[OTP] Development mode: OTP for ${normalizedEmail} is ${code}`);
    return true;
  } catch (error) {
    console.warn("Email delivery failed; OTP was still generated.", error ?? fallbackError);
    return true;
  }
}

export async function verifyOtp(email: string, code: string) {
  const normalizedEmail = normalizeEmail(email);
  const otp = await Otp.findOne({ email: normalizedEmail, code });

  if (!otp) throw new Error("InvalidCode");
  if (otp.expiresAt < new Date()) throw new Error("ExpiredCode");
  if (otp.used) throw new Error("CodeAlreadyUsed");

  // mark OTP as used (one-time)
  otp.verified = true;
  otp.used = true;
  await otp.save();

  // mark user verified (if exists)
  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: { isVerified: true } },
    { new: true }
  );

  if (!user) throw new Error("UserNotFound");

  return user; //  return actual verified user
}
