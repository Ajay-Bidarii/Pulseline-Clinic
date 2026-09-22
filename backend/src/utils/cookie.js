import { COOKIE_NAMES } from "../config/constants.js";
import { env } from "../config/env.js";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function setRefreshTokenCookie(res, token) {
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: THIRTY_DAYS_MS,
    signed: true,
  });
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN);
}

export function getRefreshTokenFromRequest(req) {
  return req.signedCookies?.[COOKIE_NAMES.REFRESH_TOKEN] || null;
}
