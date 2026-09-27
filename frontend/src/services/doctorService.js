import { api } from "./api";
import { mockDoctors } from "./mockData";

let store = [...mockDoctors];

function normalizeDoctor(d) {
  return {
    id: d.id,
    name: d.user?.fullName || d.name || "Doctor",
    department: d.department?.name || d.department || "General Medicine",
    email: d.user?.email || d.email || "",
    phone: d.user?.phone || d.phone || "555-0100",
    experience: d.experience ?? 5,
    status: d.isAvailable ? "available" : (d.status || "available"),
    rating: d.rating ?? 4.9,
    patients: d.patients ?? 100,
    ...d,
  };
}

async function getAll() {
  if (api.USE_MOCK) {
    await api.delay(400);
    return [...store];
  }
  try {
    const res = await api.request("/doctors");
    const rawList = res?.data?.doctors || res?.doctors || res?.data || (Array.isArray(res) ? res : []);
    if (!Array.isArray(rawList) || rawList.length === 0) {
      return [...mockDoctors];
    }
    return rawList.map(normalizeDoctor);
  } catch (err) {
    console.warn("Could not fetch doctors from API, using fallback data:", err.message);
    return [...mockDoctors];
  }
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
  try {
    const res = await api.request(`/doctors/${id}`);
    const raw = res?.data?.doctor || res?.doctor || res?.data || res;
    return raw ? normalizeDoctor(raw) : null;
  } catch (err) {
    console.warn(`Could not fetch doctor ${id} from API:`, err.message);
    return store.find((doc) => doc.id === id) || null;
  }
}

export const doctorService = { getAll, create, getById };
