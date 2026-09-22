import { prisma } from "../../config/database.js";
import { APPOINTMENT_SLOT_MINUTES } from "../../config/constants.js";

async function getAll({ patientId, doctorId, status } = {}) {
  return prisma.appointment.findMany({
    where: {
      ...(patientId ? { patientId } : {}),
      ...(doctorId ? { doctorId } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      patient: { include: { user: { select: { fullName: true, email: true, phone: true } } } },
      doctor: { include: { user: { select: { fullName: true } }, department: true } },
    },
    orderBy: { date: "desc" },
  });
}

async function getById(id) {
  return prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: { include: { user: true } },
      doctor: { include: { user: true, department: true } },
    },
  });
}

/** Rejects double-booking the same doctor at the same date + time slot. */
async function isSlotTaken(doctorId, date, time) {
  const existing = await prisma.appointment.findFirst({
    where: {
      doctorId,
      date,
      time,
      status: { in: ["SCHEDULED", "CONFIRMED"] },
    },
  });
  return !!existing;
}

async function create({ patientId, doctorId, date, time, type, symptoms, notes }) {
  const taken = await isSlotTaken(doctorId, new Date(date), time);
  if (taken) {
    const err = new Error("SLOT_UNAVAILABLE");
    throw err;
  }
  return prisma.appointment.create({
    data: {
      patientId,
      doctorId,
      date: new Date(date),
      time,
      type,
      symptoms: symptoms || [],
      notes,
    },
  });
}

async function updateStatus(id, status) {
  return prisma.appointment.update({ where: { id }, data: { status } });
}

async function addPrescription(id, { diagnosis, prescription, notes, followUpDate }) {
  return prisma.appointment.update({
    where: { id },
    data: {
      diagnosis,
      prescription,
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      status: "COMPLETED",
    },
  });
}

async function remove(id) {
  return prisma.appointment.delete({ where: { id } });
}

export const appointmentService = {
  getAll,
  getById,
  create,
  updateStatus,
  addPrescription,
  remove,
  slotMinutes: APPOINTMENT_SLOT_MINUTES,
};
