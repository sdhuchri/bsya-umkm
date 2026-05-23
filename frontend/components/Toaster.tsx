"use client";

import React, { useEffect, useState } from "react";
import { C, F, r } from "@/lib/theme";
import type { ToastKind } from "@/lib/toast";

type Item = { id: number; message: string; kind: ToastKind };

let counter = 0;

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, kind } = (e as CustomEvent).detail as { message: string; kind: ToastKind };
      const id = ++counter;
      setItems((prev) => [...prev, { id, message, kind }]);
      setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 3200);
    };
    window.addEventListener("bsya-toast", handler);
    return () => window.removeEventListener("bsya-toast", handler);
  }, []);

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 10, fontFamily: F }}>
      {items.map((it) => (
        <div
          key={it.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: C.ink,
            color: C.white,
            padding: "12px 16px",
            borderRadius: r(12),
            boxShadow: "0 10px 30px rgba(11,39,64,0.3)",
            fontSize: 13,
            fontWeight: 700,
            maxWidth: 360,
            animation: "bsyaToastIn 0.18s ease",
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              flexShrink: 0,
              background: it.kind === "ok" ? C.ok : C.sky,
              color: C.white,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 13,
            }}
          >
            {it.kind === "ok" ? "✓" : "i"}
          </span>
          <span>{it.message}</span>
        </div>
      ))}
      <style>{`@keyframes bsyaToastIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
