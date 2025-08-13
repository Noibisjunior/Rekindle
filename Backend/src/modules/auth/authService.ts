import { User } from '../users/userModel';
import { hashPassword, verifyPassword } from '../../utils/crypto';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { env } from '../../config/env';

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

export async function signupLocal(email: string, password: string, name?: string) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('EmailInUse');
  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash, name });
  return issueTokens(user.id);
}

export async function loginLocal(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) throw new Error('InvalidCredentials');
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error('InvalidCredentials');
  return issueTokens(user.id);
}

export async function loginWithGoogleIdToken(idToken: string) {
  if (!googleClient) throw new Error('GoogleNotConfigured');
  const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload() as TokenPayload;
  if (!payload?.email) throw new Error('GoogleNoEmail');

  let user = await User.findOne({ email: payload.email });
  if (!user) {
    user = await User.create({
      email: payload.email,
      googleId: payload.sub,
      name: payload.name,
      photoUrl: payload.picture,
    });
  }
  return issueTokens(user.id);
}

function issueTokens(userId: string) {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);
  return { accessToken, refreshToken };
}
