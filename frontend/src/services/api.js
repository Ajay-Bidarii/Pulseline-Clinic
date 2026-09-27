function getBaseUrl() {
  let url = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
  url = url.trim().replace(/\/+$/, "");
  if (!url.endsWith("/api/v1")) {
    if (url.endsWith("/api")) {
      url += "/v1";
    } else {
      url += "/api/v1";
    }
  }
  return url;
}

const BASE_URL = getBaseUrl();
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

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
