import { Request, Response } from "express";
import * as svc from "./reminderService";

export async function setReminder(req: Request, res: Response) {
  const me = (req as any).user;
  const { connectionId, remindAt, channel = "email", message } = req.body;

  const reminder = await svc.createReminder(me._id, connectionId, new Date(remindAt), channel, message);
  res.status(201).json(reminder);
}

export async function listReminders(req: Request, res: Response) {
  const me = (req as any).user;
  const reminders = await svc.listReminders(me._id);
  res.json(reminders);
}

export async function cancel(req: Request, res: Response) {
  const me = (req as any).user;
  const { id } = req.params;
  const r = await svc.cancelReminder(me._id, id);
  if (!r) return res.status(404).json({ error: "NotFound" });
  res.json({ ok: true });
}
