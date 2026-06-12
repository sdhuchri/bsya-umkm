"use client";

import React, { useEffect, useRef, useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader, AIBubble } from "@/components/ui";
import { Ic } from "@/components/icons";
import { toast } from "@/lib/toast";
import { Modal, PrimaryButton, inputStyle, fieldLabel } from "@/components/Modal";
import { useIsMobile } from "@/lib/useIsMobile";
import { useProfile, useIdentity } from "@/context/ProfileContext";
import { aiChat } from "@/lib/api";
import { getWhatsApp, saveWhatsApp, clearWhatsApp, WA_DEFAULT_SCOPES, type WhatsAppState } from "@/lib/integrations";

const WA_GREEN = "#25D366";
const WA_TEAL = "#128C7E";
const WA_BG = "#E5DDD5";
const WA_OUT = "#DCF8C6";

const SCOPES: { id: string; label: string; ic: string }[] = [
  { id: "laporan", label: "Laporan Keuangan", ic: "chart" },
  { id: "pajak", label: "Pajak & PPh Final", ic: "calc" },
  { id: "supplier", label: "Supplier & Customer", ic: "users" },
  { id: "stok", label: "Stok & Produk", ic: "store" },
  { id: "modal", label: "Permodalan", ic: "wallet" },
];

export default function WhatsAppPage() {
  const m = useIsMobile();
  const [wa, setWa] = useState<WhatsAppState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWa(getWhatsApp());
    setReady(true);
  }, []);

  const persist = (next: WhatsAppState | null) => {
    if (next) saveWhatsApp(next);
    else clearWhatsApp();
    setWa(next);
  };

  if (!ready) return <div style={{ flex: 1 }} />;

  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <PageHeader title="WhatsApp Bisnis" subtitle="Sambungkan WhatsApp bisnismu — jadi asisten yang menjawab dari data BSya." />
      {wa?.linked ? <LinkedView wa={wa} persist={persist} m={m} /> : <UnlinkedView persist={persist} m={m} />}
    </div>
  );
}

// ─── Belum tertaut ───
function UnlinkedView({ persist, m }: { persist: (s: WhatsAppState | null) => void; m: boolean }) {
  const [number, setNumber] = useState("");
  const [modal, setModal] = useState(false);

  const link = () => {
    persist({ linked: true, number: number.trim() || "0812-3456-7890", linkedAt: new Date().toISOString(), scopes: WA_DEFAULT_SCOPES });
    setModal(false);
    toast("WhatsApp Bisnis tertaut. Bot AI kamu aktif! (demo)", "ok");
  };

  return (
    <>
      <AIBubble text="Tautkan nomor WhatsApp bisnismu. Setelah tersambung, setiap pelanggan yang chat akan dijawab otomatis oleh BSya AI — soal stok, harga, jam buka, sampai status pesanan — pakai data yang ada di aplikasi ini." />

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 14 : 18 }}>
        <div style={{ background: C.white, borderRadius: r(18), padding: m ? 20 : 26, border: `1px solid ${C.line}` }}>
          <div style={{ width: 48, height: 48, borderRadius: r(14), background: WA_GREEN + "22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            {Ic.whatsapp(26, WA_TEAL)}
          </div>
          <div style={{ fontSize: 17, fontWeight: 900, color: C.ink, letterSpacing: -0.3 }}>Hubungkan WhatsApp Bisnis</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink2, marginTop: 4, marginBottom: 18, lineHeight: 1.45 }}>
            Masukkan nomor WhatsApp Bisnis-mu. Kami pandu menautkannya seperti WhatsApp Web.
          </div>
          <label style={fieldLabel}>Nomor WhatsApp Bisnis</label>
          <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="0812-3456-7890" style={{ ...inputStyle, marginBottom: 14 }} />
          <PrimaryButton onClick={() => setModal(true)}>Tautkan Sekarang</PrimaryButton>
        </div>

        <div style={{ background: C.white, borderRadius: r(18), padding: m ? 20 : 26, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.ink }}>Setelah tertaut, bot bisa…</div>
          {[
            "Jawab pertanyaan pelanggan 24/7 dari data bisnismu",
            "Cek stok & harga produk secara real-time",
            "Kirim info tagihan / status pesanan",
            "Teruskan ke kamu kalau butuh manusia",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12.5, fontWeight: 600, color: C.ink2 }}>
              <span style={{ color: WA_TEAL, flexShrink: 0, marginTop: 1 }}>{Ic.check(15, WA_TEAL)}</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Tautkan perangkat" subtitle="Pindai kode di bawah dari WhatsApp di HP-mu.">
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <FauxQR />
        </div>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {["Buka WhatsApp Bisnis di HP-mu", "Ketuk Menu ⋮ → Perangkat tertaut", "Ketuk Tautkan perangkat, lalu arahkan ke kode ini"].map((s, i) => (
            <li key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: WA_GREEN, color: C.white, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <PrimaryButton onClick={link}>Saya sudah memindai →</PrimaryButton>
      </Modal>
    </>
  );
}

function FauxQR() {
  const N = 17;
  const cells = Array.from({ length: N * N }, (_, i) => {
    const x = i % N;
    const y = Math.floor(i / N);
    const finder = (x < 3 && y < 3) || (x > N - 4 && y < 3) || (x < 3 && y > N - 4);
    const on = finder || (x * 13 + y * 7 + ((x * y) % 5)) % 3 === 0;
    return on;
  });
  return (
    <div style={{ padding: 14, background: C.white, borderRadius: r(14), border: `1px solid ${C.line}`, position: "relative" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${N}, 9px)`, gridAutoRows: 9 }}>
        {cells.map((on, i) => (
          <div key={i} style={{ width: 9, height: 9, background: on ? C.ink : "transparent" }} />
        ))}
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 34, height: 34, borderRadius: r(9), background: WA_GREEN, display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${C.white}` }}>
          {Ic.whatsapp(18, C.white)}
        </div>
      </div>
    </div>
  );
}

