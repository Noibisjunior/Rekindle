import { sendEmail } from "./emailService";

export async function notifyByEmail(to: string, subject: string, body: string) {
  return sendEmail(to, subject, `<p>${body}</p>`);
}

// stub - placeholder for FCM/OneSignal later
export async function notifyByPush(_deviceToken: string, _title: string, _body: string) {
  /* no-op for now */
}
