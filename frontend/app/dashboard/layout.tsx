"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { C, F, r } from "@/lib/theme";
import { Mark } from "@/components/ui";
import { Ic } from "@/components/icons";
import { ProfileProvider, useIdentity } from "@/context/ProfileContext";
import { clearProfile, getProfile, isLoggedIn, setLoggedIn } from "@/lib/profile";
import type { BusinessProfile } from "@/types";
import { Toaster } from "@/components/Toaster";
import { ChatDrawer } from "@/components/ChatDrawer";
import { toast } from "@/lib/toast";
import { useIsMobile } from "@/lib/useIsMobile";

const NAV = [
  { href: "/dashboard", ic: "home", label: "Dashboard", short: "Home" },
  { href: "/dashboard/laporan", ic: "chart", label: "Laporan Keuangan", short: "Laporan" },
  { href: "/dashboard/pajak", ic: "calc", label: "Pajak AI", short: "Pajak", badge: "1" },
  { href: "/dashboard/supplier", ic: "users", label: "Supplier & Customer", short: "Supplier" },
  { href: "/dashboard/iklan", ic: "megaphone", label: "Iklan AI", short: "Iklan" },
  { href: "/dashboard/modal", ic: "wallet", label: "Permodalan", short: "Modal" },
  { href: "/dashboard/connector", ic: "plug", label: "Connector", short: "Connect", section: "Integrasi" },
  { href: "/dashboard/whatsapp", ic: "whatsapp", label: "WhatsApp Bisnis", short: "WA" },
] as { href: string; ic: string; label: string; short: string; badge?: string; section?: string }[];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    const p = getProfile();
    if (!p) {
      router.replace("/onboarding");
      return;
    }
    setProfile(p);
    setReady(true);
  }, [router]);

  if (!ready) return <div style={{ minHeight: "100vh", background: C.bg }} />;

  return (
    <ProfileProvider profile={profile}>
      {isMobile ? (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: F, color: C.ink }}>
          <MobileHeader onAskAI={() => setChatOpen(true)} />
          <div style={{ flex: 1, paddingBottom: 74 }}>{children}</div>
          <BottomNav />
        </div>
      ) : (
        <div style={{ minHeight: "100vh", display: "flex", background: C.bg, fontFamily: F, color: C.ink }}>
          <Sidebar />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <Topbar onAskAI={() => setChatOpen(true)} />
            {children}
          </div>
        </div>
      )}
      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
      <Toaster />
    </ProfileProvider>
  );
}

function useAuthActions() {
  const router = useRouter();
  return {
    logout: () => {
      setLoggedIn(false);
      router.replace("/login");
    },
    resetOnboarding: () => {
      clearProfile();
      router.replace("/onboarding");
    },
  };
}

// ─── Desktop sidebar ───
function Sidebar() {
  const pathname = usePathname();
  const { logout, resetOnboarding } = useAuthActions();

  return (
    <aside style={{ width: 232, padding: "20px 14px", boxSizing: "border-box", background: C.white, borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 0, height: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px 18px" }}>
        <Mark size={32} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.2 }}>BSya Grow</div>
        </div>
      </div>
      {NAV.map((it, i) => {
        const active = it.href === "/dashboard" ? pathname === it.href : pathname.startsWith(it.href);
        const showSection = it.section && (i === 0 || NAV[i - 1].section !== it.section);
        return (
          <React.Fragment key={it.href}>
            {showSection && (
              <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase", padding: "14px 12px 6px" }}>{it.section}</div>
            )}
            <Link href={it.href} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: r(12), cursor: "pointer", background: active ? C.sky : "transparent", color: active ? C.white : C.ink2, fontWeight: active ? 700 : 600, fontSize: 13.5, position: "relative", transition: "background 0.15s" }}>
              {Ic[it.ic](18, active ? C.white : C.ink2)}
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.badge && <span style={{ background: C.yellow, color: C.ink, fontSize: 10.5, fontWeight: 800, padding: "2px 7px", borderRadius: 999, minWidth: 18, textAlign: "center" }}>{it.badge}</span>}
            </Link>
          </React.Fragment>
        );
      })}
      <div style={{ flex: 1 }} />
      <button onClick={resetOnboarding} style={{ background: C.bg, border: `1px solid ${C.line}`, color: C.ink2, fontFamily: F, fontSize: 11.5, fontWeight: 700, padding: "8px 10px", borderRadius: r(10), cursor: "pointer", textAlign: "left" }}>
        ↺ Ulangi onboarding
      </button>
      <button onClick={logout} style={{ background: "transparent", border: "none", color: C.muted, fontFamily: F, fontSize: 11.5, fontWeight: 700, padding: "8px 10px", cursor: "pointer", textAlign: "left" }}>
        ⎋ Keluar
      </button>
    </aside>
  );
}

