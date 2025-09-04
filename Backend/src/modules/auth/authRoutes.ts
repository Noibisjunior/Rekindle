import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { signupSchema, loginSchema, googleTokenSchema } from './authModel';
import * as ctrl from './authController';
import { requireAuth } from '../../middleware/auth';
import { updateProfileSchema } from "../users/userSchema";
import { upload } from "../../middleware/upload";
import { User } from '../users/userModel';
import { Otp } from "./otpModel";
import { hashPassword} from '../../utils/crypto';       
import { verifyOtp } from "./otpService";
import { signAccessToken, signRefreshToken } from '../../utils/jwt';


const r = Router();

r.post('/signup', validate(signupSchema), ctrl.signup);
r.post('/login', validate(loginSchema), ctrl.login);
r.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const otp = await Otp.findOne({ email: email.trim().toLowerCase(),
      code: code.trim()});

    if (!otp) return res.status(400).json({ error: "InvalidOtp" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "UserNotFound" });

    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    await Otp.deleteMany({ email }); // clear OTP
    res.json({ message: "Password reset successful" });
  } catch (e) {
    res.status(500).json({ error: "ServerError" });
  }
});

r.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;
  try {
    await verifyOtp(email, code);

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "UserNotFound" });

    // Issue tokens only after verification
    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });

    res.json({ message: "Email verified successfully", user });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

// Google authentication route
// This route expects an idToken from the frontend
r.post('/google', validate(googleTokenSchema), ctrl.google);

// Protected route to get and update the current user's info
r.get('/me', requireAuth, ctrl.me);
r.put("/me", requireAuth, validate(updateProfileSchema), ctrl.updateMe);
r.post("/me/photo", requireAuth, upload.single("photo"), ctrl.uploadPhoto);

export default r;
