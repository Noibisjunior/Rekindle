import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../modules/users/userModel';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'MissingToken' });

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('_id email name photoUrl');
    if (!user) return res.status(401).json({ error: 'InvalidToken' });
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'InvalidToken' });
  }
}
