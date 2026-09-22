import { api } from "./api";
import { mockPatients } from "./mockData";

let store = [...mockPatients];

async function getAll() {
  if (api.USE_MOCK) {
    await api.delay(400);
    return [...store];
  }
  return api.request("/patients");
}

async function create(payload) {
  if (api.USE_MOCK) {
    await api.delay(500);
    const record = { id: `p${Date.now()}`, status: "active", lastVisit: new Date().toISOString(), ...payload };
    store = [record, ...store];
    return record;
  }
  return api.request("/patients", { method: "POST", body: payload });
}

async function remove(id) {
  if (api.USE_MOCK) {
    await api.delay(300);
    store = store.filter((item) => item.id !== id);
    return { success: true };
  }
  return api.request(`/patients/${id}`, { method: "DELETE" });
}

export const patientService = { getAll, create, remove };
