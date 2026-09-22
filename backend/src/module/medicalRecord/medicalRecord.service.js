import { prisma } from "../../config/database.js";

const recordInclude = {
  patient: { include: { user: { select: { fullName: true, email: true } } } },
  doctor: { include: { user: { select: { fullName: true } } } },
  prescriptions: true,
  reports: true,
};

export const createMedicalRecord = async (recordData) => {
  const { patientId, doctorId, appointmentId, ...data } = recordData;

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new Error("patient not found");

  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) throw new Error("doctor not found");

  if (appointmentId) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new Error("appointment not found");
  }

  return prisma.medicalRecord.create({
    data: {
      patientId,
      doctorId,
      appointmentId: appointmentId || undefined,
      symptoms: data.symptoms || [],
      ...data,
    },
    include: recordInclude,
  });
};

export const getAllMedicalRecords = async ({ patientId, doctorId } = {}) => {
  return prisma.medicalRecord.findMany({
    where: {
      ...(patientId ? { patientId } : {}),
      ...(doctorId ? { doctorId } : {}),
    },
    include: recordInclude,
    orderBy: { createdAt: "desc" },
  });
};

export const getMedicalRecordById = async (id) => {
  return prisma.medicalRecord.findUnique({ where: { id }, include: recordInclude });
};

/** Full diagnostic history for one patient — every record, prescription, and report, newest first. */
export const getPatientHistory = async (patientId) => {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) throw new Error("patient not found");

  return prisma.medicalRecord.findMany({
    where: { patientId },
    include: recordInclude,
    orderBy: { diagnosisDate: "desc" },
  });
};

export const updateMedicalRecord = async (id, updates) => {
  const existing = await prisma.medicalRecord.findUnique({ where: { id } });
  if (!existing) throw new Error("Medical record not found");

  return prisma.medicalRecord.update({
    where: { id },
    data: updates,
    include: recordInclude,
  });
};

export const deleteMedicalRecord = async (id) => {
  const existing = await prisma.medicalRecord.findUnique({ where: { id } });
  if (!existing) throw new Error("Medical record not found");
  return prisma.medicalRecord.delete({ where: { id } });
};

// --- Prescriptions ---

export const createPrescription = async (data) => {
  const record = await prisma.medicalRecord.findUnique({ where: { id: data.medicalRecordId } });
  if (!record) throw new Error("Medical record not found");
  return prisma.prescription.create({ data });
};

export const getPrescriptionById = async (id) => {
  return prisma.prescription.findUnique({
    where: { id },
    include: { medicalRecord: { include: recordInclude } },
  });
};

// --- Reports ---

export const createReport = async (data) => {
  const record = await prisma.medicalRecord.findUnique({ where: { id: data.medicalRecordId } });
  if (!record) throw new Error("Medical record not found");
  return prisma.report.create({ data });
};

export const getReportById = async (id) => {
  return prisma.report.findUnique({
    where: { id },
    include: { medicalRecord: { include: recordInclude } },
  });
};

export const medicalRecordService = {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordById,
  getPatientHistory,
  updateMedicalRecord,
  deleteMedicalRecord,
  createPrescription,
  getPrescriptionById,
  createReport,
  getReportById,
};
