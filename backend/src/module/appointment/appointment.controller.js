import { appointmentService } from "./appointment.service.js";
import { patientService } from "../patient/patient.service.js";
import { success, fail } from "../../utils/response.js";
import { StatusCodes } from "../../constans/statusCodes.js";
import { MESSAGES } from "../../constans/messages.js";
import { ROLES } from "../../constans/roles.js";

async function list(req, res) {
  const filters = { doctorId: req.query.doctorId, status: req.query.status };

  // Patients only ever see their own appointments.
  if (req.user.role === ROLES.PATIENT) {
    const patient = await patientService.getByUserId(req.user.id);
    filters.patientId = patient?.id;
  } else if (req.query.patientId) {
    filters.patientId = req.query.patientId;
  }

  const appointments = await appointmentService.getAll(filters);
  return success(res, StatusCodes.OK, "Appointments fetched.", { appointments });
}

async function getOne(req, res) {
  const appointment = await appointmentService.getById(req.params.id);
  if (!appointment) return fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND);
  return success(res, StatusCodes.OK, "Appointment fetched.", { appointment });
}

async function create(req, res) {
  try {
    let { patientId } = req.body;
    if (req.user.role === ROLES.PATIENT) {
      const patient = await patientService.getByUserId(req.user.id);
      patientId = patient?.id;
    }
    const appointment = await appointmentService.create({ ...req.body, patientId });
    req.app.get("io")?.emit("appointment:created", appointment);
    return success(res, StatusCodes.CREATED, MESSAGES.APPOINTMENT.CREATED, { appointment });
  } catch (err) {
    if (err.message === "SLOT_UNAVAILABLE") {
      return fail(res, StatusCodes.CONFLICT, MESSAGES.APPOINTMENT.SLOT_UNAVAILABLE);
    }
    return fail(res, StatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.GENERIC.SERVER_ERROR);
  }
}

async function updateStatus(req, res) {
  const appointment = await appointmentService.updateStatus(req.params.id, req.body.status);
  req.app.get("io")?.emit("appointment:updated", appointment);
  return success(res, StatusCodes.OK, MESSAGES.APPOINTMENT.UPDATED, { appointment });
}

async function addPrescription(req, res) {
  const appointment = await appointmentService.addPrescription(req.params.id, req.body);
  return success(res, StatusCodes.OK, "Consultation notes saved.", { appointment });
}

async function remove(req, res) {
  await appointmentService.remove(req.params.id);
  return success(res, StatusCodes.OK, MESSAGES.APPOINTMENT.CANCELLED);
}

export const appointmentController = { list, getOne, create, updateStatus, addPrescription, remove };
