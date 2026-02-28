import crypto from "crypto";

interface RateEntry {
  count: number;
  firstSeen: number;
}

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 8;
const MAX_PER_PHONE = 4;

const ipMap = new Map<string, RateEntry>();
const phoneMap = new Map<string, RateEntry>();

function updateAndCheck(map: Map<string, RateEntry>, key: string, max: number): boolean {
  const now = Date.now();
  const existing = map.get(key);

  if (!existing || now - existing.firstSeen > WINDOW_MS) {
    map.set(key, { count: 1, firstSeen: now });
    return true;
  }

  existing.count += 1;
  map.set(key, existing);

  return existing.count <= max;
}

function sweepOldEntries(map: Map<string, RateEntry>): void {
  const now = Date.now();
  for (const [key, value] of map.entries()) {
    if (now - value.firstSeen > WINDOW_MS) {
      map.delete(key);
    }
  }
}

export function allowOrder(ip: string, phone: string): { ok: boolean; reason?: string } {
  sweepOldEntries(ipMap);
  sweepOldEntries(phoneMap);

  if (!updateAndCheck(ipMap, ip, MAX_PER_IP)) {
    return { ok: false, reason: "Too many orders from this IP. Please try again later." };
  }

  const phoneHash = crypto.createHash("sha256").update(phone).digest("hex");
  if (!updateAndCheck(phoneMap, phoneHash, MAX_PER_PHONE)) {
    return { ok: false, reason: "Too many orders for this phone number. Please wait before retrying." };
  }

  return { ok: true };
}
