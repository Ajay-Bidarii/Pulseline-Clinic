import { COOKIE_NAMES } from "../config/constants.js";
import { env } from "../config/env.js";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function setRefreshTokenCookie(res, token) {
  const isProd = env.nodeEnv === "production";
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, token, {
    httpOnly: true,
    // Cross-site (frontend and backend on different Render domains) requires
    // SameSite=None, which browsers only honor when Secure is also set.
    // Locally, frontend and backend are both http://localhost, so Lax/insecure
    // is correct there instead.
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: THIRTY_DAYS_MS,
    signed: true,
  });
}

export function clearRefreshTokenCookie(res) {
  const isProd = env.nodeEnv === "production";
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
}

export function getRefreshTokenFromRequest(req) {
  return req.signedCookies?.[COOKIE_NAMES.REFRESH_TOKEN] || null;
}
