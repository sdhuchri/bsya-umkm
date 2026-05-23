"use client";

import React, { useEffect, useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader, Deco } from "@/components/ui";
import { useProfile } from "@/context/ProfileContext";
import { aiPajak } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Modal, PrimaryButton } from "@/components/Modal";
import { downloadText } from "@/lib/download";
import { useIsMobile } from "@/lib/useIsMobile";

type Hist = { month: string; amount: string; status: "Lunas" | "Belum bayar" };

export default function PajakPage() {
  const m = useIsMobile();
  const [paid, setPaid] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [history, setHistory] = useState<Hist[]>([
    { month: "Jan", amount: "Rp 176.000", status: "Lunas" },
    { month: "Feb", amount: "Rp 198.500", status: "Lunas" },
    { month: "Mar", amount: "Rp 214.000", status: "Lunas" },
    { month: "Apr", amount: "Rp 245.000", status: "Belum bayar" },
  ]);

  const confirmPay = () => {
    setPaid(true);
    setHistory((h) => h.map((x) => (x.month === "Apr" ? { ...x, status: "Lunas" } : x)));
    setPayOpen(false);
    toast("Pembayaran PPh Final Rp 245.000 berhasil. (demo)", "ok");
  };

  const unduhSSP = () => {
    downloadText(
      "ssp-pph-final-april-2026.txt",
      `SURAT SETORAN PAJAK (SSP) — DEMO\nKopi Kenangan\n\nMasa Pajak       : April 2026\nJenis            : PPh Final UMKM (PP 55/2022) 0.5%\nDasar (omzet)    : Rp 49.000.000\nPPh terutang     : Rp 245.000\nJatuh tempo      : 15 Mei 2026\nStatus           : ${paid ? "LUNAS" : "BELUM BAYAR"}\n`,
    );
    toast("SSP (demo) berhasil diunduh.", "ok");
  };

  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <PageHeader title="Pajak AI" subtitle="PPh Final UMKM 0.5% — terhitung otomatis dari mutasi" />

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.4fr 1fr", gap: m ? 14 : 18 }}>
        <div style={{ borderRadius: r(22), padding: 28, color: C.white, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.sky}, ${C.skyDeep})` }}>
          <Deco size={64} rotate={20} color="rgba(255,217,61,0.85)" style={{ position: "absolute", right: -10, top: -14 }} />
          <Deco size={28} rotate={-20} color="rgba(255,255,255,0.25)" style={{ position: "absolute", right: 80, top: 30 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 0.5, textTransform: "uppercase" }}>Tagihan Pajak — April 2026</div>
            {paid && <span style={{ fontSize: 10.5, fontWeight: 800, background: C.ok, color: C.white, padding: "2px 8px", borderRadius: 999 }}>✓ LUNAS</span>}
          </div>
          <div style={{ fontSize: 36, fontWeight: 900, marginTop: 8, marginBottom: 2, letterSpacing: -0.8 }}>Rp 245.000</div>
          <div style={{ fontSize: 13, opacity: 0.9, fontWeight: 600 }}>Omzet Rp 49jt × 0.5% PPh Final</div>
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={() => setPayOpen(true)} disabled={paid} style={{ background: paid ? "rgba(255,255,255,0.3)" : C.yellow, color: paid ? C.white : C.ink, border: "none", padding: "12px 18px", borderRadius: r(999), fontSize: 13, fontWeight: 800, fontFamily: F, cursor: paid ? "default" : "pointer" }}>{paid ? "Sudah dibayar ✓" : "Bayar Sekarang →"}</button>
            <button onClick={unduhSSP} style={{ background: "rgba(255,255,255,0.2)", color: C.white, border: "1px solid rgba(255,255,255,0.4)", padding: "12px 18px", borderRadius: r(999), fontSize: 13, fontWeight: 700, fontFamily: F, cursor: "pointer" }}>Unduh SSP</button>
          </div>
          <div style={{ marginTop: 22, padding: 12, background: "rgba(0,0,0,0.18)", borderRadius: r(12), fontSize: 12, fontWeight: 600 }}>
            ⏰ Jatuh tempo <b>15 Mei 2026</b> · masih 18 hari lagi
          </div>
        </div>

        <AsistenPajak />
      </div>

      <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Riwayat Pajak 2026</div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
          {history.map((it, i) => {
            const lunas = it.status === "Lunas";
            return (
              <div key={i} style={{ background: lunas ? "#E5F7EE" : C.bg, borderRadius: r(14), padding: 14, border: `1px solid ${lunas ? "#B8E5CE" : C.line}` }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>{it.month} 2026</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4, marginBottom: 6 }}>{it.amount}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 800, padding: "3px 8px", borderRadius: 999, background: lunas ? C.ok : C.yellow, color: lunas ? C.white : C.ink }}>{lunas ? "✓ " : "○ "}{it.status}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={payOpen} onClose={() => setPayOpen(false)} title="Bayar PPh Final" subtitle="Pembayaran akan didebit dari rekening BCA Syariah-mu.">
        <div style={{ background: C.skySoft, borderRadius: r(12), padding: 16, marginBottom: 16 }}>
          {([["Masa pajak", "April 2026"], ["Jenis", "PPh Final UMKM 0.5%"], ["Dasar (omzet)", "Rp 49.000.000"], ["Jumlah bayar", "Rp 245.000"]] as const).map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
              <span style={{ color: C.ink2, fontWeight: 600 }}>{k}</span>
              <span style={{ fontWeight: 800, color: C.ink }}>{v}</span>
            </div>
          ))}
        </div>
        <PrimaryButton onClick={confirmPay}>Konfirmasi & Bayar Rp 245.000</PrimaryButton>
      </Modal>
    </div>
  );
}

function AsistenPajak() {
  const profile = useProfile();
  const FALLBACK = [
    "Tahun ini omzet kamu masih di bawah Rp 4.8M — kamu bisa tetap pakai PPh Final 0.5%.",
    "Sebaiknya bayar sebelum 10 Mei agar tidak kena denda 2%.",
    "Lapor SPT Tahunan kamu sudah otomatis terisi 78%.",
  ];
  const [tips, setTips] = useState<string[]>(FALLBACK);
  const emojis = ["💡", "📅", "📤", "🧾"];

  useEffect(() => {
    let alive = true;
    aiPajak(profile)
      .then((data) => {
        if (alive && Array.isArray(data?.tips) && data.tips.length) setTips(data.tips);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [profile]);

  return (
    <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>Asisten Pajak</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {tips.map((txt, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: 12, background: C.skySoft, borderRadius: r(12), fontSize: 12, fontWeight: 600, color: C.ink2, lineHeight: 1.4 }}>
            <span style={{ fontSize: 18 }}>{emojis[i % emojis.length]}</span>
            <span style={{ flex: 1 }}>{txt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
