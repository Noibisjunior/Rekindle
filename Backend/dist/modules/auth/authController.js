"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
exports.google = google;
exports.me = me;
exports.updateMe = updateMe;
exports.uploadPhoto = uploadPhoto;
const svc = __importStar(require("./authService"));
const userModel_1 = require("../users/userModel");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
async function signup(req, res) {
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
    }
    catch (e) {
        if (e.message === "EmailInUse") {
            return res.status(409).json({ error: "EmailInUse" });
        }
        console.error("Signup error:", e);
        return res.status(500).json({ error: "ServerError" });
    }
}
async function login(req, res) {
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
    }
    catch (e) {
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
async function google(req, res) {
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
    }
    catch (e) {
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
async function me(req, res) {
    const user = await userModel_1.User.findById(req.user._id)
        .select("email profile");
    if (!user)
        return res.status(404).json({ error: "NotFound" });
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
async function updateMe(req, res) {
    try {
        const user = await userModel_1.User.findByIdAndUpdate(req.user._id, { $set: { profile: req.body } }, { new: true, runValidators: true });
        if (!user)
            return res.status(404).json({ error: "NotFound" });
        res.json({ user });
    }
    catch (e) {
        console.error("Update profile error:", e);
        res.status(500).json({ error: "ServerError" });
    }
}
/**
 * Upload user profile photo → Cloudinary
 */
async function uploadPhoto(req, res) {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ error: "NoFile" });
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder: "connectlink/profiles",
            resource_type: "image",
            transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
            ],
        }, async (err, result) => {
            if (err || !result) {
                console.error("Cloudinary error:", err);
                return res.status(500).json({ error: "UploadFailed" });
            }
            const user = await userModel_1.User.findByIdAndUpdate(req.user._id, { $set: { "profile.photoUrl": result.secure_url } }, { new: true });
            return res.json({ photoUrl: result.secure_url, user });
        });
        // pipe buffer to Cloudinary
        uploadStream.end(file.buffer);
    }
    catch (e) {
        console.error("Upload photo error:", e);
        return res.status(500).json({ error: "ServerError" });
    }
}
