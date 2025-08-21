import { Schema, model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash?: string;
  googleId?: string;

  profile: {
    fullName: string;
    title?: string;
    company?: string;
    bio?: string;
    photoUrl?: string;
    socials?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      instagram?: string;
    };
    tags: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

const socialsSchema = new Schema<IUser["profile"]["socials"]>(
  {
    linkedin: String,
    twitter: String,
    github: String,
    instagram: String,
  },
  { _id: false }
);

const profileSchema = new Schema<IUser["profile"]>(
  {
    fullName: { type: String, default: "", trim: true, maxlength: 100 },
    title: { type: String, trim: true, maxlength: 100 },
    company: { type: String, trim: true, maxlength: 100 },
    bio: { type: String, trim: true, maxlength: 300 },
    photoUrl: { type: String, trim: true },
    socials: { type: socialsSchema, default: {} },
    tags: {
      type: [String],
      default: [], 
      validate: [
        (arr: string[]) => arr.length <= 10,
        "You can have at most 10 tags",
      ],
    },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    googleId: { type: String },
    profile: { type: profileSchema, default: {} },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
