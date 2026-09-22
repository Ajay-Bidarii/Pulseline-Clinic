import { api } from "./api";
import { mockAppointments } from "./mockData";

let store = [...mockAppointments];

async function getAll() {
  if (api.USE_MOCK) {
    await api.delay(400);
    return [...store].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  }
  return api.request("/appointments");
}

async function create(payload) {
  if (api.USE_MOCK) {
    await api.delay(500);
    const record = { id: `a${Date.now()}`, status: "pending", ...payload };
    store = [record, ...store];
    return record;
  }
  return api.request("/appointments", { method: "POST", body: payload });
}

async function updateStatus(id, status) {
  if (api.USE_MOCK) {
    await api.delay(350);
    store = store.map((item) => (item.id === id ? { ...item, status } : item));
    return store.find((item) => item.id === id);
  }
  return api.request(`/appointments/${id}`, { method: "PATCH", body: { status } });
}

async function getByPatientName(name) {
  const all = await getAll();
  return all.filter((item) => item.patientName.toLowerCase() === (name || "").toLowerCase());
}

async function getByDoctorName(name) {
  const all = await getAll();
  return all.filter((item) => item.doctorName.toLowerCase() === (name || "").toLowerCase());
}

async function addPrescription(id, { diagnosis, prescription, notes }) {
  if (api.USE_MOCK) {
    await api.delay(450);
    store = store.map((item) =>
      item.id === id ? { ...item, diagnosis, prescription, notes, status: "completed" } : item
    );
    return store.find((item) => item.id === id);
  }
  return api.request(`/appointments/${id}/prescription`, {
    method: "PATCH",
    body: { diagnosis, prescription, notes },
  });
}

async function remove(id) {
  if (api.USE_MOCK) {
    await api.delay(300);
    store = store.filter((item) => item.id !== id);
    return { success: true };
  }
  return api.request(`/appointments/${id}`, { method: "DELETE" });
}

export const appointmentService = {
  getAll,
  create,
  updateStatus,
  remove,
  getByPatientName,
  getByDoctorName,
  addPrescription,
};
