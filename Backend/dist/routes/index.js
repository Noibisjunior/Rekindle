"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("../modules/auth/authRoutes"));
const reminderRoutes_1 = __importDefault(require("../modules/reminders/reminderRoutes"));
const connectionRoutes_1 = __importDefault(require("../modules/connections/connectionRoutes"));
const otpRoute_1 = __importDefault(require("../modules/auth/otpRoute"));
const qrRoutes_1 = __importDefault(require("../modules/qr/qrRoutes"));
const r = (0, express_1.Router)();
r.use('/auth', authRoutes_1.default);
r.use('/', reminderRoutes_1.default);
r.use('/', connectionRoutes_1.default);
r.use('/', qrRoutes_1.default);
r.use("/otp", otpRoute_1.default);
exports.default = r;
