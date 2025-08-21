import { Request, Response } from "express";
import { User } from "../users/userModel";
import { Connection } from "./connectionModel";
import dayjs from "dayjs";

export async function connectWithCode(req: Request, res: Response) {
  const me = (req as any).user;
  const { code } = req.params;

  const target = await User.findOne({ "qr.code": code });
  if (!target) return res.status(404).json({ error: "UserNotFound" });

  if (target._id.equals(me._id)) {
    return res.status(400).json({ error: "CannotConnectToSelf" });
  }

  const existing = await Connection.findOne({
    $or: [
      { aUserId: me._id, bUserId: target._id },
      { aUserId: target._id, bUserId: me._id },
    ],
  });

  if (existing) return res.status(400).json({ error: "AlreadyConnectedOrPending" });

  const conn = await Connection.create({
    aUserId: me._id,
    bUserId: target._id,
    status: "pending",
  });

  res.status(201).json(conn);
}

export async function acceptConnection(req: Request, res: Response) {
  const me = (req as any).user;
  const { id } = req.params;

  const conn = await Connection.findById(id);
  if (!conn) return res.status(404).json({ error: "NotFound" });

  if (!conn.bUserId.equals(me._id))
    return res.status(403).json({ error: "NotAuthorized" });

  conn.status = "accepted";
  await conn.save();
  res.json(conn);
}

export async function listConnections(req: Request, res: Response) {
  const me = (req as any).user;
  const { event, tag, sort = "createdAt", limit = 20 } = req.query;

  const filter: any = {
    $or: [{ aUserId: me._id }, { bUserId: me._id }],
    status: "accepted",
  };
  if (event) filter.event = event;
  if (tag) filter.tags = tag;

  const connections = await Connection.find(filter)
    .sort({ [sort as string]: -1 })
    .limit(Number(limit))
    .populate("aUserId bUserId", "profile.fullName profile.photoUrl");

  res.json(connections);
}


export async function getStats(req: Request, res: Response) {
  const me = (req as any).user;

  const now = dayjs();
  const startOfWeek = now.startOf("week").toDate();
  const startOfMonth = now.startOf("month").toDate();

  // Total accepted connections
  const total = await Connection.countDocuments({
    $or: [{ aUserId: me._id }, { bUserId: me._id }],
    status: "accepted",
  });


  const thisWeek = await Connection.countDocuments({
    $or: [{ aUserId: me._id }, { bUserId: me._id }],
    status: "accepted",
    createdAt: { $gte: startOfWeek },
  });

  
  const thisMonth = await Connection.countDocuments({
    $or: [{ aUserId: me._id }, { bUserId: me._id }],
    status: "accepted",
    createdAt: { $gte: startOfMonth },
  });

  
  const pending = await Connection.countDocuments({
    bUserId: me._id,
    status: "pending",
  });

  res.json({ total, thisWeek, thisMonth, pending });
}