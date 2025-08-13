import jwt from 'jsonwebtoken';
import { env } from '../config/env';

type JWTPayload = { sub: string };

export function signAccessToken(userId: string) {
  return jwt.sign({ sub: userId } as JWTPayload, env.JWT_SECRET, { expiresIn: '15m' });
}
export function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId } as JWTPayload, env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}
export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
}
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload;
}
