import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  title: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  bio: z.string().max(300).optional(),
  photoUrl: z.string().url().optional(),
  socials: z
    .object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      github: z.string().url().optional(),
      instagram: z.string().url().optional(),
    })
    .partial()
    .optional(),
  tags: z.array(z.string().trim()).min(1).max(10),
});
