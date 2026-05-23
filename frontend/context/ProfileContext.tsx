"use client";

import React, { createContext, useContext } from "react";
import type { BusinessProfile } from "@/types";

const ProfileCtx = createContext<BusinessProfile | null>(null);

export function ProfileProvider({ profile, children }: { profile: BusinessProfile | null; children: React.ReactNode }) {
  return <ProfileCtx.Provider value={profile}>{children}</ProfileCtx.Provider>;
}

export const useProfile = () => useContext(ProfileCtx);

// Derive display identity from the onboarding profile, with sensible defaults
// matching the prototype's example user.
export function useIdentity() {
  const profile = useProfile();
  const businessName = profile?.businessName || "Warung Sembako Berkah";
  const ownerName = "Budi Santoso";
  const initials = ownerName.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return { businessName, ownerName, initials, category: profile?.category, branch: profile?.branch };
}
