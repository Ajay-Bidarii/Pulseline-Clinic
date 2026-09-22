import { departmentService } from "./department.service.js";
import { success, fail } from "../../utils/response.js";
import { StatusCodes } from "../../constans/statusCodes.js";
import { MESSAGES } from "../../constans/messages.js";

async function list(_req, res) {
  const departments = await departmentService.getAll();
  return success(res, StatusCodes.OK, "Departments fetched.", { departments });
}

async function getOne(req, res) {
  const department = await departmentService.getById(req.params.id);
  if (!department) return fail(res, StatusCodes.NOT_FOUND, MESSAGES.GENERIC.NOT_FOUND);
  return success(res, StatusCodes.OK, "Department fetched.", { department });
}

async function create(req, res) {
  const department = await departmentService.create(req.body);
  return success(res, StatusCodes.CREATED, "Department created.", { department });
}

async function update(req, res) {
  const department = await departmentService.update(req.params.id, req.body);
  return success(res, StatusCodes.OK, "Department updated.", { department });
}

async function remove(req, res) {
  await departmentService.remove(req.params.id);
  return success(res, StatusCodes.OK, "Department deactivated.");
}

export const departmentController = { list, getOne, create, update, remove };
