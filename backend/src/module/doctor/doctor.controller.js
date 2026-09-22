import { doctorService } from "./doctor.service.js";
import { success, fail } from "../../utils/response.js";
import { StatusCodes } from "../../constans/statusCodes.js";
import { MESSAGES } from "../../constans/messages.js";

async function list(req, res) {
  const doctors = await doctorService.getAll({ departmentId: req.query.departmentId });
  return success(res, StatusCodes.OK, "Doctors fetched.", { doctors });
}

async function getOne(req, res) {
  const doctor = await doctorService.getById(req.params.id);
  if (!doctor) return fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND);
  return success(res, StatusCodes.OK, "Doctor fetched.", { doctor });
}

async function me(req, res) {
  const doctor = await doctorService.getByUserId(req.user.id);
  if (!doctor) return fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND);
  return success(res, StatusCodes.OK, "Your doctor profile.", { doctor });
}

async function update(req, res) {
  const doctor = await doctorService.update(req.params.id, req.body);
  return success(res, StatusCodes.OK, "Doctor updated.", { doctor });
}

async function remove(req, res) {
  await doctorService.remove(req.params.id);
  return success(res, StatusCodes.OK, "Doctor removed.");
}

export const doctorController = { list, getOne, me, update, remove };
