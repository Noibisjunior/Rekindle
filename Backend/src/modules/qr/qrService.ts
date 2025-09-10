import QRCode from "qrcode";
import { nanoid } from "nanoid";
import { User } from "../users/userModel";
import { connectDB } from '../../config/db';
import { env } from './config/env';


// async function resetQRCodes() {
//   await connectDB(process.env.MONGO_URI);

//   const users = await User.find({});
//   for (const user of users) {
//     if (!user.qr?.code) {
//       const code = nanoid(10);
//       const url = `${process.env.PUBLIC_APP_URL}/u/${code}`;
//       user.qr = { code, url };
//       await user.save();
//       console.log(`Assigned QR to user ${user.email}: ${code}`);
//     }
//   }

//   console.log("QR reset completed.");
//   process.exit(0);
// }

// resetQRCodes();


export async function provisionUserQr(userId: string) {
  const user = await User.findById(userId);

  // If user already has a QR, reuse it (stable mapping)
  if (user?.qr?.code && user?.qr?.url) {
    const png = await QRCode.toDataURL(user.qr.url, { margin: 0, width: 256 });
    return { code: user.qr.code, url: user.qr.url, png };
  }

  // Otherwise generate a new one once
  const code = nanoid(10);
  const url = `${process.env.PUBLIC_APP_URL}/u/${code}`;
  const png = await QRCode.toDataURL(url, { margin: 0, width: 256 });

  await User.findByIdAndUpdate(userId, {
    $set: { "qr.code": code, "qr.url": url },
  });

  return { code, url, png };
}

