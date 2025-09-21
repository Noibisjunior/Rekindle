"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupLocal = signupLocal;
exports.loginLocal = loginLocal;
exports.loginWithGoogleIdToken = loginWithGoogleIdToken;
const userModel_1 = require("../users/userModel");
const crypto_1 = require("../../utils/crypto");
const jwt_1 = require("../../utils/jwt");
const google_auth_library_1 = require("google-auth-library");
const env_1 = require("../../config/env");
const otpService_1 = require("./otpService");
const googleClient = env_1.env.GOOGLE_CLIENT_ID
    ? new google_auth_library_1.OAuth2Client(env_1.env.GOOGLE_CLIENT_ID)
    : null;
/**
 * Signup with email, password and creates user and sends OTP
 */
async function signupLocal(email, password, name) {
    const existing = await userModel_1.User.findOne({ email });
    if (existing)
        throw new Error("EmailInUse");
    const passwordHash = await (0, crypto_1.hashPassword)(password);
    const user = await userModel_1.User.create({
        email,
        passwordHash,
        name,
        isVerified: false,
    });
    // send OTP for email verification
    await (0, otpService_1.sendOtp)(email);
    return user; // controller handles response
}
/**
 * Login with email and password
 * - blocks if user not verified
 */
async function loginLocal(email, password) {
    const user = await userModel_1.User.findOne({ email });
    if (!user || !user.passwordHash)
        throw new Error("InvalidCredentials");
    const ok = await (0, crypto_1.verifyPassword)(password, user.passwordHash);
    if (!ok)
        throw new Error("InvalidCredentials");
    if (!user.isVerified)
        throw new Error("NotVerified");
    return issueTokens(user.id);
}
/**
 * Google login → creates user if not exists
 * - auto-verifies since Google guarantees email
 */
async function loginWithGoogleIdToken(idToken) {
    if (!googleClient)
        throw new Error("GoogleNotConfigured");
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env_1.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email)
        throw new Error("GoogleNoEmail");
    let user = await userModel_1.User.findOne({ email: payload.email });
    if (!user) {
        user = await userModel_1.User.create({
            email: payload.email,
            googleId: payload.sub,
            name: payload.name,
            photoUrl: payload.picture,
            isVerified: true, // 
        });
    }
    else if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
    }
    return issueTokens(user.id);
}
/**
 * Issue access + refresh tokens
 */
function issueTokens(userId) {
    const accessToken = (0, jwt_1.signAccessToken)(userId);
    const refreshToken = (0, jwt_1.signRefreshToken)(userId);
    return { accessToken, refreshToken };
}
