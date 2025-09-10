import { Router } from "express";
import * as otpService from "./otpService";

const r = Router();

r.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "EmailRequired" });

  try {
    await otpService.sendOtp(email);
    res.json({ message: "OTP sent successfully" });
  } catch (e) {
    console.error("OTP send error:", e);
    res.status(500).json({ error: "FailedToSendOtp" });
  }
});

r.post("/verify-otp", async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "MissingParams" });

  try {
    const user = await otpService.verifyOtp(email, code);
    res.json({
      message: "OTP verified successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default r;
