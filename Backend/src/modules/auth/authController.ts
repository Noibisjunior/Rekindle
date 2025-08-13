import { Request, Response } from 'express';
import * as svc from './authService';

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const tokens = await svc.signupLocal(email, password, name);
    return res.status(201).json(tokens);
  } catch (e: any) {
    if (e.message === 'EmailInUse') return res.status(409).json({ error: 'EmailInUse' });
    return res.status(500).json({ error: 'ServerError' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const tokens = await svc.loginLocal(email, password);
    return res.json(tokens);
  } catch (e: any) {
    if (e.message === 'InvalidCredentials') return res.status(401).json({ error: 'InvalidCredentials' });
    return res.status(500).json({ error: 'ServerError' });
  }
}

export async function google(req: Request, res: Response) {
  try {
    const { idToken } = req.body;
    const tokens = await svc.loginWithGoogleIdToken(idToken);
    return res.json(tokens);
  } catch (e: any) {
    if (e.message === 'GoogleNotConfigured') return res.status(500).json({ error: 'GoogleNotConfigured' });
    return res.status(401).json({ error: 'GoogleAuthFailed' });
  }
}

export async function me(req: Request, res: Response) {
  const user = (req as any).user;
  return res.json({ user });
}
