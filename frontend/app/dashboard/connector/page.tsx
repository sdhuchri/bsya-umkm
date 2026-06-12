"use client";

import React, { useEffect, useRef, useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader, AIBubble, Deco } from "@/components/ui";
import { Ic } from "@/components/icons";
import { toast } from "@/lib/toast";
import { Modal, PrimaryButton } from "@/components/Modal";
import { useIsMobile } from "@/lib/useIsMobile";
import {
  getConnected,
  setConnected,
  getRecalc,
  setRecalc,
  type Recalc,
} from "@/lib/integrations";

type Kind = "native" | "mcp" | "file";

type Connector = {
  id: string;
  name: string;
  desc: string;
  kind: Kind;
  icon: string;
  accent: string;
  rows: number;
  deltas: Recalc["deltas"];
};

const CONNECTORS: Connector[] = [
  {
    id: "bca",
    name: "BCA Syariah",
    desc: "Transaksi rekening bisnis — sumber utama, real-time.",
    kind: "native",
    icon: "wallet",
    accent: C.sky,
    rows: 1204,
    deltas: [],
  },
  {
    id: "gmail",
    name: "Gmail",
    desc: "Tarik faktur & struk dari kotak masukmu — lampiran dibaca otomatis.",
    kind: "mcp",
    icon: "mail",
    accent: "#EA4335",
    rows: 412,
    deltas: [
      { label: "Faktur & struk dari email", from: "0 dok", to: "37 dok", note: "lampiran PDF diekstrak otomatis" },
      { label: "Pengeluaran tercatat", from: "Rp 28,14 jt", to: "Rp 33,60 jt", note: "+Rp 5,46 jt dari tagihan email" },
      { label: "Vendor terdeteksi", from: "6 vendor", to: "19 vendor", note: "dipetakan ke kategori biaya" },
    ],
  },
  {
    id: "gcal",
    name: "Google Calendar",
    desc: "Sinkronkan jadwal pesanan & event jadi proyeksi arus kas.",
    kind: "mcp",
    icon: "calendar",
    accent: "#4285F4",
    rows: 23,
    deltas: [
      { label: "Agenda pesanan & event", from: "0", to: "23 agenda", note: "ditarik dari Google Calendar" },
      { label: "Pengingat jatuh tempo", from: "manual", to: "otomatis", note: "PPh & tagihan masuk kalender" },
      { label: "Proyeksi arus kas", from: "1 bln", to: "3 bln", note: "dari jadwal pesanan mendatang" },
    ],
  },
  {
    id: "gdrive",
    name: "Google Drive",
    desc: "Hubungkan folder invoice & nota — BSya yang membaca isinya.",
    kind: "mcp",
    icon: "drive",
    accent: "#1FA463",
    rows: 284,
    deltas: [
      { label: "Dokumen keuangan", from: "0 file", to: "84 file", note: "invoice & nota dari Drive" },
      { label: "Baris transaksi", from: "1.204", to: "1.488", note: "+284 baris hasil ekstraksi" },
      { label: "Arsip pajak", from: "tidak ada", to: "lengkap 2025", note: "bukti potong terkumpul" },
    ],
  },
  {
    id: "sheets",
    name: "Google Sheets",
    desc: "Hubungkan spreadsheet catatan harianmu.",
    kind: "mcp",
    icon: "doc",
    accent: "#0F9D58",
    rows: 320,
    deltas: [
      { label: "Baris transaksi", from: "1.204", to: "1.524", note: "+320 baris dari Sheets" },
      { label: "Kategori biaya", from: "8", to: "15", note: "kategori manualmu dipetakan" },
    ],
  },
  {
    id: "notion",
    name: "Notion",
    desc: "Tarik database catatan penjualan & operasional harianmu.",
    kind: "mcp",
    icon: "notion",
    accent: "#2F2F2F",
    rows: 156,
    deltas: [
      { label: "Catatan penjualan harian", from: "0", to: "156 entri", note: "database Notion ditarik" },
      { label: "Kategori produk", from: "8", to: "22", note: "dipetakan dari Notion" },
      { label: "Pemasukan tercatat", from: "Rp 42,85 jt", to: "Rp 47,90 jt", note: "+Rp 5,05 jt dari catatan Notion" },
    ],
  },
];

const FILE_CONNECTOR: Connector = {
  id: "files",
  name: "Unggah Data Mentah",
  desc: "Excel, CSV, PDF rekening koran, atau dokumen — BSya yang membaca.",
  kind: "file",
  icon: "upload",
  accent: C.yellowDeep,
  rows: 96,
  deltas: [
    { label: "Baris terbaca dari file", from: "—", to: "96 baris", note: "diekstrak otomatis oleh AI" },
    { label: "Saldo awal", from: "tidak diset", to: "Rp 18,40 jt", note: "diambil dari rekening koran" },
    { label: "Pengeluaran tercatat", from: "Rp 28,14 jt", to: "Rp 31,02 jt", note: "+Rp 2,88 jt dari faktur PDF" },
  ],
};

