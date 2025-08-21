import { Request, Response } from "express";
import * as svc from "./qrService";

export async function getMyQr(req: Request, res: Response) {
  const me = (req as any).user;
  const qr = await svc.provisionUserQr(me._id);
  res.json(qr);
}
