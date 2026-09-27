import { Server } from "socket.io";
import { prisma } from "./database.js";
import { env } from "./env.js";
import { verifyAccessToken } from "../utils/jwt.js";

let io = null;

/**
 * Creates and configures the Socket.IO server on the shared HTTP server.
 * Call this once from server.js — never construct `new Server(...)` elsewhere.
 */
export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientUrls,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Sockets presenting a JWT authenticate with it (same token the REST API
  // uses). Connections with no token are allowed through as anonymous guests
  // so the public waiting-room display can receive live queue updates — they
  // never join a role or entity room, so this is not an authorization bypass.
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        socket.user = null;
        return next();
      }

      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { patient: true, doctor: true },
      });

      if (!user || !user.isActive) {
        return next(new Error("Unauthorized: User not found or inactive"));
      }

      socket.user = user;
      socket.userId = user.id;
      socket.role = user.role;
      next();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[Socket] Authentication error:", err.message);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    joinRooms(socket);
    setupEventHandlers(socket);

    socket.on("error", (error) => {
      // eslint-disable-next-line no-console
      console.error("[Socket] Error:", error);
    });
  });

  return io;
};

/** Subscribes a freshly connected socket to its role, entity, and staff rooms. */
function joinRooms(socket) {
  // Anonymous guest (waiting-room display): only the display/legacy rooms.
  if (!socket.user) {
    socket.on("join:doctor", (doctorId) => socket.join(`doctor-${doctorId}`));
    socket.on("join:display", () => socket.join("display"));
    return;
  }

  const { id: userId, role, fullName, patient, doctor } = socket.user;
  // eslint-disable-next-line no-console
  console.log(`[Socket] Connected: ${fullName} (${role})`);

  socket.join(`${role}-${userId}`);
  if (role === "PATIENT" && patient) socket.join(`patient-${patient.id}`);
  if (role === "DOCTOR" && doctor) socket.join(`doctor-${doctor.id}`);
  if (["ADMIN", "RECEPTIONIST"].includes(role)) socket.join("staff");

  socket.on("join:doctor", (doctorId) => socket.join(`doctor-${doctorId}`));
  socket.on("join:display", () => socket.join("display"));

  socket.broadcast.emit("userStatusChanged", { userId, status: "online" });
}

/** All per-connection listeners live here — never registered at module scope. */
function setupEventHandlers(socket) {
  if (!socket.user) return; // guests listen only; they don't emit domain events

  socket.on("bookAppointment", async (data) => {
    try {
      const payload = {
        ...data,
        bookedBy: socket.userId,
        bookerName: socket.user.fullName,
        timestamp: new Date(),
      };
      if (data.doctorId) io.to(`doctor-${data.doctorId}`).emit("newAppointment", payload);
      io.to("staff").emit("newAppointment", payload);
      socket.emit("appointmentBooked", payload);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[Socket] Error broadcasting appointment:", err);
      socket.emit("bookAppointmentError", { message: "Failed to broadcast booking" });
    }
  });

  socket.on("updateAppointment", async (data) => {
    try {
      const { appointmentId, ...updateData } = data;
      const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
      if (!appointment) return;

      const payload = { appointmentId, ...updateData, timestamp: new Date() };
      io.to(`doctor-${appointment.doctorId}`).emit("appointmentUpdated", payload);
      io.to(`patient-${appointment.patientId}`).emit("appointmentUpdated", payload);
      io.to("staff").emit("appointmentUpdated", payload);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[Socket] Error updating appointment:", err);
      socket.emit("updateAppointmentError", { message: "Error updating appointment" });
    }
  });

  socket.on("cancelAppointment", async (data) => {
    try {
      const { appointmentId, reason } = data;
      const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
      if (!appointment) return;

      const payload = {
        appointmentId,
        reason,
        cancelledBy: socket.user.fullName,
        timestamp: new Date(),
      };
      io.to(`doctor-${appointment.doctorId}`).emit("appointmentCancelled", payload);
      io.to(`patient-${appointment.patientId}`).emit("appointmentCancelled", payload);
      io.to("staff").emit("appointmentCancelled", payload);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[Socket] Error cancelling appointment:", err);
      socket.emit("cancelAppointmentError", { message: "Error cancelling appointment" });
    }
  });

  socket.on("disconnect", () => {
    // eslint-disable-next-line no-console
    console.log(`[Socket] Disconnected: ${socket.user.fullName}`);
    socket.broadcast.emit("userStatusChanged", { userId: socket.userId, status: "offline" });
  });
}

/** Lets controllers reach the same io instance without threading it through. */
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
