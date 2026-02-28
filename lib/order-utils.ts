import { randomBytes, randomInt } from "crypto";

export function generatePublicToken(): string {
  return randomBytes(24).toString("base64url");
}

export function generatePickupCode(): string {
  return String(randomInt(1000, 9999));
}

export const ORDER_STATUSES = ["received", "preparing", "ready", "picked_up"] as const;
