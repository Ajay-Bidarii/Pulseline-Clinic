import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// A single shared Prisma Client instance for the whole process.
// In dev with nodemon this can create many clients on hot-reload; guard via globalThis.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__prisma__ ||
  new PrismaClient({
    log: env.nodeEnv === "development" ? ["warn", "error"] : ["error"],
  });

if (env.nodeEnv !== "production") {
  globalForPrisma.__prisma__ = prisma;
}
