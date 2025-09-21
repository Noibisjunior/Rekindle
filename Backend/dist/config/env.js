"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.string().default('4000'),
    MONGO_URI: zod_1.z.string().url(),
    PUBLIC_APP_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    GOOGLE_CLIENT_ID: zod_1.z.string().min(10),
    CLOUDINARY_CLOUD_NAME: zod_1.z.string(),
    CLOUDINARY_API_KEY: zod_1.z.string(),
    CLOUDINARY_API_SECRET: zod_1.z.string(),
    SMTP_USER: zod_1.z.string().email(),
    SMTP_PASS: zod_1.z.string().min(8),
    SMTP_FROM: zod_1.z.string().min(10),
});
exports.env = envSchema.parse(process.env);
