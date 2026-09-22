const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const USE_MOCK = (import.meta.env.VITE_USE_MOCK_API ?? "true") === "true";

function delay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getToken() {
  return localStorage.getItem("pulseline_token");
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed (${response.status})`);
  }
  return response.json();
}

export const api = { request, delay, USE_MOCK };
