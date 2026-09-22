import { prisma } from "../../config/database.js";

let tokenCounter = 1;
function nextToken() {
  return `A-${String(tokenCounter++).padStart(2, "0")}`;
}

async function getQueue() {
  return prisma.queueEntry.findMany({
    where: { status: { in: ["WAITING", "IN_CONSULT"] } },
    include: {
      patient: { include: { user: { select: { fullName: true } } } },
      doctor: { include: { user: { select: { fullName: true } } } },
    },
    orderBy: { checkedInAt: "asc" },
  });
}

async function checkIn({ patientId, doctorId }) {
  return prisma.queueEntry.create({
    data: { patientId, doctorId, token: nextToken() },
  });
}

/** Marks the doctor's current in-consult entry done, then pulls the next waiting one for them. */
async function callNext(doctorId) {
  await prisma.queueEntry.updateMany({
    where: { doctorId, status: "IN_CONSULT" },
    data: { status: "DONE", completedAt: new Date() },
  });

  const next = await prisma.queueEntry.findFirst({
    where: { doctorId, status: "WAITING" },
    orderBy: { checkedInAt: "asc" },
  });

  if (!next) return null;

  return prisma.queueEntry.update({
    where: { id: next.id },
    data: { status: "IN_CONSULT", calledAt: new Date() },
  });
}

async function complete(id) {
  return prisma.queueEntry.update({ where: { id }, data: { status: "DONE", completedAt: new Date() } });
}

async function remove(id) {
  return prisma.queueEntry.delete({ where: { id } });
}

export const queueService = { getQueue, checkIn, callNext, complete, remove };
