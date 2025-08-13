import { Schema, model, Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash?: string;      
  googleId?: string;              
  name?: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    googleId: { type: String, index: true },
    name: String,
    photoUrl: String,
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
