import { User } from "../users/userModel";
import { hashPassword, verifyPassword } from "../../utils/crypto";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { env } from "../../config/env";
import { sendOtp } from "./otpService";

const googleClient = env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(env.GOOGLE_CLIENT_ID)
  : null;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * Signup with email, password and creates user and sends OTP
 */
export async function signupLocal(email: string, password: string, name?: string) {
  const normalizedEmail = normalizeEmail(email);
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new Error("EmailInUse");

  const safeName = name?.trim() || "";
  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email: normalizedEmail,
    passwordHash,
    name: safeName,
    photoUrl: undefined,
    isVerified: false,
    profile: {
      fullName: safeName,
      tags: [],
    },
  });

  // send OTP for email verification
  await sendOtp(normalizedEmail);

  return user; // controller handles response
}

/**
 * Login with email and password
 * - blocks if user not verified
 */
export async function loginLocal(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });
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
      name: payload.name || payload.email,
      photoUrl: payload.picture,
      isVerified: true,
      profile: {
        fullName: payload.name || payload.email,
        photoUrl: payload.picture,
        tags: [],
      },
    });
  } else {
    const nextName = payload.name || user.name || user.profile?.fullName || user.email;
    const nextPhoto = payload.picture || user.photoUrl || user.profile?.photoUrl;

    user.name = nextName;
    user.photoUrl = nextPhoto;
    user.profile = {
      ...user.profile,
      fullName: nextName,
      photoUrl: nextPhoto,
      tags: user.profile?.tags ?? [],
    };

    if (!user.isVerified) {
      user.isVerified = true;
    }
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
