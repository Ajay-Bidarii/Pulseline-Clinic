import { authService } from "./auth.service.js";
import { success, fail } from "../../utils/response.js";
import { StatusCodes } from "../../constans/statusCodes.js";
import { MESSAGES } from "../../constans/messages.js";
import { setRefreshTokenCookie, clearRefreshTokenCookie, getRefreshTokenFromRequest } from "../../utils/cookie.js";

async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    return success(res, StatusCodes.CREATED, MESSAGES.AUTH.REGISTER_SUCCESS, { user });
  } catch (err) {
    if (err.message === "EMAIL_IN_USE") {
      return fail(res, StatusCodes.CONFLICT, MESSAGES.AUTH.EMAIL_IN_USE);
    }
    return fail(res, StatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.GENERIC.SERVER_ERROR);
  }
}

async function login(req, res) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setRefreshTokenCookie(res, refreshToken);
    return success(res, StatusCodes.OK, MESSAGES.AUTH.LOGIN_SUCCESS, { user, accessToken });
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS") {
      return fail(res, StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }
    return fail(res, StatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.GENERIC.SERVER_ERROR);
  }
}

async function refresh(req, res) {
  const token = getRefreshTokenFromRequest(req);
  if (!token) return fail(res, StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);

  try {
    const { user, accessToken, refreshToken } = await authService.refresh(token);
    setRefreshTokenCookie(res, refreshToken);
    return success(res, StatusCodes.OK, MESSAGES.AUTH.TOKEN_REFRESHED, { user, accessToken });
  } catch {
    clearRefreshTokenCookie(res);
    return fail(res, StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
  }
}

async function logout(_req, res) {
  clearRefreshTokenCookie(res);
  return success(res, StatusCodes.OK, MESSAGES.AUTH.LOGOUT_SUCCESS);
}

async function me(req, res) {
  return success(res, StatusCodes.OK, "Current user", { user: req.user });
}

async function requestOtp(req, res) {
  await authService.requestOtp(req.body.email);
  return success(res, StatusCodes.OK, MESSAGES.AUTH.OTP_SENT);
}

async function confirmOtp(req, res) {
  const result = await authService.confirmOtp(req.body.email, req.body.code);
  if (!result.valid) return fail(res, StatusCodes.BAD_REQUEST, result.reason || MESSAGES.AUTH.OTP_INVALID);
  return success(res, StatusCodes.OK, "Verified.");
}

export const authController = { register, login, refresh, logout, me, requestOtp, confirmOtp };
