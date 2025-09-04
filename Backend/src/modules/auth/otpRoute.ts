import { Router } from "express";
import * as otpService from "./otpService";

const r = Router();

// send OTP (for signup verification or password reset)
r.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  try {
    await otpService.sendOtp(email);
    res.json({ message: "OTP sent successfully" });
  } catch (e) {
    res.status(500).json({ error: "FailedToSendOtp" });
  }
});

// verify OTP
r.post("/verify-otp", async (req, res) => {
  const { email, code } = req.body;
  try {
    await otpService.verifyOtp(email, code);
    res.json({ message: "OTP verified successfully" });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});



export default r;
