import http from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";

const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: env.clientUrl, credentials: true },
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
    // eslint-disable-next-line no-console
    console.log("[db] Connected to MySQL via Prisma.");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      "[db] Could not connect to the database. Set DATABASE_URL in .env and run `npm run prisma:migrate`.",
      err.message
    );
  }

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Pulseline Clinic API listening on http://localhost:${env.port}`);
  });
}

start();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