const KIND_BADGE: Record<Kind, { label: string; bg: string; fg: string }> = {
  native: { label: "Sumber utama", bg: C.skySoft, fg: C.skyDeep },
  mcp: { label: "via MCP", bg: "#EFE9FF", fg: "#6D4AC2" },
  file: { label: "File", bg: "#FFF6D6", fg: C.yellowDeep },
};

export default function ConnectorPage() {
  const m = useIsMobile();
  const [connected, setConnectedState] = useState<string[]>([]);
  const [recalc, setRecalcState] = useState<Recalc | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [authConn, setAuthConn] = useState<Connector | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setConnectedState(getConnected());
    setRecalcState(getRecalc());
  }, []);

  const persistConnected = (ids: string[]) => {
    setConnected(ids);
    setConnectedState(ids);
  };

  const runRecalc = (conn: Connector, detail: string) => {
    setProcessing(conn.id);
    window.setTimeout(() => {
      if (!connected.includes(conn.id)) persistConnected([...getConnected(), conn.id]);
      const result: Recalc = {
        source: conn.name,
        detail,
        at: new Date().toISOString(),
        rows: conn.rows,
        deltas: conn.deltas,
        applied: false,
      };
      setRecalc(result);
      setRecalcState(result);
      setProcessing(null);
      toast(`${conn.name} dianalisis — ${conn.rows} baris digabung. (demo)`, "ok");
    }, 1500);
  };

  const onConnectClick = (conn: Connector) => {
    if (conn.kind === "mcp") setAuthConn(conn);
    else if (conn.kind === "file") fileRef.current?.click();
  };

  const onFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    runRecalc(FILE_CONNECTOR, f.name);
  };

  const disconnect = (conn: Connector) => {
    persistConnected(getConnected().filter((x) => x !== conn.id));
    toast(`${conn.name} diputuskan. (demo)`, "info");
  };

  const applyRecalc = () => {
    if (!recalc) return;
    const next = { ...recalc, applied: true };
    setRecalc(next);
    setRecalcState(next);
    toast("Hasil diterapkan ke Dashboard, Laporan & Pajak. (demo)", "ok");
  };

  const allCards = [...CONNECTORS, FILE_CONNECTOR];

  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <PageHeader title="Connector" subtitle="Hubungkan sumber data bisnismu — BSya menyesuaikan, bukan menggantikan." />

      <AIBubble text="Sudah pakai Gmail, Google Calendar, Google Drive, atau Notion? Tidak perlu pindah. Sambungkan saja lewat MCP — saya tarik faktur, jadwal, dan catatanmu, gabungkan dengan transaksi BCA Syariah-mu, lalu hitung ulang Laporan, Pajak, dan Dashboard secara otomatis." />

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(2, 1fr)", gap: m ? 12 : 16 }}>
        {allCards.map((conn) => {
          const isOn = conn.kind === "native" || connected.includes(conn.id);
          const badge = KIND_BADGE[conn.kind];
          const busy = processing === conn.id;
          return (
            <div key={conn.id} style={{ background: C.white, borderRadius: r(18), padding: 18, border: `1px solid ${isOn ? "#CDEBDD" : C.line}`, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: r(13), background: conn.accent + "1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {Ic[conn.icon](22, conn.accent)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14.5, fontWeight: 800, color: C.ink }}>{conn.name}</span>
                    <span style={{ fontSize: 9.5, fontWeight: 800, padding: "2px 7px", borderRadius: 999, background: badge.bg, color: badge.fg, letterSpacing: 0.3 }}>{badge.label}</span>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.ink2, marginTop: 4, lineHeight: 1.4 }}>{conn.desc}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 800, color: isOn ? C.ok : C.muted }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: isOn ? C.ok : C.muted, display: "inline-block" }} />
                  {isOn ? "Terhubung" : "Belum terhubung"}
                </div>
                {conn.kind === "native" ? (
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>sinkron real-time</span>
                ) : isOn ? (
                  <button onClick={() => disconnect(conn)} style={{ background: "transparent", border: `1px solid ${C.line}`, color: C.ink2, fontFamily: F, fontSize: 12, fontWeight: 800, padding: "7px 14px", borderRadius: r(999), cursor: "pointer" }}>Putuskan</button>
                ) : (
                  <button onClick={() => onConnectClick(conn)} disabled={busy} style={{ background: busy ? C.line : C.ink, border: "none", color: busy ? C.muted : C.white, fontFamily: F, fontSize: 12, fontWeight: 800, padding: "8px 16px", borderRadius: r(999), cursor: busy ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    {busy ? "Menganalisis…" : <>{Ic.link(13, C.white)} Hubungkan</>}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.pdf,.doc,.docx" onChange={onFilePicked} style={{ display: "none" }} />

      <RecalcPanel recalc={recalc} processing={!!processing} onApply={applyRecalc} m={m} />

      <Modal open={!!authConn} onClose={() => setAuthConn(null)} title={authConn ? `Hubungkan ${authConn.name}` : ""} subtitle="Koneksi aman via MCP — BSya hanya membaca data, tidak mengubahnya.">
        {authConn && (
          <>
            <div style={{ background: C.skySoft, borderRadius: r(12), padding: 16, marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {["Buka MCP server " + authConn.name, "Berikan izin baca (read-only) ke BSya", "BSya tarik & gabungkan datamu otomatis"].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: C.sky, color: C.white, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
            <PrimaryButton onClick={() => { const c = authConn; setAuthConn(null); runRecalc(c, "via MCP"); }}>
              Otorisasi & Tarik Data
            </PrimaryButton>
          </>
        )}
      </Modal>
    </div>
  );
}

function RecalcPanel({ recalc, processing, onApply, m }: { recalc: Recalc | null; processing: boolean; onApply: () => void; m: boolean }) {
  if (processing) {
    return (
      <div style={{ background: C.white, borderRadius: r(18), padding: 24, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: r(11), background: C.skySoft, display: "flex", alignItems: "center", justifyContent: "center" }}>{Ic.refresh(20, C.skyDeep)}</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>BSya AI sedang menggabungkan & menghitung ulang…</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.ink2, marginTop: 2 }}>Mencocokkan transaksi, kategori, dan dasar pajak.</div>
        </div>
      </div>
    );
  }

  if (!recalc) {
    return (
      <div style={{ background: C.white, borderRadius: r(18), padding: 24, border: `1px dashed ${C.line}`, textAlign: "center", color: C.muted }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{Ic.refresh(26, C.muted)}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink2 }}>Belum ada sumber tambahan terhubung</div>
        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 3 }}>Hubungkan konektor atau unggah file untuk melihat data dihitung ulang di sini.</div>
      </div>
    );
  }

  return (
    <div style={{ background: C.white, borderRadius: r(18), padding: m ? 18 : 22, border: `1px solid ${C.line}`, position: "relative", overflow: "hidden" }}>
      <Deco size={48} rotate={18} color="rgba(255,217,61,0.7)" style={{ position: "absolute", right: 18, top: 14 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: C.skyDeep, letterSpacing: 0.5, textTransform: "uppercase" }}>Hasil rekonsiliasi AI</span>
        {recalc.applied && <span style={{ fontSize: 10, fontWeight: 800, background: C.ok, color: C.white, padding: "2px 8px", borderRadius: 999 }}>✓ DITERAPKAN</span>}
      </div>
      <div style={{ fontSize: 16, fontWeight: 900, color: C.ink, letterSpacing: -0.3 }}>
        {recalc.rows.toLocaleString("id-ID")} baris dari {recalc.source} digabung
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.ink2, marginTop: 3, marginBottom: 16 }}>
        Sumber: {recalc.detail} · digabung dengan transaksi BCA Syariah.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {recalc.deltas.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: m ? 8 : 14, flexWrap: "wrap", padding: "10px 14px", background: C.bg, borderRadius: r(12) }}>
            <span style={{ flex: 1, minWidth: 120, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>{d.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.muted, textDecoration: "line-through" }}>{d.from}</span>
            <span style={{ color: C.muted }}>→</span>
            <span style={{ fontSize: 13.5, fontWeight: 900, color: C.ink }}>{d.to}</span>
            {d.note && <span style={{ width: "100%", fontSize: 11, fontWeight: 700, color: C.ok }}>↑ {d.note}</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <button onClick={onApply} disabled={recalc.applied} style={{ background: recalc.applied ? C.line : C.ink, color: recalc.applied ? C.muted : C.white, border: "none", padding: "12px 20px", borderRadius: r(999), fontSize: 13, fontWeight: 800, fontFamily: F, cursor: recalc.applied ? "default" : "pointer" }}>
          {recalc.applied ? "Sudah diterapkan ✓" : "Terapkan ke Dashboard →"}
        </button>
        <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center", fontSize: 11.5, fontWeight: 700, color: C.muted }}>
          Memengaruhi: Dashboard · Laporan Keuangan · Pajak AI
        </div>
      </div>
    </div>
  );
}
