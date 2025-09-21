"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(1).max(100),
    title: zod_1.z.string().max(100).optional(),
    company: zod_1.z.string().max(100).optional(),
    bio: zod_1.z.string().max(300).optional(),
    photoUrl: zod_1.z.string().url().optional(),
    socials: zod_1.z
        .object({
        linkedin: zod_1.z.string().url().optional(),
        twitter: zod_1.z.string().url().optional(),
        github: zod_1.z.string().url().optional(),
        instagram: zod_1.z.string().url().optional(),
    })
        .partial()
        .optional(),
    tags: zod_1.z.array(zod_1.z.string().trim()).min(1).max(10),
});
