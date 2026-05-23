"use client";

import React from "react";
import { C, F, r } from "@/lib/theme";

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 460,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number;
}) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 950, fontFamily: F, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(11,39,64,0.4)" }} />
      <div style={{ position: "relative", width, maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", background: C.white, borderRadius: r(20), boxShadow: "0 30px 70px rgba(11,39,64,0.3)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "20px 22px 0" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: C.ink, letterSpacing: -0.3 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: r(10), width: 30, height: 30, cursor: "pointer", color: C.ink2, fontWeight: 800, flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  );
}

export const fieldLabel: React.CSSProperties = { fontSize: 12, fontWeight: 800, color: C.ink2, marginBottom: 6, display: "block" };

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 14,
  fontFamily: F,
  fontWeight: 700,
  color: C.ink,
  border: `1.5px solid ${C.line}`,
  borderRadius: r(12),
  outline: "none",
  background: C.white,
};

export function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ width: "100%", background: disabled ? C.line : C.ink, color: disabled ? C.muted : C.white, border: "none", padding: 14, borderRadius: r(999), fontFamily: F, fontSize: 14, fontWeight: 800, cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {children}
    </button>
  );
}
