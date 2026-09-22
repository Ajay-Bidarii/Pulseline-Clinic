import { prisma } from "../../config/database.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { issueOTP, verifyOTP } from "../../utils/otp.js";

async function register({ fullName, email, password, phone, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("EMAIL_IN_USE");
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      role,
      password: hashed,
      // Role-specific profile rows are created with sensible empty defaults;
      // patient/doctor onboarding flows fill these in afterwards.
      ...(role === "PATIENT" ? { patient: { create: { allergies: [] } } } : {}),
      ...(role === "DOCTOR" ? { doctor: { create: { qualifications: [] } } } : {}),
    },
  });

  return sanitizeUser(user);
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    const err = new Error("INVALID_CREDENTIALS");
    throw err;
  }

  const matches = await comparePassword(password, user.password);
  if (!matches) {
    const err = new Error("INVALID_CREDENTIALS");
    throw err;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return issueTokens(user);
}

function issueTokens(user) {
  const payload = { id: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { user: sanitizeUser(user), accessToken, refreshToken };
}

async function refresh(refreshToken) {
  const payload = verifyRefreshToken(refreshToken); // throws if invalid/expired
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user || !user.isActive) {
    const err = new Error("UNAUTHORIZED");
    throw err;
  }
  return issueTokens(user);
}

async function requestOtp(email, type = "EMAIL_VERIFICATION") {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return; // don't leak account existence
  await issueOTP(user.id, type, user.email);
}

async function confirmOtp(email, code, type = "EMAIL_VERIFICATION") {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { valid: false, reason: "No account found." };
  const result = await verifyOTP(user.id, type, code);
  if (result.valid && type === "EMAIL_VERIFICATION") {
    await prisma.user.update({ where: { id: user.id }, data: { isEmailVerified: true } });
  }
  return result;
}

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

export const authService = { register, login, refresh, requestOtp, confirmOtp, sanitizeUser };
