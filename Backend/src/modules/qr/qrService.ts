import QRCode from "qrcode";
import { nanoid } from "nanoid"; //specify uid
import { User } from "../users/userModel";

export async function provisionUserQr(userId: string) {
  const code = nanoid(10);
  const url = `${process.env.PUBLIC_APP_URL}/u/${code}`;
  const png = await QRCode.toDataURL(url, { margin: 0, width: 256 });

  await User.findByIdAndUpdate(userId, { $set: { "qr.code": code, "qr.url": url } });
  return { code, url, png };
}
