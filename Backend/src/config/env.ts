import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000'),
  ALLOW_LOCAL_FALLBACK: z.string().optional().default('true'),
  MONGO_URI: z.string().url().default('mongodb://localhost:27017/rekindle_db'),
  PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(32).default('development_secret_key_1234567890'),
  JWT_REFRESH_SECRET: z.string().min(32).default('development_refresh_secret_key_1234567890'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_FROM: z.string().optional().default('no-reply@rekindle.local'),
  SENDLIBERTY_API_KEY: z.string().optional().default(''),
  SENDLIBERTY_API_URL: z.string().url().optional().default('https://sendliberty.com/api/send'),
  SENDLIBERTY_FROM: z.string().optional().default(''),
  REDIS_HOST: z.string().optional().default('localhost'),
  REDIS_PORT: z.string().optional().default('6379'),
  REDIS_PASSWORD: z.string().optional().default(''),
  LOG_LEVEL: z.string().optional().default('info'),
});

export const env = envSchema.parse(process.env);
