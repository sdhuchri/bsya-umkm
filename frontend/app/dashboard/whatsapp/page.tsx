"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader, Deco } from "@/components/ui";
import { Ic } from "@/components/icons";
import { toast } from "@/lib/toast";
import { useIsMobile } from "@/lib/useIsMobile";

type Phase = "idle" | "qr" | "linking" | "connected";

type Source = { id: string; label: string; desc: string; on: boolean };

const TONES = ["Ramah & santai", "Profesional", "Singkat & to the point"];

const DEFAULT_SOURCES: Source[] = [
  { id: "laporan", label: "Laporan Keuangan", desc: "Omzet, laba, arus kas internal", on: true },
  { id: "produk", label: "Katalog & Harga Produk", desc: "Daftar produk dan harga jual", on: true },
  { id: "mekari", label: "Connector · Mekari Jurnal", desc: "Saldo & faktur akuntansi", on: true },
  { id: "accurate", label: "Connector · Accurate Online", desc: "Stok & piutang", on: false },
];

// Demo Q&A the mock bot uses to answer "based on data".
const DEMO_QA: { q: string; a: string }[] = [
  { q: "Halo, masih buka?", a: "Halo kak! 😊 Toko kami buka tiap hari jam 08.00–21.00. Ada yang bisa kami bantu?" },
  { q: "Stok beras 5kg masih ada?", a: "Sebentar saya cek ya kak… ✅ Stok Beras Premium 5kg masih tersedia 24 sak. Harga Rp 68.000/sak." },
  { q: "Bisa nego untuk 10 sak?", a: "Untuk pembelian 10 sak ke atas, kami beri harga Rp 65.000/sak kak. Total Rp 650.000. Mau saya buatkan pesanannya?" },
];

