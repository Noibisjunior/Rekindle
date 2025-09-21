"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyByEmail = notifyByEmail;
exports.notifyByPush = notifyByPush;
const emailService_1 = require("./emailService");
async function notifyByEmail(to, subject, body) {
    return (0, emailService_1.sendEmail)(to, subject, `<p>${body}</p>`);
}
// stub - placeholder for FCM/OneSignal later
async function notifyByPush(_deviceToken, _title, _body) {
    /* no-op for now */
}
