import { Schema, model, Types } from "mongoose";

export interface IConnection {
  _id: Types.ObjectId;
  aUserId: Types.ObjectId;
  bUserId: Types.ObjectId;
  event?: string;
  tags?: string[];
  status: "pending" | "accepted";
  createdAt: Date;
}

const connectionSchema = new Schema<IConnection>(
  {
    aUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: String, trim: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
  },
  { timestamps: true }
);

export const Connection = model<IConnection>("Connection", connectionSchema);
