import { Schema, model, Types } from "mongoose";

export interface IOtp {
  _id: Types.ObjectId;
  email: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  used: boolean; //  track if OTP was used
}

const otpSchema = new Schema<IOtp>(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
    verified: { type: Boolean, default: false },
    used: { type: Boolean, default: false }, // prevent reuse
  },
  { timestamps: true }
);

// Auto-delete expired OTPs from DB
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = model<IOtp>("Otp", otpSchema);
