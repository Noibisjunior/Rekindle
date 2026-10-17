import { z } from "zod";

const photoUrlSchema = z.string().refine(
  (value) => {
    if (!value) return true;
    if (/^https?:\/\//i.test(value)) return true;
    return /^data:image\//i.test(value);
  },
  { message: "photoUrl must be a valid URL or data image URL" }
);

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  title: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  bio: z.string().max(300).optional(),
  photoUrl: photoUrlSchema.optional(),
  socials: z
    .object({
      linkedin: z.string().trim().optional(),
      twitter: z.string().trim().optional(),
      github: z.string().trim().optional(),
      instagram: z.string().trim().optional(),
    })
    .partial()
    .optional(),
  tags: z.array(z.string().trim()).min(1).max(10),
});
