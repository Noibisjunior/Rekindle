import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const googleTokenSchema = z.object({
  idToken: z.string().min(10), // Google ID token from the frontend
});
