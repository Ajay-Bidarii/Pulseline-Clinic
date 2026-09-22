import { verifyAccessToken } from "../utils/jwt.js";
import { fail } from "../utils/response.js";
import { StatusCodes } from "../constans/statusCodes.js";
import { MESSAGES } from "../constans/messages.js";

/** Verifies the Bearer access token and attaches `req.user`. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return fail(res, StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload; // { id, role, email }
    next();
  } catch {
    return fail(res, StatusCodes.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
  }
}

/** Restricts a route to one or more roles. Use after requireAuth. */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return fail(res, StatusCodes.FORBIDDEN, MESSAGES.AUTH.FORBIDDEN);
    }
    next();
  };
}
