import { prisma } from "../../config/database.js";

async function getAll({ search } = {}) {
  return prisma.patient.findMany({
    where: search
      ? { user: { fullName: { contains: search, mode: "insensitive" } } }
      : undefined,
    include: { user: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } } },
    orderBy: { createdAt: "desc" },
  });
}

async function getById(id) {
  return prisma.patient.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
      appointments: { orderBy: { date: "desc" }, take: 20 },
      invoices: { orderBy: { issuedAt: "desc" }, take: 20 },
    },
  });
}

async function getByUserId(userId) {
  return prisma.patient.findUnique({ where: { userId } });
}

async function update(id, data) {
  return prisma.patient.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.patient.delete({ where: { id } });
}

export const patientService = { getAll, getById, getByUserId, update, remove };