// ─── Sudah tertaut ───
function LinkedView({ wa, persist, m }: { wa: WhatsAppState; persist: (s: WhatsAppState | null) => void; m: boolean }) {
  const since = new Date(wa.linkedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const toggleScope = (id: string) => {
    const scopes = wa.scopes.includes(id) ? wa.scopes.filter((s) => s !== id) : [...wa.scopes, id];
    persist({ ...wa, scopes });
  };

  return (
    <>
      {/* Status */}
      <div style={{ background: `linear-gradient(135deg, ${WA_TEAL}, #075E54)`, borderRadius: r(18), padding: m ? 18 : 22, color: C.white, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ width: 46, height: 46, borderRadius: r(13), background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{Ic.whatsapp(26, C.white)}</div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 900 }}>{wa.number}</span>
            <span style={{ fontSize: 10, fontWeight: 800, background: WA_GREEN, color: "#063D2E", padding: "2px 8px", borderRadius: 999 }}>● AKTIF</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.9, marginTop: 2 }}>Bot AI aktif · tertaut sejak {since}</div>
        </div>
        <button onClick={() => { persist(null); toast("WhatsApp Bisnis diputuskan. (demo)", "info"); }} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)", color: C.white, fontFamily: F, fontSize: 12.5, fontWeight: 800, padding: "9px 16px", borderRadius: r(999), cursor: "pointer" }}>Putuskan</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1.1fr", gap: m ? 14 : 18 }}>
        {/* Scopes */}
        <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Bot boleh menjawab tentang</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.ink2, marginTop: 3, marginBottom: 16 }}>Pilih data yang boleh diakses bot saat membalas pelanggan.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SCOPES.map((s) => {
              const on = wa.scopes.includes(s.id);
              return (
                <button key={s.id} onClick={() => toggleScope(s.id)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderRadius: r(12), border: `1.5px solid ${on ? WA_GREEN : C.line}`, background: on ? WA_GREEN + "12" : C.white, cursor: "pointer", fontFamily: F, textAlign: "left" }}>
                  <span style={{ display: "flex", flexShrink: 0 }}>{Ic[s.ic](18, on ? WA_TEAL : C.muted)}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: on ? C.ink : C.ink2 }}>{s.label}</span>
                  <span style={{ width: 38, height: 22, borderRadius: 999, background: on ? WA_GREEN : C.line, position: "relative", transition: "background 0.15s", flexShrink: 0 }}>
                    <span style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: C.white, transition: "left 0.15s" }} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live bot preview */}
        <BotPreview scopes={wa.scopes} m={m} />
      </div>

      <RecentChats />
    </>
  );
}

type Msg = { role: "in" | "out"; text: string };

