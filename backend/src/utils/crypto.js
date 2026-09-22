import { randomInt, randomUUID } from "node:crypto";

export function generateNumericCode(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(randomInt(min, max));
}

export function generateId() {
  return randomUUID();
}
