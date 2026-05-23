"use client";

import React, { useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader } from "@/components/ui";
import { toast } from "@/lib/toast";
import { downloadText } from "@/lib/download";
import { useIsMobile } from "@/lib/useIsMobile";

const TABS = ["Laba Rugi", "Neraca", "Arus Kas", "SAK EMKM"] as const;
type Tab = (typeof TABS)[number];

export default function LaporanPage() {
  const [tab, setTab] = useState<Tab>("Laba Rugi");
  const m = useIsMobile();

  const unduh = () => {
    downloadText(`laporan-${tab.toLowerCase().replace(/ /g, "-")}-Q1-2026.txt`, REPORT_TEXT[tab]);
    toast(`Laporan ${tab} (demo) berhasil diunduh.`, "ok");
  };

  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <PageHeader title="Laporan Keuangan" subtitle="SAK EMKM siap unduh — diperbarui otomatis tiap hari" />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((s) => {
          const active = tab === s;
          return (
            <button key={s} onClick={() => setTab(s)} style={{ padding: "8px 14px", borderRadius: r(999), fontSize: 12, fontWeight: 700, background: active ? C.ink : C.white, color: active ? C.white : C.ink2, border: `1px solid ${active ? C.ink : C.line}`, cursor: "pointer", fontFamily: F }}>{s}</button>
          );
        })}
        <div style={{ flex: 1 }} />
        <button onClick={unduh} style={{ padding: "8px 14px", borderRadius: r(999), fontSize: 12, fontWeight: 700, background: C.yellow, color: C.ink, border: "none", cursor: "pointer", fontFamily: F }}>↓ Unduh PDF</button>
      </div>

      {tab === "Laba Rugi" && <LabaRugi />}
      {tab === "Neraca" && <Neraca />}
      {tab === "Arus Kas" && <ArusKas />}
      {tab === "SAK EMKM" && <SakEmkm />}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>{children}</div>;
}

function Row({ k, v, neg, bold }: { k: string; v: string; neg?: boolean; bold?: boolean; first?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `1px solid ${C.line}`, fontSize: 13 }}>
      <span style={{ color: bold ? C.ink : C.ink2, fontWeight: bold ? 800 : 600 }}>{k}</span>
      <span style={{ fontWeight: 800, color: neg ? "#D04848" : bold ? C.ink : C.ok }}>{neg ? "-" : ""}{v}</span>
    </div>
  );
}

// ─── Laba Rugi ───
function LabaRugi() {
  const m = useIsMobile();
  const months = ["Jan", "Feb", "Mar", "Apr"];
  const profit = [8, 11, 14, 18];
  const max = 22;
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? 10 : 14 }}>
        {[
          { k: "Total Pendapatan", v: "Rp 142.8jt", sub: "Q1 2026", accent: C.sky },
          { k: "Total Beban", v: "Rp 89.4jt", sub: "HPP + Operasional", accent: "#E97373" },
          { k: "Laba Bersih", v: "Rp 53.4jt", sub: "Margin 37.4%", accent: C.ok },
        ].map((m, i) => (
          <div key={i} style={{ background: C.white, borderRadius: r(16), padding: 20, border: `1px solid ${C.line}` }}>
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 700 }}>{m.k}</div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4, marginTop: 4, color: m.accent }}>{m.v}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16 }}>Laba Bersih per Bulan</div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 24, height: 180, padding: "0 12px" }}>
          {profit.map((v, i) => (
            <div key={i} style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.ink }}>Rp {v}jt</div>
              <div style={{ width: "100%", maxWidth: 90, height: `${(v / max) * 100}%`, minHeight: 6, background: `linear-gradient(180deg, ${C.yellow}, ${C.yellowDeep})`, borderRadius: `${r(12)}px ${r(12)}px 4px 4px` }} />
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 700 }}>{months[i]}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Rincian Laba Rugi</div>
        <Row k="Penjualan barang dagangan" v="Rp 138.2jt" />
        <Row k="Pendapatan jasa" v="Rp 4.6jt" />
        <Row k="Harga Pokok Penjualan" v="Rp 71.3jt" neg />
        <Row k="Beban gaji karyawan" v="Rp 12.0jt" neg />
        <Row k="Beban listrik & air" v="Rp 3.8jt" neg />
        <Row k="Beban operasional lain" v="Rp 2.3jt" neg />
        <Row k="Laba Bersih" v="Rp 53.4jt" bold />
      </Card>
    </>
  );
}