export default function WhatsAppPage() {
  const m = useIsMobile();
  const [phase, setPhase] = useState<Phase>("idle");
  const [number, setNumber] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>(DEFAULT_SOURCES);
  const [tone, setTone] = useState(TONES[0]);
  const [autoReply, setAutoReply] = useState(true);

  const connected = phase === "connected";
  const activeSources = sources.filter((s) => s.on).length;

  const startQR = () => setPhase("qr");

  // Mock the Baileys pairing flow: user "scans" → linking → connected.
  const simulateScan = () => {
    setPhase("linking");
    setTimeout(() => {
      setPhase("connected");
      setNumber("+62 812-9087-5544");
      toast("WhatsApp tertaut! Asisten AI siap membalas. (mock)", "ok");
    }, 1600);
  };

  const disconnect = () => {
    setPhase("idle");
    setNumber(null);
    toast("Perangkat WhatsApp dilepas.", "info");
  };

  const toggleSource = (id: string) =>
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, on: !s.on } : s)));

  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <PageHeader title="Asisten WhatsApp" subtitle="Jadikan WhatsApp bisnismu chatbot AI yang menjawab dari datamu" />

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 14 : 18 }}>
        {/* ── LEFT: connection ── */}
        <div style={{ background: C.white, borderRadius: r(18), padding: m ? 18 : 22, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: r(12), background: "#25D366", color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {Ic.whatsapp(22, C.white)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Koneksi WhatsApp</div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>via Baileys · perangkat tertaut</div>
            </div>
            <div style={{ flex: 1 }} />
            <ConnPill connected={connected} />
          </div>

          {connected ? (
            <ConnectedCard number={number!} onDisconnect={disconnect} />
          ) : phase === "idle" ? (
            <IdleCard onStart={startQR} />
          ) : (
            <QRCard linking={phase === "linking"} onSimulateScan={simulateScan} />
          )}
        </div>

        {/* ── RIGHT: live preview ── */}
        <ChatPreview connected={connected} tone={tone} activeSources={activeSources} />
      </div>

      {/* ── Bot configuration ── */}
      <div style={{ background: C.white, borderRadius: r(18), padding: m ? 18 : 22, border: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Konfigurasi Asisten</div>
        <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, marginBottom: 16 }}>
          Pilih data yang boleh dibaca AI Agent saat menjawab nasabah. {activeSources} sumber aktif.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(2, 1fr)", gap: 10, marginBottom: 18 }}>
          {sources.map((s) => (
            <button key={s.id} onClick={() => toggleSource(s.id)} style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: r(14), border: `1.5px solid ${s.on ? C.sky : C.line}`, background: s.on ? C.skySoft : C.white, cursor: "pointer", fontFamily: F }}>
              <Toggle on={s.on} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>{s.label}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.ink2, marginBottom: 8 }}>Gaya bahasa</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TONES.map((t) => (
                <button key={t} onClick={() => setTone(t)} style={{ padding: "8px 14px", borderRadius: r(999), border: `1.5px solid ${tone === t ? C.sky : C.line}`, background: tone === t ? C.sky : C.white, color: tone === t ? C.white : C.ink2, fontSize: 12, fontWeight: 700, fontFamily: F, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.ink2, marginBottom: 8 }}>Balas otomatis</div>
            <button onClick={() => setAutoReply((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: r(14), border: `1.5px solid ${autoReply ? C.sky : C.line}`, background: autoReply ? C.skySoft : C.white, cursor: "pointer", fontFamily: F, width: "100%", textAlign: "left" }}>
              <Toggle on={autoReply} />
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>
                {autoReply ? "AI membalas otomatis 24/7" : "Pesan masuk butuh persetujuan admin"}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Connection states ───
function IdleCard({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "12px 0", gap: 10 }}>
      <div style={{ width: 64, height: 64, borderRadius: r(18), background: C.skySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {Ic.whatsapp(32, "#25D366")}
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Belum ada WhatsApp tertaut</div>
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, maxWidth: 280, lineHeight: 1.5 }}>
        Tautkan nomor WA bisnismu dengan scan QR — seperti WhatsApp Web.
      </div>
      <button onClick={onStart} style={{ marginTop: 4, background: "#25D366", color: C.white, border: "none", padding: "11px 20px", borderRadius: r(999), fontSize: 13, fontWeight: 800, fontFamily: F, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
        {Ic.whatsapp(16, C.white)} Tautkan WhatsApp
      </button>
    </div>
  );
}

function QRCard({ linking, onSimulateScan }: { linking: boolean; onSimulateScan: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "8px 0" }}>
      <div style={{ position: "relative", padding: 14, background: C.white, borderRadius: r(16), border: `1px solid ${C.line}`, boxShadow: "0 8px 24px rgba(11,39,64,0.08)" }}>
        <FakeQR />
        {linking && (
          <div style={{ position: "absolute", inset: 0, borderRadius: r(16), background: "rgba(255,255,255,0.86)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Spinner />
            <div style={{ fontSize: 12.5, fontWeight: 800, color: C.skyDeep }}>Menautkan perangkat…</div>
          </div>
        )}
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 11.5, color: C.ink2, fontWeight: 600, lineHeight: 1.7, maxWidth: 280 }}>
        <li>1. Buka <b>WhatsApp</b> di HP bisnismu</li>
        <li>2. Ketuk <b>⋮ → Perangkat Tertaut</b></li>
        <li>3. <b>Tautkan Perangkat</b>, lalu arahkan ke QR ini</li>
      </ol>
      {!linking && (
        <button onClick={onSimulateScan} style={{ background: C.bg, color: C.ink2, border: `1px solid ${C.line}`, padding: "8px 14px", borderRadius: r(999), fontSize: 11.5, fontWeight: 800, fontFamily: F, cursor: "pointer" }}>
          ▶ Simulasikan scan (mock)
        </button>
      )}
    </div>
  );
}

function ConnectedCard({ number, onDisconnect }: { number: string; onDisconnect: () => void }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: r(14), background: "#E5F7EE", border: "1px solid #BDEBD3" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#25D366", color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>{Ic.check(22, C.white)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: C.ink }}>{number}</div>
          <div style={{ fontSize: 11, color: C.ok, fontWeight: 700 }}>Tertaut & online · membalas otomatis</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <MiniStat value="128" label="chat hari ini" />
        <MiniStat value="94%" label="dijawab AI" />
        <MiniStat value="3 dtk" label="rata-rata balas" />
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={onDisconnect} style={{ background: C.bg, color: "#D14343", border: `1px solid ${C.line}`, padding: "10px 14px", borderRadius: r(999), fontSize: 12.5, fontWeight: 800, fontFamily: F, cursor: "pointer" }}>
        Lepas perangkat
      </button>
    </div>
  );
}

// ─── Live chat preview ───
function ChatPreview({ connected, tone, activeSources }: { connected: boolean; tone: string; activeSources: number }) {
  const [msgs, setMsgs] = useState<{ from: "cust" | "bot"; text: string }[]>([]);
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [msgs, typing]);

  const send = () => {
    if (step >= DEMO_QA.length) return;
    const qa = DEMO_QA[step];
    setMsgs((p) => [...p, { from: "cust", text: qa.q }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((p) => [...p, { from: "bot", text: qa.a }]);
      setStep((s) => s + 1);
    }, 1100);
  };

  const reset = () => { setMsgs([]); setStep(0); };

  return (
    <div style={{ background: C.white, borderRadius: r(18), border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.skySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>{Ic.spark(16, C.skyDeep)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800 }}>Pratinjau Percakapan</div>
          <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>Nada: {tone} · {activeSources} sumber data</div>
        </div>
        {msgs.length > 0 && (
          <button onClick={reset} style={{ background: "transparent", border: "none", color: C.muted, fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: F }}>Reset</button>
        )}
      </div>

      <div ref={scrollRef} style={{ flex: 1, minHeight: 240, maxHeight: 320, overflow: "auto", padding: 16, background: "#ECE5DD", display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.length === 0 && !typing && (
          <div style={{ margin: "auto", textAlign: "center", color: "#5B6B61", fontSize: 12, fontWeight: 600, maxWidth: 220, lineHeight: 1.5 }}>
            {connected ? "Tekan tombol di bawah untuk mensimulasikan chat nasabah." : "Tautkan WhatsApp dulu untuk mencoba balasan AI."}
          </div>
        )}
        {msgs.map((mm, i) => (
          <Bubble key={i} from={mm.from} text={mm.text} />
        ))}
        {typing && <Bubble from="bot" text="" typing />}
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${C.line}`, display: "flex", gap: 8 }}>
        <button
          disabled={!connected || step >= DEMO_QA.length || typing}
          onClick={send}
          style={{ flex: 1, background: connected && step < DEMO_QA.length ? "#25D366" : C.line, color: connected && step < DEMO_QA.length ? C.white : C.muted, border: "none", padding: "11px 14px", borderRadius: r(999), fontSize: 12.5, fontWeight: 800, fontFamily: F, cursor: connected && step < DEMO_QA.length ? "pointer" : "default" }}
        >
          {step >= DEMO_QA.length ? "Demo selesai ✓" : "Kirim pesan nasabah →"}
        </button>
      </div>
    </div>
  );
}

function Bubble({ from, text, typing }: { from: "cust" | "bot"; text: string; typing?: boolean }) {
  const bot = from === "bot";
  return (
    <div style={{ alignSelf: bot ? "flex-start" : "flex-end", maxWidth: "82%", background: bot ? C.white : "#DCF8C6", color: C.ink, padding: "8px 11px", borderRadius: 12, borderTopLeftRadius: bot ? 2 : 12, borderTopRightRadius: bot ? 12 : 2, fontSize: 12.5, fontWeight: 500, lineHeight: 1.45, boxShadow: "0 1px 1px rgba(0,0,0,0.06)" }}>
      {bot && <div style={{ fontSize: 9.5, fontWeight: 800, color: C.skyDeep, marginBottom: 2 }}>🤖 Asisten AI</div>}
      {typing ? <TypingDots /> : text}
    </div>
  );
}

// ─── Small bits ───
function ConnPill({ connected }: { connected: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: connected ? "#E5F7EE" : C.bg, color: connected ? C.ok : C.muted, textTransform: "uppercase", letterSpacing: 0.4 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: connected ? C.ok : C.muted }} />
      {connected ? "Online" : "Offline"}
    </span>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ background: C.bg, borderRadius: r(12), padding: "10px 8px", textAlign: "center", border: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 17, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9.5, color: C.muted, fontWeight: 700, marginTop: 3 }}>{label}</div>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span style={{ width: 38, height: 22, borderRadius: 999, background: on ? C.sky : C.line, flexShrink: 0, position: "relative", transition: "background 0.15s" }}>
      <span style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: C.white, transition: "left 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
    </span>
  );
}

function Spinner() {
  return (
    <>
      <span style={{ width: 26, height: 26, borderRadius: "50%", border: `3px solid ${C.line}`, borderTopColor: C.sky, display: "inline-block", animation: "wa-spin 0.8s linear infinite" }} />
      <style>{`@keyframes wa-spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.muted, display: "inline-block", animation: `wa-blink 1s ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes wa-blink{0%,60%,100%{opacity:0.3}30%{opacity:1}}`}</style>
    </span>
  );
}

// Deterministic fake QR (decorative — looks like a QR without a library).
function FakeQR() {
  const cells = useMemo(() => {
    const N = 21;
    const arr: boolean[] = [];
    let seed = 7;
    const rng = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) arr.push(rng() > 0.5);
    // finder-pattern helper
    const isFinder = (x: number, y: number) => {
      const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
      return inBox(0, 0) || inBox(N - 7, 0) || inBox(0, N - 7);
    };
    return { N, arr, isFinder };
  }, []);

  const { N, arr, isFinder } = cells;
  const px = 6;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${N}, ${px}px)`, width: N * px, height: N * px }}>
      {arr.map((on, i) => {
        const x = i % N, y = Math.floor(i / N);
        const finder = isFinder(x, y);
        const filled = finder
          ? // draw finder squares: outer ring + center
            (() => {
              const lx = x < 7 ? x : x - (N - 7);
              const ly = y < 7 ? y : y - (N - 7);
              const ring = lx === 0 || lx === 6 || ly === 0 || ly === 6;
              const center = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
              return ring || center;
            })()
          : on;
        return <div key={i} style={{ width: px, height: px, background: filled ? C.ink : "transparent" }} />;
      })}
    </div>
  );
}
