"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provisionUserQr = provisionUserQr;
const qrcode_1 = __importDefault(require("qrcode"));
const nanoid_1 = require("nanoid");
const userModel_1 = require("../users/userModel");
const env_1 = require("../../config/env");
// async function resetQRCodes() {
//   await connectDB(env.MONGO_URI);
//   const users = await User.find({});
//   for (const user of users) {
//     if (!user.qr?.code) {
//       const code = nanoid(10);
//       const url = `${env.PUBLIC_APP_URL}/u/${code}`;
//       user.qr = { code, url };
//       await user.save();
//       console.log(`Assigned QR to user ${user.email}: ${code}`);
//     }
//   }
//   console.log("QR reset completed.");
//   process.exit(0);
// }
// resetQRCodes();
async function provisionUserQr(userId) {
    const user = await userModel_1.User.findById(userId);
    // If user already has a QR, reuse it (stable mapping)
    if (user?.qr?.code && user?.qr?.url) {
        const png = await qrcode_1.default.toDataURL(user.qr.url, { margin: 0, width: 256 });
        return { code: user.qr.code, url: user.qr.url, png };
    }
    // Otherwise generate a new one once
    const code = (0, nanoid_1.nanoid)(10);
    const url = `${env_1.env.PUBLIC_APP_URL}/u/${code}`;
    const png = await qrcode_1.default.toDataURL(url, { margin: 0, width: 256 });
    await userModel_1.User.findByIdAndUpdate(userId, {
        $set: { "qr.code": code, "qr.url": url },
    });
    return { code, url, png };
}
