/**
 * Consistent API response envelope used across every controller.
 *   success(res, 200, "Fetched doctors", { doctors })
 *   fail(res, 404, "Doctor not found")
 */
export function success(res, statusCode, message, data = null) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function fail(res, statusCode, message, errors = null) {
  return res.status(statusCode).json({ success: false, message, errors });
}
