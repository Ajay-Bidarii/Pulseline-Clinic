import { env } from "../../../config/env.js";

const KHALTI_INITIATE_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL = "https://a.khalti.com/api/v2/epayment/lookup/";

/** Starts a Khalti ePayment session and returns the checkout URL to redirect to. */
export async function initiateKhaltiPayment({ amount, purchaseOrderId, purchaseOrderName, customerInfo }) {
  const response = await fetch(KHALTI_INITIATE_URL, {
    method: "POST",
    headers: {
      Authorization: `Key ${env.khalti.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      return_url: env.khalti.returnUrl,
      website_url: env.clientUrl,
      amount: Math.round(amount * 100), // Khalti expects paisa
      purchase_order_id: purchaseOrderId,
      purchase_order_name: purchaseOrderName,
      customer_info: customerInfo,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Khalti initiate failed: ${body}`);
  }
  return response.json(); // { pidx, payment_url, ... }
}

/** Server-side verification — never trust the client-reported status alone. */
export async function verifyKhaltiPayment(pidx) {
  const response = await fetch(KHALTI_LOOKUP_URL, {
    method: "POST",
    headers: {
      Authorization: `Key ${env.khalti.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pidx }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Khalti lookup failed: ${body}`);
  }
  const data = await response.json();
  return { isValid: data.status === "Completed", data };
}