// ─── Neraca ───
function Neraca() {
  const m = useIsMobile();
  return (
    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 14 }}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Aset</div>
        <Row k="Kas & setara kas" v="Rp 87.4jt" />
        <Row k="Piutang usaha" v="Rp 12.6jt" />
        <Row k="Persediaan barang" v="Rp 34.2jt" />
        <Row k="Peralatan (neto)" v="Rp 18.0jt" />
        <Row k="Total Aset" v="Rp 152.2jt" bold />
      </Card>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Kewajiban & Ekuitas</div>
        <Row k="Utang usaha" v="Rp 21.8jt" neg />
        <Row k="Utang bank (modal kerja)" v="Rp 18.0jt" neg />
        <Row k="Modal disetor" v="Rp 70.0jt" />
        <Row k="Laba ditahan" v="Rp 42.4jt" />
        <Row k="Total Kewajiban & Ekuitas" v="Rp 152.2jt" bold />
      </Card>
    </div>
  );
}

// ─── Arus Kas ───
function ArusKas() {
  return (
    <Card>
      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Laporan Arus Kas — Q1 2026</div>
      <Row k="Kas dari aktivitas operasi" v="Rp 38.2jt" />
      <Row k="Penerimaan dari pelanggan" v="Rp 142.8jt" />
      <Row k="Pembayaran ke supplier" v="Rp 89.4jt" neg />
      <Row k="Kas dari aktivitas investasi" v="Rp 6.0jt" neg />
      <Row k="Pembelian peralatan" v="Rp 6.0jt" neg />
      <Row k="Kas dari aktivitas pendanaan" v="Rp 4.0jt" neg />
      <Row k="Angsuran utang bank" v="Rp 4.0jt" neg />
      <Row k="Kenaikan kas bersih" v="Rp 28.2jt" bold />
    </Card>
  );
}

// ─── SAK EMKM ───
function SakEmkm() {
  return (
    <Card>
      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Catatan atas Laporan Keuangan (SAK EMKM)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          ["Dasar penyusunan", "Laporan disusun sesuai SAK EMKM, berbasis akrual, dalam Rupiah."],
          ["Entitas", "Kopi Kenangan — usaha mikro bidang F&B, NPWP terdaftar."],
          ["Persediaan", "Diukur pada biaya perolehan dengan metode FIFO."],
          ["Pendapatan", "Diakui saat barang/jasa diserahkan ke pelanggan."],
          ["Pajak", "PPh Final UMKM 0.5% atas peredaran bruto bulanan."],
        ].map(([title, body], i) => (
          <div key={i} style={{ background: C.skySoft, borderRadius: r(12), padding: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: C.skyDeep, marginBottom: 3 }}>{i + 1}. {title}</div>
            <div style={{ fontSize: 12.5, color: C.ink2, fontWeight: 600, lineHeight: 1.5 }}>{body}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const REPORT_TEXT: Record<Tab, string> = {
  "Laba Rugi": `LAPORAN LABA RUGI — Q1 2026\nKopi Kenangan\n\nPenjualan barang dagangan   Rp 138.200.000\nPendapatan jasa             Rp   4.600.000\nHarga Pokok Penjualan      -Rp  71.300.000\nBeban gaji karyawan        -Rp  12.000.000\nBeban listrik & air        -Rp   3.800.000\nBeban operasional lain     -Rp   2.300.000\n--------------------------------------------\nLABA BERSIH                 Rp  53.400.000\n`,
  Neraca: `NERACA — per 30 April 2026\nKopi Kenangan\n\nASET\n  Kas & setara kas      Rp  87.400.000\n  Piutang usaha         Rp  12.600.000\n  Persediaan barang     Rp  34.200.000\n  Peralatan (neto)      Rp  18.000.000\n  TOTAL ASET            Rp 152.200.000\n\nKEWAJIBAN & EKUITAS\n  Utang usaha           Rp  21.800.000\n  Utang bank            Rp  18.000.000\n  Modal disetor         Rp  70.000.000\n  Laba ditahan          Rp  42.400.000\n  TOTAL                 Rp 152.200.000\n`,
  "Arus Kas": `LAPORAN ARUS KAS — Q1 2026\nKopi Kenangan\n\nAktivitas operasi     Rp  38.200.000\nAktivitas investasi  -Rp   6.000.000\nAktivitas pendanaan  -Rp   4.000.000\n----------------------------------------\nKenaikan kas bersih   Rp  28.200.000\n`,
  "SAK EMKM": `CATATAN ATAS LAPORAN KEUANGAN (SAK EMKM)\nKopi Kenangan\n\n1. Disusun sesuai SAK EMKM, basis akrual, mata uang Rupiah.\n2. Persediaan: metode FIFO pada biaya perolehan.\n3. Pendapatan diakui saat penyerahan barang/jasa.\n4. Pajak: PPh Final UMKM 0.5% atas peredaran bruto.\n`,
};
