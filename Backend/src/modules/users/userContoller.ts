import { Request, Response } from "express";
import { User } from "./userModel";

export async function getMe(req: Request, res: Response) {
  const user = await User.findById((req as any).user._id);
  if (!user) return res.status(404).json({ error: "NotFound" });
  res.json({ user });
}



