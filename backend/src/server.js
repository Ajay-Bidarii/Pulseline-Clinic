import http from "node:http";
import { execSync } from "node:child_process";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";

const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const clean = origin.replace(/\/+$/, "");
      if (clean.endsWith(".onrender.com") || clean.endsWith(".vercel.app") || clean.includes("localhost") || env.clientUrls.includes(clean)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  },
});

// Controllers reach the socket server via req.app.get("io") — see queue.controller.js
// and appointment.controller.js for where events get emitted.
app.set("io", io);

io.on("connection", (socket) => {
  // Rooms let a doctor's dashboard subscribe only to their own queue updates,
  // and the public waiting-room screen subscribe to everything.
  socket.on("join:doctor", (doctorId) => socket.join(`doctor:${doctorId}`));
  socket.on("join:display", () => socket.join("display"));
});

async function start() {
  try {
    await prisma.$connect();
    console.log("[db] Connected to PostgreSQL via Prisma.");

    // Automatically push schema to PostgreSQL if tables don't exist yet
    try {
      console.log("[db] Syncing database schema with Prisma...");
      execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
      console.log("[db] Database schema synced successfully.");

      // Check if seeded with doctors
      const doctorCount = await prisma.doctor.count().catch(() => 0);
      if (doctorCount === 0) {
        console.log("[db] Database is empty. Seeding initial care team & departments...");
        execSync("node prisma/seed.js", { stdio: "inherit" });
        console.log("[db] Seed completed successfully.");
      }
    } catch (syncErr) {
      console.warn("[db] Schema push/seed notice:", syncErr.message);
    }
  } catch (err) {
    console.error(
      "[db] Could not connect to the database. Set DATABASE_URL in environment:",
      err.message
    );
  }

  server.listen(env.port, () => {
    console.log(`[server] Pulseline Clinic API listening on port ${env.port}`);
  });
}

start();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
