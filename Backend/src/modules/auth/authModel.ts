import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
    name: z.string().optional(),
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const googleTokenSchema = z.object({
  idToken: z.string().min(10), // Google ID token from the frontend
});
