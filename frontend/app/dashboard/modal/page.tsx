"use client";

import React, { useMemo, useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader, Deco } from "@/components/ui";
import { toast } from "@/lib/toast";
import { Modal, PrimaryButton, fieldLabel, inputStyle } from "@/components/Modal";
import { useIsMobile } from "@/lib/useIsMobile";

const PACKAGES = [
  { title: "Modal Cepat", amt: "Rp 5–25jt", tenor: "6 bulan", m: "1.0%/bln", use: "Restock barang dagangan", popular: false, defAmt: 15, defTenor: 6, rate: 0.01 },
  { title: "Modal Tumbuh", amt: "Rp 25–50jt", tenor: "12 bulan", m: "1.2%/bln", use: "Buka cabang / renovasi", popular: true, defAmt: 35, defTenor: 12, rate: 0.012 },
  { title: "Modal Investasi", amt: "Rp 50–200jt", tenor: "24 bulan", m: "1.4%/bln", use: "Aset & ekspansi besar", popular: false, defAmt: 100, defTenor: 24, rate: 0.014 },
];

const rp = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");

export default function ModalPage() {
  const m = useIsMobile();
  const [simOpen, setSimOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  // simulation inputs (in juta)
  const [amount, setAmount] = useState(50);
  const [tenor, setTenor] = useState(24);
  const rate = 0.012;

  const sim = useMemo(() => {
    const principal = amount * 1_000_000;
    const marginPerMonth = principal * rate;
    const total = principal + marginPerMonth * tenor;
    return { principal, installment: total / tenor, total };
  }, [amount, tenor]);

  const submitApply = () => {
    setApplied(true);
    setApplyOpen(false);
    toast(`Pengajuan ${rp(amount * 1_000_000)} (tenor ${tenor} bln) diterima — tim BSya akan menghubungi. (demo)`, "ok");
  };

  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <PageHeader title="Permodalan" subtitle="Pinjaman modal kerja syariah berdasarkan riwayat bisnismu" />

      <div style={{ borderRadius: r(22), padding: 28, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.yellow}, ${C.yellowDeep})`, color: C.ink }}>
        <Deco size={72} rotate={22} color="rgba(255,255,255,0.35)" style={{ position: "absolute", right: -14, top: -18 }} />
        <Deco size={28} rotate={-30} color={C.ink} style={{ position: "absolute", right: 120, top: 30, opacity: 0.1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", opacity: 0.7 }}>Plafon Pre-approved</div>
          {applied && <span style={{ fontSize: 10.5, fontWeight: 800, background: C.ink, color: C.yellow, padding: "2px 8px", borderRadius: 999 }}>✓ DIAJUKAN</span>}
        </div>
        <div style={{ fontSize: 44, fontWeight: 900, marginTop: 6, letterSpacing: -1 }}>Rp 50.000.000</div>
        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4, opacity: 0.85 }}>Margin 1.2%/bulan · tenor sampai 24 bulan · akad murabahah</div>
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button onClick={() => { setAmount(50); setTenor(24); setApplyOpen(true); }} style={{ background: C.ink, color: C.white, border: "none", padding: "12px 20px", borderRadius: r(999), fontSize: 13, fontWeight: 800, fontFamily: F, cursor: "pointer" }}>Ajukan sekarang →</button>
          <button onClick={() => setSimOpen(true)} style={{ background: "rgba(255,255,255,0.45)", color: C.ink, border: "none", padding: "12px 20px", borderRadius: r(999), fontSize: 13, fontWeight: 700, fontFamily: F, cursor: "pointer" }}>Hitung simulasi</button>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Skor Kelayakan Bisnismu</div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexDirection: m ? "column" : "row" }}>
          <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
            <svg viewBox="0 0 120 120" width="130" height="130">
              <circle cx="60" cy="60" r="52" fill="none" stroke={C.line} strokeWidth="12" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={C.ok} strokeWidth="12" strokeDasharray={`${0.84 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`} strokeDashoffset={`${0.25 * 2 * Math.PI * 52}`} strokeLinecap="round" transform="rotate(-90 60 60)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.6 }}>84</div>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 0.4 }}>SANGAT BAIK</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            {(
              [
                ["Konsistensi pendapatan", 92, C.ok],
                ["Riwayat pembayaran pajak", 88, C.ok],
                ["Pertumbuhan omzet", 76, C.yellowDeep],
                ["Diversifikasi supplier", 68, C.yellowDeep],
              ] as const
            ).map(([k, v, c], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 700, color: C.ink2 }}>{k}</div>
                <div style={{ width: 140, height: 6, background: C.line, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${v}%`, height: "100%", background: c, borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, width: 32, textAlign: "right" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
        {PACKAGES.map((p, i) => (
          <div key={i} style={{ background: p.popular ? `linear-gradient(160deg, ${C.skySoft}, ${C.white})` : C.white, borderRadius: r(18), padding: 20, border: `2px solid ${p.popular ? C.sky : C.line}`, position: "relative" }}>
            {p.popular && <div style={{ position: "absolute", top: -10, right: 16, background: C.sky, color: C.white, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 999, letterSpacing: 0.4 }}>PALING POPULER</div>}
            <div style={{ fontSize: 14, fontWeight: 800 }}>{p.title}</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 8, letterSpacing: -0.4, color: C.skyDeep }}>{p.amt}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginTop: 2 }}>tenor {p.tenor} · margin {p.m}</div>
            <div style={{ marginTop: 12, padding: "8px 10px", background: C.bg, borderRadius: r(10), fontSize: 11.5, color: C.ink2, fontWeight: 600 }}>📦 {p.use}</div>
            <button onClick={() => { setAmount(p.defAmt); setTenor(p.defTenor); setApplyOpen(true); }} style={{ width: "100%", marginTop: 12, padding: "10px 14px", borderRadius: r(999), background: p.popular ? C.ink : C.white, color: p.popular ? C.white : C.ink, border: p.popular ? "none" : `1.5px solid ${C.ink}`, fontSize: 12, fontWeight: 800, fontFamily: F, cursor: "pointer" }}>Pilih paket ini</button>
          </div>
        ))}
      </div>

      {/* Simulation modal */}
      <Modal open={simOpen} onClose={() => setSimOpen(false)} title="Simulasi Pembiayaan" subtitle="Akad murabahah · margin flat 1.2%/bulan.">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={fieldLabel}>Jumlah pembiayaan: <b style={{ color: C.ink }}>{rp(amount * 1_000_000)}</b></label>
            <input type="range" min={5} max={200} step={5} value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: "100%", accentColor: C.sky }} />
          </div>
          <div>
            <label style={fieldLabel}>Tenor</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[6, 12, 24].map((t) => (
                <button key={t} onClick={() => setTenor(t)} style={{ flex: 1, padding: "10px", borderRadius: r(12), border: `1.5px solid ${tenor === t ? C.sky : C.line}`, background: tenor === t ? C.sky : C.white, color: tenor === t ? C.white : C.ink2, fontWeight: 800, fontSize: 13, fontFamily: F, cursor: "pointer" }}>{t} bln</button>
              ))}
            </div>
          </div>
          <div style={{ background: C.skySoft, borderRadius: r(12), padding: 16 }}>
            {([["Angsuran / bulan", rp(sim.installment)], ["Total bayar", rp(sim.total)], ["Total margin", rp(sim.total - sim.principal)]] as const).map(([k, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: i === 0 ? 15 : 13 }}>
                <span style={{ color: C.ink2, fontWeight: 600 }}>{k}</span>
                <span style={{ fontWeight: 900, color: i === 0 ? C.skyDeep : C.ink }}>{v}</span>
              </div>
            ))}
          </div>
          <PrimaryButton onClick={() => { setSimOpen(false); setApplyOpen(true); }}>Lanjut Ajukan</PrimaryButton>
        </div>
      </Modal>

      {/* Apply modal */}
      <Modal open={applyOpen} onClose={() => setApplyOpen(false)} title="Ajukan Pembiayaan" subtitle="Pengajuan akan diproses tim BSya (demo).">
        <div style={{ background: C.skySoft, borderRadius: r(12), padding: 16, marginBottom: 16 }}>
          {([["Jumlah", rp(amount * 1_000_000)], ["Tenor", `${tenor} bulan`], ["Akad", "Murabahah"], ["Angsuran / bulan", rp(sim.installment)]] as const).map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13 }}>
              <span style={{ color: C.ink2, fontWeight: 600 }}>{k}</span>
              <span style={{ fontWeight: 800, color: C.ink }}>{v}</span>
            </div>
          ))}
        </div>
        <PrimaryButton onClick={submitApply}>Kirim Pengajuan</PrimaryButton>
      </Modal>
    </div>
  );
}
