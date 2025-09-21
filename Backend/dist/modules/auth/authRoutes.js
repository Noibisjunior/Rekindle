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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_1 = require("../../middleware/validate");
const authModel_1 = require("./authModel");
const ctrl = __importStar(require("./authController"));
const auth_1 = require("../../middleware/auth");
const userSchema_1 = require("../users/userSchema");
const upload_1 = require("../../middleware/upload");
const userModel_1 = require("../users/userModel");
const otpModel_1 = require("./otpModel");
const crypto_1 = require("../../utils/crypto");
const otpService_1 = require("./otpService");
const jwt_1 = require("../../utils/jwt");
const r = (0, express_1.Router)();
r.post("/signup", (0, validate_1.validate)(authModel_1.signupSchema), ctrl.signup);
r.post("/login", (0, validate_1.validate)(authModel_1.loginSchema), ctrl.login);
r.post("/verify-email", async (req, res) => {
    const { email, code } = req.body;
    try {
        // 1validate OTP
        await (0, otpService_1.verifyOtp)(email, code);
        const user = await userModel_1.User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
        if (!user)
            return res.status(404).json({ error: "UserNotFound" });
        // issue tokens only after verification
        const accessToken = (0, jwt_1.signAccessToken)(user.id);
        const refreshToken = (0, jwt_1.signRefreshToken)(user.id);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.json({
            message: "Email verified successfully",
            user: { id: user.id, email: user.email },
        });
    }
    catch (e) {
        return res.status(400).json({ error: e.message });
    }
});
r.post("/reset-password", async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        const otp = await otpModel_1.Otp.findOne({
            email: email.trim().toLowerCase(),
            code: code.trim(),
        });
        if (!otp)
            return res.status(400).json({ error: "InvalidOtp" });
        if (otp.expiresAt < new Date()) {
            return res.status(400).json({ error: "OTPExpired" });
        }
        const user = await userModel_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "UserNotFound" });
        user.passwordHash = await (0, crypto_1.hashPassword)(newPassword);
        await user.save();
        await otpModel_1.Otp.deleteMany({ email });
        res.json({ message: "Password reset successful" });
    }
    catch (e) {
        res.status(500).json({ error: "ServerError" });
    }
});
r.post("/google", (0, validate_1.validate)(authModel_1.googleTokenSchema), ctrl.google);
r.get("/me", auth_1.requireAuth, ctrl.me);
r.put("/me", auth_1.requireAuth, (0, validate_1.validate)(userSchema_1.updateProfileSchema), ctrl.updateMe);
r.post("/me/photo", auth_1.requireAuth, upload_1.upload.single("photo"), ctrl.uploadPhoto);
r.post("/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken)
            return res.status(401).json({ error: "MissingRefreshToken" });
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const accessToken = (0, jwt_1.signAccessToken)(payload.sub);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
        });
        res.json({ success: true });
    }
    catch (e) {
        res.status(401).json({ error: "InvalidRefreshToken" });
    }
});
exports.default = r;
