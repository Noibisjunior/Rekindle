import { Request, Response } from 'express';
import * as svc from './authService';
import { User } from "../users/userModel";
import cloudinary from "../../config/cloudinary";

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, confirmPassword } = req.body;
    const tokens = await svc.signupLocal(email, password, confirmPassword);
    return res.status(201).json({ message: "Signup successful. Please verify your email.", email });
  } catch (e: any) {
    if (e.message === 'EmailInUse') return res.status(409).json({ error: 'EmailInUse' });
    return res.status(500).json({ error: 'ServerError' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const tokens = await svc.loginLocal(email, password);
    return res.json(tokens);
  } catch (e: any) {
    if (e.message === 'InvalidCredentials') return res.status(401).json({ error: 'InvalidCredentials' });
    return res.status(500).json({ error: 'ServerError' });
  }
}

export async function google(req: Request, res: Response) {
  try {
    const { idToken } = req.body;
    const tokens = await svc.loginWithGoogleIdToken(idToken);
    return res.json(tokens);
  } catch (e: any) {
    if (e.message === 'GoogleNotConfigured') return res.status(500).json({ error: 'GoogleNotConfigured' });
    return res.status(401).json({ error: 'GoogleAuthFailed' });
  }
}

export async function me(req: Request, res: Response) {
  const user = (req as any).user;
  return res.json({ user });
}

export async function updateMe(req: Request, res: Response) {
  const user = await User.findByIdAndUpdate(
    (req as any).user._id,
    { $set: { profile: req.body } },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ error: "NotFound" });
  res.json({ user });
}


export async function uploadPhoto(req: Request, res: Response) {
  try {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: "NoFile" });

    // upload buffer to cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "connectlink/profiles",
        resource_type: "image",
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
      },
      async (err, result) => {
        if (err || !result) return res.status(500).json({ error: "UploadFailed" });

        // save photoUrl to user profile
        const user = await User.findByIdAndUpdate(
          (req as any).user._id,
          { $set: { "profile.photoUrl": result.secure_url } },
          { new: true }
        );

        return res.json({ photoUrl: result.secure_url, user });
      }
    );

    // pipe buffer
    const stream = result;
    stream.end(file.buffer);

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "ServerError" });
  }
}

//for frontend
// const formData = new FormData();
// formData.append("photo", file); // file from input or camera

// await fetch("/v1/auth/me/photo", {
//   method: "POST",
//   headers: { Authorization: `Bearer ${token}` },
//   body: formData,
// });
