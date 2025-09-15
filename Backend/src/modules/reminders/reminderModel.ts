import { Schema, model, Types } from "mongoose";

export interface IReminder {
  _id: Types.ObjectId;
  userId: Types.ObjectId;          
  connectionId: Types.ObjectId;   
  remindAt: Date;                
  channel: "push" | "email";      
  message: string;
  sent: boolean;
  createdAt: Date;
   updatedAt: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    connectionId: { type: Schema.Types.ObjectId, ref: "Connection", required: true },
    remindAt: { type: Date, required: true },
    channel: { type: String, enum: ["push", "email"], default: "email" },
    message: { type: String, required: true },
    sent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Reminder = model<IReminder>("Reminder", reminderSchema);
