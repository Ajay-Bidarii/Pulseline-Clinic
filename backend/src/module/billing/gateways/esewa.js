import crypto from "node:crypto";
import { env } from "../../../config/env.js";

/**
 * eSewa ePay v2 signs a specific field list with HMAC-SHA256 using the
 * merchant secret key. The signed message + signature are returned to the
 * client, which redirects the browser to eSewa's form-post checkout URL.
 * Docs: https://developer.esewa.com.np/
 */
export function buildEsewaPayload({ amount, transactionUuid }) {
  const totalAmount = String(amount);
  const productCode = env.esewa.merchantCode;
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

  const signature = crypto
    .createHmac("sha256", env.esewa.secretKey || "")
    .update(message)
    .digest("base64");

  return {
    amount: totalAmount,
    tax_amount: 0,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: productCode,
    product_service_charge: 0,
    product_delivery_charge: 0,
    success_url: env.esewa.successUrl,
    failure_url: env.esewa.failureUrl,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature,
  };
}

/** Verifies the base64 `data` query param eSewa appends to the success redirect. */
export function verifyEsewaCallback(base64Data) {
  const decoded = JSON.parse(Buffer.from(base64Data, "base64").toString("utf-8"));
  const message = `transaction_code=${decoded.transaction_code},status=${decoded.status},total_amount=${decoded.total_amount},transaction_uuid=${decoded.transaction_uuid},product_code=${decoded.product_code},signed_field_names=${decoded.signed_field_names}`;

  const expectedSignature = crypto
    .createHmac("sha256", env.esewa.secretKey || "")
    .update(message)
    .digest("base64");

  const isValid = expectedSignature === decoded.signature && decoded.status === "COMPLETE";
  return { isValid, decoded };
}
