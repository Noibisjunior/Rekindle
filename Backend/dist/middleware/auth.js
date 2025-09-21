"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
const userModel_1 = require("../modules/users/userModel");
async function requireAuth(req, res, next) {
    // Read JWT from cookies
    const token = req.cookies?.accessToken;
    if (!token) {
        return res.status(401).json({ error: "MissingToken" });
    }
    try {
        const payload = (0, jwt_1.verifyAccessToken)(token);
        const user = await userModel_1.User.findById(payload.sub).select("email profile");
        if (!user) {
            return res.status(401).json({ error: "InvalidToken" });
        }
        req.user = user;
        next();
    }
    catch {
        return res.status(401).json({ error: "InvalidToken" });
    }
}
