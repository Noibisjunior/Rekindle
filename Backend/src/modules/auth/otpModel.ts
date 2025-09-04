import { Schema, model, Types } from "mongoose";

export interface IOtp {
  _id: Types.ObjectId;
  email: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
}

const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Otp = model<IOtp>("Otp", otpSchema);
