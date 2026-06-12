// Client for the Go (Gin) backend. Browser calls use NEXT_PUBLIC_API_URL.
import type { BusinessProfile } from "@/types";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Profile ───
export function saveProfileRemote(profile: BusinessProfile) {
  return post("/api/profile", profile);
}

export async function getProfileRemote(): Promise<BusinessProfile | null> {
  const res = await fetch(`${API_BASE}/api/profile`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /api/profile → ${res.status}`);
  return res.json();
}

// ─── Dashboard sections ───
export async function getSection<T>(section: string): Promise<T> {
  const res = await fetch(`${API_BASE}/api/dashboard/${section}`);
  if (!res.ok) throw new Error(`GET /api/dashboard/${section} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── AI ───
export const aiInsight = (profile: BusinessProfile | null) =>
  post<{ title: string; body: string }>("/api/ai/insight", { profile });

export const aiPajak = (profile: BusinessProfile | null) =>
  post<{ tips: string[] }>("/api/ai/pajak", { profile });

export const aiIklan = (profile: BusinessProfile | null, prompt: string) =>
  post<{ text: string; source: string }>("/api/ai/iklan", { profile, prompt });

export const aiChat = (profile: BusinessProfile | null, message: string) =>
  post<{ text: string; source: string }>("/api/ai/chat", { profile, message });
