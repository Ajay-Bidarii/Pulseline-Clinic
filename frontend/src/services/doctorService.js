import { api } from "./api";
import { mockDoctors } from "./mockData";

let store = [...mockDoctors];

function normalizeDoctor(d) {
  const departmentName =
    typeof d.department === "object" && d.department !== null
      ? d.department.name || "General Medicine"
      : typeof d.department === "string"
      ? d.department
      : "General Medicine";

  const doctorName =
    d.user?.fullName ||
    (typeof d.name === "string" ? d.name : "Doctor");

  return {
    ...d,
    id: d.id,
    name: doctorName,
    department: departmentName,
    email: d.user?.email || (typeof d.email === "string" ? d.email : ""),
    phone: d.user?.phone || (typeof d.phone === "string" ? d.phone : "555-0100"),
    experience: d.experience ?? 5,
    status: d.isAvailable ? "available" : (typeof d.status === "string" ? d.status : "available"),
    rating: typeof d.rating === "number" ? d.rating : 4.9,
    patients: typeof d.patients === "number" ? d.patients : 100,
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