function BotPreview({ scopes, m }: { scopes: string[]; m: boolean }) {
  const profile = useProfile();
  const { businessName } = useIdentity();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "in", text: `Halo 👋 Saya asisten WhatsApp ${businessName || "bisnismu"}, ditenagai BSya AI. Tanya apa saja — saya jawab dari data bisnis kami.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setMsgs((mm) => [...mm, { role: "out", text }]);
    setLoading(true);
    const scopeHint = scopes.length ? `Bot ini hanya boleh menjawab tentang: ${scopes.join(", ")}.` : "Bot dibatasi—tolak pertanyaan dengan sopan.";
    try {
      const res = await aiChat(profile, `[Mode: bot WhatsApp untuk pelanggan. ${scopeHint} Jawab singkat & ramah seperti chat WA.] ${text}`);
      setMsgs((mm) => [...mm, { role: "in", text: res.text }]);
    } catch {
      setMsgs((mm) => [...mm, { role: "in", text: "Maaf, lagi ada kendala koneksi. Coba lagi sebentar ya 🙏" }]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK = ["Berapa tagihan pajak bulan ini?", "Stok produk masih ada?", "Jam buka kapan?"];

  return (
    <div style={{ background: C.white, borderRadius: r(18), border: `1px solid ${C.line}`, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 420 }}>
      {/* WA header */}
      <div style={{ background: WA_TEAL, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{Ic.whatsapp(18, C.white)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: C.white }}>{businessName || "Bisnismu"}</div>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Bot AI · online · pratinjau</div>
        </div>
      </div>

      {/* messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 14, background: WA_BG, display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map((mm, i) => (
          <div key={i} style={{ alignSelf: mm.role === "out" ? "flex-end" : "flex-start", maxWidth: "82%" }}>
            <div style={{ background: mm.role === "out" ? WA_OUT : C.white, color: C.ink, padding: "8px 11px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, lineHeight: 1.45, whiteSpace: "pre-wrap", boxShadow: "0 1px 1px rgba(0,0,0,0.08)" }}>
              {mm.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ alignSelf: "flex-start", fontSize: 11.5, color: C.ink2, fontWeight: 700, background: C.white, padding: "6px 11px", borderRadius: 10 }}>mengetik…</div>}
      </div>

      {/* quick replies */}
      <div style={{ display: "flex", gap: 7, padding: "10px 12px 0", flexWrap: "wrap" }}>
        {QUICK.map((q) => (
          <button key={q} onClick={() => send(q)} disabled={loading} style={{ background: C.skySoft, color: C.skyDeep, border: "none", borderRadius: r(999), padding: "6px 12px", fontSize: 11, fontWeight: 700, fontFamily: F, cursor: loading ? "wait" : "pointer" }}>{q}</button>
        ))}
      </div>

      {/* input */}
      <div style={{ padding: 12, display: "flex", gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ketik pesan seperti pelanggan…" style={{ flex: 1, padding: "10px 14px", fontSize: 12.5, fontFamily: F, fontWeight: 600, color: C.ink, border: `1.5px solid ${C.line}`, borderRadius: r(999), outline: "none" }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ background: WA_GREEN, color: C.white, border: "none", borderRadius: "50%", width: 40, height: 40, fontWeight: 800, fontSize: 15, cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink: 0 }}>➤</button>
      </div>
    </div>
  );
}

function RecentChats() {
  const items = [
    { name: "Bu Sari", msg: "Kak, stok beras 5kg masih ada?", time: "09:41", auto: true },
    { name: "Pak Andi", msg: "Bisa kirim ke Bekasi hari ini?", time: "08:12", auto: true },
    { name: "Toko Maju", msg: "Minta katalog harga grosir dong", time: "Kemarin", auto: false },
  ];
  return (
    <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Percakapan terakhir</div>
        <span style={{ fontSize: 11, fontWeight: 800, color: WA_TEAL }}>● Bot menangani 2 dari 3</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: i ? `1px solid ${C.line}` : "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${WA_GREEN}, ${WA_TEAL})`, color: C.white, fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{it.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{it.name}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.msg}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted }}>{it.time}</div>
              <div style={{ fontSize: 9.5, fontWeight: 800, color: it.auto ? WA_TEAL : C.yellowDeep, marginTop: 3 }}>{it.auto ? "✓ dijawab bot" : "perlu kamu"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
