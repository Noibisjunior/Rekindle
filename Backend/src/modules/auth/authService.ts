import { User } from "../users/userModel";
import { hashPassword, verifyPassword } from "../../utils/crypto";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { env } from "../../config/env";
import { sendOtp } from "./otpService";

const googleClient = env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(env.GOOGLE_CLIENT_ID)
  : null;

/**
 * Signup with email + password → creates user and sends OTP
 */
export async function signupLocal(email: string, password: string, name?: string) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("EmailInUse");

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email,
    passwordHash,
    name,
    isVerified: false,
  });

  // send OTP for email verification
  await sendOtp(email);

  return user; // controller handles response
}

/**
 * Login with email + password
 * - blocks if user not verified
 */
export async function loginLocal(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) throw new Error("InvalidCredentials");

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error("InvalidCredentials");

  if (!user.isVerified) throw new Error("NotVerified");

  return issueTokens(user.id);
}

/**
 * Google login → creates user if not exists
 * - auto-verifies since Google guarantees email
 */
export async function loginWithGoogleIdToken(idToken: string) {
  if (!googleClient) throw new Error("GoogleNotConfigured");

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload() as TokenPayload;
  if (!payload?.email) throw new Error("GoogleNoEmail");

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      email: payload.email,
      googleId: payload.sub,
      name: payload.name,
      photoUrl: payload.picture,
      isVerified: true, // 
    });
  } else if (!user.isVerified) {
    user.isVerified = true; 
    await user.save();
  }

  return issueTokens(user.id);
}

/**
 * Issue access + refresh tokens
 */
function issueTokens(userId: string) {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);
  return { accessToken, refreshToken };
}
