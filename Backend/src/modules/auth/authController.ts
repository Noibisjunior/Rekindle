import { Request, Response } from "express";
import * as svc from "./authService";
import { User } from "../users/userModel";
import cloudinary from "../../config/cloudinary";

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, confirmPassword } = req.body;

    // if (password !== confirmPassword) {
    //   return res.status(400).json({ error: "PasswordMismatch" });
    // }

    const user = await svc.signupLocal(email, password);
    return res.status(201).json({
      message: "Signup successful. Please verify your email with the OTP sent.",
      email: user.email,
    });
  } catch (e: any) {
    if (e.message === "EmailInUse") {
      return res.status(409).json({ error: "EmailInUse" });
    }
    console.error("Signup error:", e);
    return res.status(500).json({ error: "ServerError" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const tokens = await svc.loginLocal(email, password);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.json({ success: true });
  } catch (e: any) {
    if (e.message === "InvalidCredentials") {
      return res.status(401).json({ error: "InvalidCredentials" });
    }
    if (e.message === "NotVerified") {
      return res.status(403).json({ error: "NotVerified" });
    }
    console.error("Login error:", e);
    return res.status(500).json({ error: "ServerError" });
  }
}

/**
 * Google login (auto verified if Google returns valid email)
 */
export async function google(req: Request, res: Response) {
  try {
    const { idToken } = req.body;
    const tokens = await svc.loginWithGoogleIdToken(idToken);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (e: any) {
    if (e.message === "GoogleNotConfigured") {
      return res.status(500).json({ error: "GoogleNotConfigured" });
    }
    console.error("Google login error:", e);
    return res.status(401).json({ error: "GoogleAuthFailed" });
  }
}

/**
 * Get logged-in user info
 */
export async function me(req: Request, res: Response) {
  const user = await User.findById((req as any).user._id)
    .select("email profile");
  if (!user) return res.status(404).json({ error: "NotFound" });

  res.json({
    user: {
      id: user._id,
      email: user.email,
      name: user.profile?.fullName ?? null,
      photoUrl: user.profile?.photoUrl ?? null,
      linkedin: user.profile?.socials?.linkedin ?? null,
      tags: user.profile?.tags ?? [],
    }
  });
}

/**
 * Update logged-in user's profile
 */
export async function updateMe(req: Request, res: Response) {
  try {
    const user = await User.findByIdAndUpdate(
      (req as any).user._id,
      { $set: { profile: req.body } },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ error: "NotFound" });
    res.json({ user });
  } catch (e) {
    console.error("Update profile error:", e);
    res.status(500).json({ error: "ServerError" });
  }
}

/**
 * Upload user profile photo → Cloudinary
 */
export async function uploadPhoto(req: Request, res: Response) {
  try {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: "NoFile" });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "connectlink/profiles",
        resource_type: "image",
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
        ],
      },
      async (err, result) => {
        if (err || !result) {
          console.error("Cloudinary error:", err);
          return res.status(500).json({ error: "UploadFailed" });
        }

        const user = await User.findByIdAndUpdate(
          (req as any).user._id,
          { $set: { "profile.photoUrl": result.secure_url } },
          { new: true }
        );

        return res.json({ photoUrl: result.secure_url, user });
      }
    );

    // pipe buffer to Cloudinary
    uploadStream.end(file.buffer);
  } catch (e) {
    console.error("Upload photo error:", e);
    return res.status(500).json({ error: "ServerError" });
  }
}
