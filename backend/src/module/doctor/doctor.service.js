import { prisma } from "../../config/database.js";

async function getAll({ departmentId } = {}) {
  return prisma.doctor.findMany({
    where: departmentId ? { departmentId } : undefined,
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
      department: true,
    },
    orderBy: { rating: "desc" },
  });
}

async function getById(id) {
  return prisma.doctor.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true, avatar: true } },
      department: true,
    },
  });
}

async function getByUserId(userId) {
  return prisma.doctor.findUnique({ where: { userId } });
}

async function update(id, data) {
  return prisma.doctor.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.doctor.delete({ where: { id } });
}

export const doctorService = { getAll, getById, getByUserId, update, remove };
