import { api } from "./api";
import { mockInvoices } from "./mockData";
import { INVOICE_STATUS } from "../utils/constants";

let store = [...mockInvoices];

async function getAll() {
  if (api.USE_MOCK) {
    await api.delay(400);
    return [...store].sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
  }
  return api.request("/billing/invoices");
}

async function getByPatientName(name) {
  const all = await getAll();
  return all.filter((item) => item.patientName.toLowerCase() === (name || "").toLowerCase());
}

async function create(payload) {
  if (api.USE_MOCK) {
    await api.delay(450);
    const record = {
      id: `inv${Date.now()}`,
      status: INVOICE_STATUS.PENDING,
      method: null,
      issuedAt: new Date().toISOString(),
      ...payload,
    };
    store = [record, ...store];
    return record;
  }
  return api.request("/billing/invoices", { method: "POST", body: payload });
}

/**
 * Simulates a payment gateway round-trip. A real integration redirects to
 * eSewa/Khalti's checkout, then verifies the transaction server-side via a
 * webhook before marking the invoice paid — see backend/src/module/billing.
 */
async function pay(id, method) {
  if (api.USE_MOCK) {
    await api.delay(900);
    store = store.map((item) => (item.id === id ? { ...item, status: INVOICE_STATUS.PAID, method } : item));
    return store.find((item) => item.id === id);
  }
  return api.request(`/billing/invoices/${id}/pay`, { method: "POST", body: { method } });
}

export const billingService = { getAll, getByPatientName, create, pay };