// ─── Desktop topbar ───
function Topbar({ onAskAI }: { onAskAI: () => void }) {
  const { businessName, ownerName, initials } = useIdentity();
  const [q, setQ] = useState("");

  const runSearch = () => {
    const term = q.trim();
    if (!term) return;
    toast(`Mencari "${term}"… (demo)`, "info");
    setQ("");
  };

  return (
    <div style={{ height: 60, padding: "0 28px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${C.line}`, background: C.white, position: "sticky", top: 0, zIndex: 5 }}>
      <div style={{ flex: 1, maxWidth: 360, height: 38, borderRadius: r(999), background: C.bg, padding: "0 14px", display: "flex", alignItems: "center", gap: 10 }}>
        {Ic.search(16, C.muted)}
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runSearch()} placeholder="Cari transaksi, supplier, faktur…" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13, fontFamily: F, color: C.ink }} />
        <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, background: C.white, padding: "2px 6px", borderRadius: 4, border: `1px solid ${C.line}` }}>⌘ K</span>
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={onAskAI} style={{ height: 36, padding: "0 14px", borderRadius: r(999), background: C.skySoft, color: C.skyDeep, border: "none", fontWeight: 700, fontSize: 12.5, fontFamily: F, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        {Ic.spark(14, C.skyDeep)} Tanya AI
      </button>
      <button onClick={() => toast("Tidak ada notifikasi baru. (demo)", "info")} style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
        {Ic.bell(20, C.ink2)}
        <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: C.yellow, borderRadius: "50%", border: `2px solid ${C.white}` }} />
      </button>
      <button onClick={() => toast("Menu profil belum tersedia di prototype. (demo)", "info")} style={{ display: "flex", alignItems: "center", gap: 10, background: "transparent", border: "none", cursor: "pointer", fontFamily: F }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.sky}, ${C.skyDeep})`, color: C.white, fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{initials}</div>
        <div style={{ lineHeight: 1.2, textAlign: "left" }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{ownerName}</div>
          <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>{businessName}</div>
        </div>
      </button>
    </div>
  );
}

// ─── Mobile header ───
function MobileHeader({ onAskAI }: { onAskAI: () => void }) {
  const { businessName, initials } = useIdentity();
  const { logout } = useAuthActions();
  return (
    <div style={{ height: 56, padding: "0 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.line}`, background: C.white, position: "sticky", top: 0, zIndex: 20 }}>
      <Mark size={30} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: -0.2, lineHeight: 1 }}>BSya <span style={{ color: C.yellowDeep }}>Grow</span></div>
        <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{businessName}</div>
      </div>
      <button onClick={onAskAI} style={{ height: 34, padding: "0 12px", borderRadius: r(999), background: C.skySoft, color: C.skyDeep, border: "none", fontWeight: 800, fontSize: 12, fontFamily: F, display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
        {Ic.spark(13, C.skyDeep)} AI
      </button>
      <button onClick={() => toast("Tidak ada notifikasi baru. (demo)", "info")} style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
        {Ic.bell(20, C.ink2)}
        <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, background: C.yellow, borderRadius: "50%", border: `2px solid ${C.white}` }} />
      </button>
      <button onClick={logout} title="Keluar" style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${C.sky}, ${C.skyDeep})`, color: C.white, fontWeight: 800, fontSize: 12, border: "none", cursor: "pointer" }}>{initials}</button>
    </div>
  );
}

// ─── Mobile bottom tab nav ───
function BottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 20, background: C.white, borderTop: `1px solid ${C.line}`, padding: "8px 4px calc(8px + env(safe-area-inset-bottom))", display: "flex", justifyContent: "space-around" }}>
      {NAV.map((it) => {
        const active = it.href === "/dashboard" ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link key={it.href} href={it.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: active ? C.skyDeep : C.muted, position: "relative", minWidth: 0 }}>
            {Ic[it.ic](21, active ? C.skyDeep : C.muted)}
            <span style={{ fontSize: 9.5, fontWeight: active ? 800 : 600, whiteSpace: "nowrap" }}>{it.short}</span>
            {it.badge && <span style={{ position: "absolute", top: -3, right: "50%", marginRight: -16, background: C.yellow, color: C.ink, fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 999 }}>{it.badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
