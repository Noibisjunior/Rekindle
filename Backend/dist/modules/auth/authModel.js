"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleTokenSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.googleTokenSchema = zod_1.z.object({
    idToken: zod_1.z.string().min(10), // Google ID token from the frontend
});
