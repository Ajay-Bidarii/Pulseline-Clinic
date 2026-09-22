import { fail } from "../utils/response.js";
import { StatusCodes } from "../constans/statusCodes.js";
import { MESSAGES } from "../constans/messages.js";

/**
 * Wraps a Zod schema as Express middleware.
 * Usage: router.post("/login", validate(loginSchema), authController.login)
 */
export function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return fail(res, StatusCodes.UNPROCESSABLE_ENTITY, MESSAGES.GENERIC.VALIDATION_FAILED, errors);
    }
    req[source] = result.data;
    next();
  };
}
