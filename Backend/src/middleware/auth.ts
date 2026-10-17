import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../modules/users/userModel';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  const token = bearerToken || req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ error: "MissingToken" });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("email profile");
    if (!user) {
      return res.status(401).json({ error: "InvalidToken" });
    }

    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ error: "InvalidToken" });
  }
}