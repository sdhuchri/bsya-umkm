"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile, isLoggedIn } from "@/lib/profile";
import { C } from "@/lib/theme";
import { Mark } from "@/components/ui";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
    } else if (getProfile()) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: C.sky, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Mark size={64} />
    </div>
  );
}
