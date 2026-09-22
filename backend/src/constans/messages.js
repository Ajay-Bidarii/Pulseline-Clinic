export const MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: "Invalid email or password.",
    EMAIL_IN_USE: "An account with this email already exists.",
    REGISTER_SUCCESS: "Account created successfully.",
    LOGIN_SUCCESS: "Signed in successfully.",
    LOGOUT_SUCCESS: "Signed out successfully.",
    TOKEN_REFRESHED: "Session refreshed.",
    UNAUTHORIZED: "You must be signed in to do that.",
    FORBIDDEN: "You don't have permission to do that.",
    OTP_SENT: "A verification code has been sent.",
    OTP_INVALID: "That code is invalid or has expired.",
  },
  GENERIC: {
    NOT_FOUND: "The requested resource was not found.",
    VALIDATION_FAILED: "Some fields need your attention.",
    SERVER_ERROR: "Something went wrong on our end. Please try again.",
  },
  APPOINTMENT: {
    SLOT_UNAVAILABLE: "That time slot is no longer available.",
    CREATED: "Appointment booked.",
    UPDATED: "Appointment updated.",
    CANCELLED: "Appointment cancelled.",
  },
  BILLING: {
    INVOICE_CREATED: "Invoice created.",
    PAYMENT_VERIFIED: "Payment verified and invoice marked paid.",
    PAYMENT_FAILED: "We couldn't verify that payment.",
  },
};
