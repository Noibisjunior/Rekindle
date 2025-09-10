import { Router } from "express";
import { validate } from "../../middleware/validate";
import { signupSchema, loginSchema, googleTokenSchema } from "./authModel";
import * as ctrl from "./authController";
import { requireAuth } from "../../middleware/auth";
import { updateProfileSchema } from "../users/userSchema";
import { upload } from "../../middleware/upload";
import { User } from "../users/userModel";
import { Otp } from "./otpModel";
import { hashPassword } from "../../utils/crypto";
import { verifyOtp } from "./otpService";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

const r = Router();

r.post("/signup", validate(signupSchema), ctrl.signup);
r.post("/login", validate(loginSchema), ctrl.login);

r.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;
  try {
    // 1validate OTP
    await verifyOtp(email, code);

    
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "UserNotFound" });

    // issue tokens only after verification
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", 
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Email verified successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

r.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const otp = await Otp.findOne({
      email: email.trim().toLowerCase(),
      code: code.trim(),
    });

    if (!otp) return res.status(400).json({ error: "InvalidOtp" });
    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTPExpired" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "UserNotFound" });

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    await Otp.deleteMany({ email }); 
    res.json({ message: "Password reset successful" });
  } catch (e) {
    res.status(500).json({ error: "ServerError" });
  }
});

r.post("/google", validate(googleTokenSchema), ctrl.google);

r.get("/me", requireAuth, ctrl.me);
r.put("/me", requireAuth, validate(updateProfileSchema), ctrl.updateMe);
r.post("/me/photo", requireAuth, upload.single("photo"), ctrl.uploadPhoto);

r.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ error: "MissingRefreshToken" });

    const payload = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken(payload.sub);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ error: "InvalidRefreshToken" });
  }
});

export default r;
