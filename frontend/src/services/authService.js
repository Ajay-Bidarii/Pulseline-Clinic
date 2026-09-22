import { api } from "./api";
import { ROLES } from "../utils/constants";
import { mockPatients, mockStaff, mockDoctors } from "./mockData";

const TOKEN_KEY = "pulseline_token";
const USER_KEY = "pulseline_user";

async function login({ email, password }) {
  if (api.USE_MOCK) {
    await api.delay(600);
    if (!email || !password || password.length < 4) {
      throw new Error("Invalid email or password.");
    }
    const record = mockStaff.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (!record) {
      throw new Error("No staff account found for that email. Contact your clinic administrator for access.");
    }
    const user = {
      id: record.id,
      name: record.name,
      email: record.email,
      role: ROLES.STAFF,
      title: record.title,
    };
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { user, token };
  }
  const data = await api.request("/auth/login", { method: "POST", body: { email, password } });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

async function loginPatient({ email, password }) {
  if (api.USE_MOCK) {
    await api.delay(600);
    if (!email || !password || password.length < 4) {
      throw new Error("Invalid email or password.");
    }
    const record = mockPatients.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (!record) {
      throw new Error("No patient record found for that email. Please register first.");
    }
    const user = {
      id: record.id,
      name: record.name,
      email: record.email,
      role: ROLES.PATIENT,
      title: "Patient",
      patientId: record.id,
    };
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { user, token };
  }
  const data = await api.request("/auth/patient/login", { method: "POST", body: { email, password } });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

async function loginDoctor({ email, password }) {
  if (api.USE_MOCK) {
    await api.delay(600);
    if (!email || !password || password.length < 4) {
      throw new Error("Invalid email or password.");
    }
    const record = mockDoctors.find((d) => d.email.toLowerCase() === email.toLowerCase());
    if (!record) {
      throw new Error("No doctor account found for that email. Contact your clinic administrator for access.");
    }
    const user = {
      id: record.id,
      name: record.name,
      email: record.email,
      role: ROLES.DOCTOR,
      title: record.department,
      doctorId: record.id,
      department: record.department,
    };
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { user, token };
  }
  const data = await api.request("/auth/doctor/login", { method: "POST", body: { email, password } });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

async function registerPatient({ name, email, password, phone }) {
  if (api.USE_MOCK) {
    await api.delay(700);
    if (!name || !email || password.length < 4) {
      throw new Error("Please complete every field with a valid password.");
    }
    const existing = mockPatients.find((p) => p.email.toLowerCase() === email.toLowerCase());
    const patientId = existing?.id || `p${Date.now()}`;
    if (!existing) {
      mockPatients.push({
        id: patientId,
        name,
        age: null,
        gender: "Not specified",
        phone: phone || "",
        email,
        bloodGroup: "-",
        lastVisit: null,
        condition: "New patient",
        status: "active",
      });
    }
    const user = { id: patientId, name, email, role: ROLES.PATIENT, title: "Patient", patientId };
    const token = `mock-token-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return { user, token };
  }
  const data = await api.request("/auth/patient/register", { method: "POST", body: { name, email, password, phone } });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  if (!token || !rawUser) return null;
  try {
    return { token, user: JSON.parse(rawUser) };
  } catch {
    return null;
  }
}

export const authService = { login, loginPatient, loginDoctor, registerPatient, logout, getSession };
