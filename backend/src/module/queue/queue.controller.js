import { queueService } from "./queue.service.js";
import { success } from "../../utils/response.js";
import { StatusCodes } from "../../constans/statusCodes.js";

/**
 * Every mutation here also emits a Socket.IO event on the shared `io` instance
 * (attached to the Express app in server.js) so the waiting-room display and
 * doctor/staff dashboards update instantly instead of polling.
 */

async function list(_req, res) {
  const queue = await queueService.getQueue();
  return success(res, StatusCodes.OK, "Queue fetched.", { queue });
}

async function checkIn(req, res) {
  const entry = await queueService.checkIn(req.body);
  req.app.get("io")?.emit("queue:updated", { type: "check-in", entry });
  return success(res, StatusCodes.CREATED, "Checked in.", { entry });
}

async function callNext(req, res) {
  const entry = await queueService.callNext(req.body.doctorId);
  req.app.get("io")?.emit("queue:updated", { type: "call-next", entry });
  return success(res, StatusCodes.OK, entry ? "Next patient called." : "No one else is waiting.", { entry });
}

async function complete(req, res) {
  const entry = await queueService.complete(req.params.id);
  req.app.get("io")?.emit("queue:updated", { type: "complete", entry });
  return success(res, StatusCodes.OK, "Marked complete.", { entry });
}

async function remove(req, res) {
  await queueService.remove(req.params.id);
  req.app.get("io")?.emit("queue:updated", { type: "remove", id: req.params.id });
  return success(res, StatusCodes.OK, "Removed from queue.");
}

export const queueController = { list, checkIn, callNext, complete, remove };
