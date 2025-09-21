"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const socialsSchema = new mongoose_1.Schema({
    linkedin: String,
    twitter: String,
    github: String,
    instagram: String,
}, { _id: false });
const profileSchema = new mongoose_1.Schema({
    fullName: { type: String, default: "", trim: true, maxlength: 100 },
    title: { type: String, trim: true, maxlength: 100 },
    company: { type: String, trim: true, maxlength: 100 },
    bio: { type: String, trim: true, maxlength: 300 },
    photoUrl: { type: String, trim: true },
    socials: { type: socialsSchema, default: {} },
    tags: {
        type: [String],
        default: [],
        validate: [
            (arr) => arr.length <= 10,
            "You can have at most 10 tags",
        ],
    },
}, { _id: false });
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String },
    isVerified: { type: Boolean, default: false },
    googleId: { type: String },
    profile: { type: profileSchema, default: {} },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
