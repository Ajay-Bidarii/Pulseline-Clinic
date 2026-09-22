import { patientService } from "./patient.service.js";
import { success, fail } from "../../utils/response.js";
import { StatusCodes } from "../../constans/statusCodes.js";
import { MESSAGES } from "../../constans/messages.js";

async function list(req, res) {
  const patients = await patientService.getAll({ search: req.query.search });
  return success(res, StatusCodes.OK, "Patients fetched.", { patients });
}

async function getOne(req, res) {
  const patient = await patientService.getById(req.params.id);
  if (!patient) return fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND);
  return success(res, StatusCodes.OK, "Patient fetched.", { patient });
}

async function me(req, res) {
  const patient = await patientService.getByUserId(req.user.id);
  if (!patient) return fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND);
  return success(res, StatusCodes.OK, "Your patient profile.", { patient });
}

async function update(req, res) {
  const patient = await patientService.update(req.params.id, req.body);
  return success(res, StatusCodes.OK, "Patient updated.", { patient });
}

async function remove(req, res) {
  await patientService.remove(req.params.id);
  return success(res, StatusCodes.OK, "Patient removed.");
}

export const patientController = { list, getOne, me, update, remove };
