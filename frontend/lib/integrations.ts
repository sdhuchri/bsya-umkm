// Client-side persistence for the Connector & WhatsApp Bisnis prototype menus.
// State lives in localStorage so it survives reloads and feels real; no backend
// (matches the prototype's simulated/"(demo)" pattern).

const CONNECTORS_KEY = "bsya_connectors"; // string[] of connected connector ids
const RECALC_KEY = "bsya_recalc"; // last applied reconciliation summary
const WA_KEY = "bsya_whatsapp"; // WhatsApp link state

export type Recalc = {
  source: string; // human label of what triggered the recalculation
  detail: string; // e.g. file name or "via MCP"
  at: string; // ISO timestamp
  rows: number; // transactions merged
  deltas: { label: string; from: string; to: string; note?: string }[];
  applied: boolean;
};

export type WhatsAppState = {
  linked: boolean;
  number: string;
  linkedAt: string;
  scopes: string[]; // which data domains the bot may answer about
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// ─── Connectors ───
export function getConnected(): string[] {
  return read<string[]>(CONNECTORS_KEY, []);
}

export function setConnected(ids: string[]) {
  write(CONNECTORS_KEY, ids);
}

export function isConnected(id: string): boolean {
  return getConnected().includes(id);
}

// ─── Reconciliation summary ───
export function getRecalc(): Recalc | null {
  return read<Recalc | null>(RECALC_KEY, null);
}

export function setRecalc(r: Recalc | null) {
  if (r === null) {
    if (typeof window !== "undefined") window.localStorage.removeItem(RECALC_KEY);
    return;
  }
  write(RECALC_KEY, r);
}

// ─── WhatsApp Bisnis ───
export const WA_DEFAULT_SCOPES = ["laporan", "pajak", "supplier", "stok", "modal"];

export function getWhatsApp(): WhatsAppState | null {
  return read<WhatsAppState | null>(WA_KEY, null);
}

export function saveWhatsApp(state: WhatsAppState) {
  write(WA_KEY, state);
}

export function clearWhatsApp() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(WA_KEY);
}
