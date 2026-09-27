import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { fail } from "./utils/response.js";
import { StatusCodes } from "./constans/statusCodes.js";
import { MESSAGES } from "./constans/messages.js";

export function createApp() {
  const app = express();

  // Render (and most PaaS hosts) terminate TLS at a proxy in front of the
  // app, so without this Express would see every request as http:// and
  // Secure cookies / req.secure / rate-limit IP detection would misbehave.
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, "");
        const isAllowed =
          env.clientUrls.some((u) => u.replace(/\/+$/, "") === cleanOrigin) ||
          cleanOrigin.endsWith(".onrender.com") ||
          cleanOrigin.endsWith(".vercel.app") ||
          cleanOrigin.includes("localhost");
        if (isAllowed) return callback(null, true);
        return callback(null, true);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(env.cookieSecret));

  app.use(
    rateLimit({
      windowMs: env.rateLimit.windowMs,
      max: env.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get("/health", (_req, res) => res.json({ status: "ok", env: env.nodeEnv }));

  app.use("/api/v1", routes);

  // 404
  app.use((req, res) => fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND));

  // Central error handler — Zod/Prisma/unexpected errors all land here.
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (env.nodeEnv === "development") {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    return fail(res, StatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.GENERIC.SERVER_ERROR);
  });

  return app;
}
