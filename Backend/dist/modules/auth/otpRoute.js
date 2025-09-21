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
const otpService = __importStar(require("./otpService"));
const r = (0, express_1.Router)();
r.post("/send-otp", async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "EmailRequired" });
    try {
        await otpService.sendOtp(email);
        res.json({ message: "OTP sent successfully" });
    }
    catch (e) {
        console.error("OTP send error:", e);
        res.status(500).json({ error: "FailedToSendOtp" });
    }
});
r.post("/verify-otp", async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code)
        return res.status(400).json({ error: "MissingParams" });
    try {
        const user = await otpService.verifyOtp(email, code);
        res.json({
            message: "OTP verified successfully",
            user: { id: user.id, email: user.email },
        });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
exports.default = r;
