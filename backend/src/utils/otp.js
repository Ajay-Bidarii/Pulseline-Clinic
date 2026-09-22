import { prisma } from "../config/database.js";
import { generateNumericCode } from "./crypto.js";
import { OTP_EXPIRY_MINUTES, OTP_LENGTH, OTP_MAX_ATTEMPTS } from "../config/constants.js";
import { sendOTPEmail } from "./email.js";

export async function issueOTP(userId, type, email) {
  const code = generateNumericCode(OTP_LENGTH);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.oTP.create({ data: { userId, type, code, expiresAt } });
  await sendOTPEmail(email, code);
  return { expiresAt };
}

export async function verifyOTP(userId, type, code) {
  const otp = await prisma.oTP.findFirst({
    where: { userId, type, verified: false },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return { valid: false, reason: "No pending code found." };
  if (otp.expiresAt < new Date()) return { valid: false, reason: "Code expired." };
  if (otp.attempts >= OTP_MAX_ATTEMPTS) return { valid: false, reason: "Too many attempts." };

  if (otp.code !== code) {
    await prisma.oTP.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return { valid: false, reason: "Incorrect code." };
  }

  await prisma.oTP.update({ where: { id: otp.id }, data: { verified: true } });
  return { valid: true };
}
