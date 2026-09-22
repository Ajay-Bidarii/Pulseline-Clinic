import { prisma } from "../../config/database.js";

async function getAll() {
  return prisma.department.findMany({
    where: { isActive: true },
    include: { _count: { select: { doctors: true } } },
    orderBy: { name: "asc" },
  });
}

async function getById(id) {
  return prisma.department.findUnique({ where: { id }, include: { doctors: true } });
}

async function create(data) {
  return prisma.department.create({ data });
}

async function update(id, data) {
  return prisma.department.update({ where: { id }, data });
}

async function remove(id) {
  // Soft delete — departments are referenced by doctors/appointments historically.
  return prisma.department.update({ where: { id }, data: { isActive: false } });
}

export const departmentService = { getAll, getById, create, update, remove };
