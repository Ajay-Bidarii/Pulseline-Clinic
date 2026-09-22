import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    });
  }
  return transporter;
}

export async function sendOTPEmail(to, code) {
  if (!env.smtp.host) {
    // eslint-disable-next-line no-console
    console.log(`[email:dev] Would send OTP ${code} to ${to} (SMTP not configured).`);
    return;
  }
  await getTransporter().sendMail({
    from: env.smtp.from,
    to,
    subject: "Your Pulseline Clinic verification code",
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
  });
}

export async function sendMail({ to, subject, text, html }) {
  if (!env.smtp.host) {
    // eslint-disable-next-line no-console
    console.log(`[email:dev] Would send "${subject}" to ${to} (SMTP not configured).`);
    return;
  }
  await getTransporter().sendMail({ from: env.smtp.from, to, subject, text, html });
}
