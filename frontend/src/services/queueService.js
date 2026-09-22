import { api } from "./api";
import { QUEUE_STATUS } from "../utils/constants";

let queue = [
  { id: "q1", token: "A-01", patientName: "Ines Torres", doctorName: "Dr. Miguel Santos", department: "Pediatrics", status: QUEUE_STATUS.WAITING, checkedInAt: new Date().toISOString() },
  { id: "q2", token: "A-02", patientName: "Sofia Alvarez", doctorName: "Dr. James Okafor", department: "Neurology", status: QUEUE_STATUS.WAITING, checkedInAt: new Date().toISOString() },
];
let tokenCounter = 3;

function nextToken() {
  return `A-${String(tokenCounter++).padStart(2, "0")}`;
}

async function getQueue() {
  if (api.USE_MOCK) {
    await api.delay(200);
    return [...queue];
  }
  return api.request("/queue");
}

async function checkIn({ patientName, doctorName, department }) {
  if (api.USE_MOCK) {
    await api.delay(350);
    const entry = {
      id: `q${Date.now()}`,
      token: nextToken(),
      patientName,
      doctorName,
      department,
      status: QUEUE_STATUS.WAITING,
      checkedInAt: new Date().toISOString(),
    };
    queue = [...queue, entry];
    return entry;
  }
  return api.request("/queue/check-in", { method: "POST", body: { patientName, doctorName, department } });
}

/** Doctor calls the next waiting patient assigned to them into consultation. */
async function callNext(doctorName) {
  if (api.USE_MOCK) {
    await api.delay(300);
    queue = queue.map((entry) => (entry.doctorName === doctorName && entry.status === QUEUE_STATUS.IN_CONSULT ? { ...entry, status: QUEUE_STATUS.DONE } : entry));
    const next = queue.find((entry) => entry.doctorName === doctorName && entry.status === QUEUE_STATUS.WAITING);
    if (next) {
      queue = queue.map((entry) => (entry.id === next.id ? { ...entry, status: QUEUE_STATUS.IN_CONSULT } : entry));
    }
    return next || null;
  }
  return api.request("/queue/call-next", { method: "POST", body: { doctorName } });
}

async function complete(id) {
  if (api.USE_MOCK) {
    await api.delay(250);
    queue = queue.map((entry) => (entry.id === id ? { ...entry, status: QUEUE_STATUS.DONE } : entry));
    return queue.find((entry) => entry.id === id);
  }
  return api.request(`/queue/${id}/complete`, { method: "PATCH" });
}

async function remove(id) {
  if (api.USE_MOCK) {
    await api.delay(200);
    queue = queue.filter((entry) => entry.id !== id);
    return { success: true };
  }
  return api.request(`/queue/${id}`, { method: "DELETE" });
}

export const queueService = { getQueue, checkIn, callNext, complete, remove };
