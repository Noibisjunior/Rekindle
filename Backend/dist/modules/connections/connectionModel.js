"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const mongoose_1 = require("mongoose");
const connectionSchema = new mongoose_1.Schema({
    aUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    bUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: String, trim: true },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
}, { timestamps: true });
exports.Connection = (0, mongoose_1.model)("Connection", connectionSchema);
