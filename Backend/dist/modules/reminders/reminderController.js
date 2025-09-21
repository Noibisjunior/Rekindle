"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.setReminder = setReminder;
exports.listReminders = listReminders;
exports.cancel = cancel;
const svc = __importStar(require("./reminderService"));
async function setReminder(req, res) {
    try {
        const me = req.user;
        const { connectionId, remindAt, channel = "push", message } = req.body;
        if (!connectionId || !remindAt || !message) {
            return res.status(400).json({ error: "MissingFields" });
        }
        const reminder = await svc.createReminder(me._id, connectionId, new Date(remindAt), channel, message);
        res.status(201).json(reminder);
    }
    catch (err) {
        console.error("Error creating reminder:", err);
        res.status(500).json({ error: "ServerError" });
    }
}
async function listReminders(req, res) {
    const me = req.user;
    const reminders = await svc.listReminders(me._id);
    res.json(reminders);
}
async function cancel(req, res) {
    const me = req.user;
    const { id } = req.params;
    const r = await svc.cancelReminder(me._id, id);
    if (!r)
        return res.status(404).json({ error: "NotFound" });
    res.json({ ok: true });
}
