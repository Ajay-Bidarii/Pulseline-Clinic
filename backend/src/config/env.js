import "dotenv/config";

const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET", "COOKIE_SECRET"];

function validate() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length && process.env.NODE_ENV !== "test") {
    // eslint-disable-next-line no-console
    console.warn(
      `[env] Missing recommended environment variables: ${missing.join(", ")}. ` +
        `Copy .env.example to .env and fill these in before running the server for real.`
    );
  }
}

validate();

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },

  cookieSecret: process.env.COOKIE_SECRET,

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || "Pulseline Clinic <no-reply@pulseline.clinic>",
  },

  esewa: {
    merchantCode: process.env.ESEWA_MERCHANT_CODE,
    secretKey: process.env.ESEWA_SECRET_KEY,
    successUrl: process.env.ESEWA_SUCCESS_URL,
    failureUrl: process.env.ESEWA_FAILURE_URL,
  },

  khalti: {
    secretKey: process.env.KHALTI_SECRET_KEY,
    returnUrl: process.env.KHALTI_RETURN_URL,
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 200,
  },
};
