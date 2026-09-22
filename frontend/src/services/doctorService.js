import { api } from "./api";
import { mockDoctors } from "./mockData";

let store = [...mockDoctors];

async function getAll() {
  if (api.USE_MOCK) {
    await api.delay(400);
    return [...store];
  }
  return api.request("/doctors");
}

async function create(payload) {
  if (api.USE_MOCK) {
    await api.delay(500);
    const record = { id: `d${Date.now()}`, status: "available", rating: 5.0, patients: 0, ...payload };
    store = [record, ...store];
    return record;
  }
  return api.request("/doctors", { method: "POST", body: payload });
}

async function getById(id) {
  if (api.USE_MOCK) {
    await api.delay(300);
    return store.find((doc) => doc.id === id) || null;
  }
  return api.request(`/doctors/${id}`);
}

export const doctorService = { getAll, create, getById };
