import type { BusinessProfile } from "@/types";

const PROFILE_KEY = "bsya_profile";
const AUTH_KEY = "bsya_auth";

export function getProfile(): BusinessProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as BusinessProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: BusinessProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}

export function setLoggedIn(value: boolean) {
  if (typeof window === "undefined") return;
  if (value) window.localStorage.setItem(AUTH_KEY, "1");
  else window.localStorage.removeItem(AUTH_KEY);
}
