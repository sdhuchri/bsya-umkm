"use client";

import React, { useEffect, useRef, useState } from "react";
import { C, F, r } from "@/lib/theme";
import { Mark } from "@/components/ui";
import { aiChat } from "@/lib/api";
import { useProfile } from "@/context/ProfileContext";

type Msg = { role: "user" | "ai"; text: string };

export function ChatDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const profile = useProfile();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Halo! Saya BSya AI 👋 Mau tanya soal keuangan, pajak, supplier, iklan, atau modal?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await aiChat(profile, text);
      setMsgs((m) => [...m, { role: "ai", text: res.text }]);
    } catch {
      setMsgs((m) => [...m, { role: "ai", text: "Maaf, lagi ada kendala. Coba lagi sebentar ya." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, fontFamily: F }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(11,39,64,0.35)" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: 400,
          maxWidth: "100%",
          background: C.white,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 40px rgba(11,39,64,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px", borderBottom: `1px solid ${C.line}` }}>
          <Mark size={32} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800 }}>BSya AI</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Asisten bisnismu</div>
          </div>
          <button onClick={onClose} style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: r(10), width: 30, height: 30, cursor: "pointer", color: C.ink2, fontWeight: 800 }}>✕</button>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
              <div
                style={{
                  background: m.role === "user" ? C.sky : C.skySoft,
                  color: m.role === "user" ? C.white : C.ink,
                  padding: "10px 13px",
                  borderRadius: r(14),
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div style={{ alignSelf: "flex-start", fontSize: 12, color: C.muted, fontWeight: 700 }}>BSya AI sedang mengetik…</div>}
        </div>

        <div style={{ padding: 14, borderTop: `1px solid ${C.line}`, display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Tulis pertanyaan…"
            style={{ flex: 1, padding: "11px 14px", fontSize: 13, fontFamily: F, fontWeight: 600, color: C.ink, border: `1.5px solid ${C.line}`, borderRadius: r(12), outline: "none" }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{ background: C.ink, color: C.white, border: "none", borderRadius: r(12), padding: "0 16px", fontWeight: 800, fontSize: 13, cursor: loading || !input.trim() ? "not-allowed" : "pointer" }}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
