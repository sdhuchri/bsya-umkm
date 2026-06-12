"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { C, F, r } from "@/lib/theme";
import { Deco } from "@/components/ui";
import { Ic } from "@/components/icons";
import { useIdentity, useProfile } from "@/context/ProfileContext";
import { aiInsight } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Modal, PrimaryButton, fieldLabel, inputStyle } from "@/components/Modal";
import { useIsMobile } from "@/lib/useIsMobile";
import { Sparkles } from "@/components/ui/sparkles";

type Tx = { name: string; cat: string; amt: string; time: string; neg: boolean };

const INITIAL_TX: Tx[] = [
  { name: "Toko Beras Pak Karim", cat: "Supplier · Sembako", amt: "-Rp 2.450.000", time: "Hari ini, 09:21", neg: true },
  { name: "GoFood — Pesanan #4821", cat: "Pemasukan online", amt: "+Rp 184.000", time: "Hari ini, 08:14", neg: false },
  { name: "Setor Tunai", cat: "Setoran kasir", amt: "+Rp 1.200.000", time: "Kemarin, 17:05", neg: false },
  { name: "PLN — Token Listrik", cat: "Operasional", amt: "-Rp 200.000", time: "Kemarin, 11:32", neg: true },
];

export default function DashboardHome() {
  const [txs, setTxs] = useState<Tx[]>(INITIAL_TX);
  const [catatOpen, setCatatOpen] = useState(false);
  const m = useIsMobile();

  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <GreetingBanner />
      <KpiRow />
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.55fr 1fr", gap: m ? 14 : 18 }}>
        <CashflowCard />
        <AIInsightCard />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1.1fr", gap: m ? 14 : 18 }}>
        <QuickActionsCard onCatat={() => setCatatOpen(true)} />
        <RecentTransactionsCard txs={txs} />
      </div>
      <CatatTransaksiModal open={catatOpen} onClose={() => setCatatOpen(false)} onAdd={(t) => setTxs((p) => [t, ...p])} />
    </div>
  );
}

function CatatTransaksiModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (t: Tx) => void }) {
  const [name, setName] = useState("");
  const [cat, setCat] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"in" | "out">("in");
  const valid = name.trim() && amount.trim();

  const submit = () => {
    if (!valid) return;
    const num = Number(amount.replace(/\D/g, ""));
    const formatted = "Rp " + num.toLocaleString("id-ID");
    onAdd({
      name: name.trim(),
      cat: cat.trim() || (type === "in" ? "Pemasukan" : "Pengeluaran"),
      amt: (type === "in" ? "+" : "-") + formatted,
      time: "Baru saja",
      neg: type === "out",
    });
    toast("Transaksi tercatat. (demo)", "ok");
    setName(""); setCat(""); setAmount(""); setType("in");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Catat Transaksi" subtitle="Tambahkan pemasukan atau pengeluaran.">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          {(["in", "out"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)} style={{ flex: 1, padding: 10, borderRadius: r(12), border: `1.5px solid ${type === t ? C.sky : C.line}`, background: type === t ? C.sky : C.white, color: type === t ? C.white : C.ink2, fontWeight: 800, fontSize: 13, fontFamily: F, cursor: "pointer" }}>
              {t === "in" ? "↓ Pemasukan" : "↑ Pengeluaran"}
            </button>
          ))}
        </div>
        <div>
          <label style={fieldLabel}>Keterangan</label>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Penjualan kopi hari ini" />
        </div>
        <div>
          <label style={fieldLabel}>Kategori (opsional)</label>
          <input style={inputStyle} value={cat} onChange={(e) => setCat(e.target.value)} placeholder="mis. Penjualan" />
        </div>
        <div>
          <label style={fieldLabel}>Nominal (Rp)</label>
          <input style={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="mis. 250000" inputMode="numeric" />
        </div>
        <PrimaryButton onClick={submit} disabled={!valid}>Simpan Transaksi</PrimaryButton>
      </div>
    </Modal>
  );
}

function GreetingBanner() {
  const { ownerName } = useIdentity();
  return (
    <div style={{ borderRadius: r(18), padding: "20px 24px", position: "relative", overflow: "hidden", background: `linear-gradient(100deg, ${C.sky} 0%, ${C.skyDeep} 100%)`, color: C.white }}>
      <Sparkles count={26} color="rgba(255,255,255,0.85)" />
      <Deco size={42} rotate={18} color="rgba(255,217,61,0.85)" style={{ position: "absolute", right: 28, top: 14 }} />
      <Deco size={22} rotate={-22} color="rgba(255,255,255,0.3)" style={{ position: "absolute", right: 90, bottom: 16 }} />
      <Deco size={14} rotate={45} color={C.yellow} style={{ position: "absolute", right: 200, top: 22 }} />
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", opacity: 0.85, marginBottom: 4 }}>Senin · 27 April 2026</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3, marginBottom: 4 }}>Hai, {ownerName.split(" ")[0]} 👋 Yuk kelola bisnismu hari ini</div>
      <div style={{ fontSize: 13, opacity: 0.92, fontWeight: 500 }}>AI BSya sudah merangkum 47 transaksi dari rekening kamu pagi ini.</div>
    </div>
  );
}

function KpiRow() {
  const m = useIsMobile();
  const kpis = [
    { label: "Pemasukan Bulan Ini", value: "Rp 42.850.000", delta: "+12.4%", up: true as const, accent: C.sky },
    { label: "Pengeluaran", value: "Rp 28.140.000", delta: "+18.2%", up: false as const, accent: "#E97373" },
    { label: "Saldo Rekening", value: "Rp 87.420.500", delta: "tersinkron", up: null, accent: C.ink },
    { label: "Estimasi Pajak", value: "Rp 245.000", delta: "PPh Final 0.5%", up: null, accent: C.yellowDeep },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: m ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: m ? 10 : 14 }}>
      {kpis.map((k, i) => (
        <div key={i} style={{ background: C.white, borderRadius: r(16), padding: "16px 18px", border: `1px solid ${C.line}` }}>
          <div style={{ width: 32, height: 32, borderRadius: r(9), background: C.skySoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{Ic.wallet(16, k.accent)}</div>
          <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 700, marginBottom: 4 }}>{k.label}</div>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3, marginBottom: 6 }}>{k.value}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: k.up === true ? C.ok : k.up === false ? "#E97373" : C.muted, background: k.up === true ? "#E5F7EE" : k.up === false ? "#FCEAEA" : C.bg, padding: "3px 8px", borderRadius: 999 }}>
            {k.up === true ? "↑ " : k.up === false ? "↑ " : ""}
            {k.delta}
          </div>
        </div>
      ))}
    </div>
  );
}

function CashflowCard() {
  const months = ["Nov", "Des", "Jan", "Feb", "Mar", "Apr"];
  const inData = [28, 32, 35, 30, 38, 43];
  const outData = [22, 25, 23, 26, 24, 28];
  const max = 50, W = 480, H = 180, pad = 28;
  const stepX = (W - pad * 2) / (months.length - 1);
  const ptX = (i: number) => pad + i * stepX;
  const ptY = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const linePath = (data: number[]) => data.map((v, i) => `${i === 0 ? "M" : "L"} ${ptX(i)} ${ptY(v)}`).join(" ");
  const areaPath = (data: number[]) => `${linePath(data)} L ${ptX(months.length - 1)} ${H - pad} L ${ptX(0)} ${H - pad} Z`;
  return (
    <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.2 }}>Arus Kas 6 Bulan</div>
          <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, marginTop: 2 }}>Otomatis dari mutasi rekening</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 11.5, fontWeight: 700 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.ink2 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.sky }} />Pemasukan
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.ink2 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.yellowDeep }} />Pengeluaran
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="180" style={{ display: "block" }}>
        <defs>
          <linearGradient id="areaIn" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={C.sky} stopOpacity={0.28} />
            <stop offset="100%" stopColor={C.sky} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} stroke={C.line} strokeDasharray="3 4" />
        ))}
        <path d={areaPath(inData)} fill="url(#areaIn)" />
        <path d={linePath(inData)} stroke={C.sky} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={linePath(outData)} stroke={C.yellowDeep} strokeWidth="2.2" fill="none" strokeDasharray="5 4" strokeLinecap="round" />
        {inData.map((v, i) => (
          <circle key={i} cx={ptX(i)} cy={ptY(v)} r="5" fill={C.yellow} stroke={C.white} strokeWidth="2" />
        ))}
        {months.map((m, i) => (
          <text key={m} x={ptX(i)} y={H - 8} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={C.muted} fontFamily={F}>{m}</text>
        ))}
      </svg>
    </div>
  );
}

function AIInsightCard() {
  const router = useRouter();
  const profile = useProfile();
  const [insight, setInsight] = useState<{ title: string; body: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    aiInsight(profile)
      .then((data) => {
        if (alive) setInsight(data);
      })
      .catch(() => {
        if (alive) setInsight({ title: "Pengeluaran sembako naik 18% bulan ini", body: "Kami menemukan 3 supplier di Bekasi yang bisa hemat sampai Rp 1.4jt/bulan." });
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [profile]);

  return (
    <div style={{ borderRadius: r(18), padding: 20, position: "relative", overflow: "hidden", background: `linear-gradient(160deg, ${C.yellow} 0%, ${C.yellowDeep} 100%)`, color: C.ink }}>
      <Deco size={56} rotate={28} color="rgba(255,255,255,0.35)" style={{ position: "absolute", right: -10, top: -14 }} />
      <Deco size={20} rotate={-12} color={C.ink} style={{ position: "absolute", right: 30, bottom: 14, opacity: 0.08 }} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.ink, color: C.yellow, fontSize: 10.5, fontWeight: 800, padding: "4px 10px", borderRadius: 999, marginBottom: 12, letterSpacing: 0.4 }}>
        {Ic.spark(11, C.yellow)} AI INSIGHT
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.3, marginBottom: 8, letterSpacing: -0.2, minHeight: 21 }}>{loading ? "Menganalisis transaksimu…" : insight?.title}</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5, fontWeight: 600, marginBottom: 14, opacity: 0.85, minHeight: 38 }}>{loading ? "Sebentar ya, BSya AI sedang merangkum." : insight?.body}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => router.push("/dashboard/supplier")} style={{ background: C.ink, color: C.white, border: "none", padding: "9px 14px", borderRadius: r(999), fontSize: 12, fontWeight: 700, fontFamily: F, cursor: "pointer" }}>Lihat supplier →</button>
        <button onClick={() => toast("Oke, insight ini saya simpan untuk nanti.", "info")} style={{ background: "rgba(255,255,255,0.55)", color: C.ink, border: "none", padding: "9px 14px", borderRadius: r(999), fontSize: 12, fontWeight: 700, fontFamily: F, cursor: "pointer" }}>Nanti saja</button>
      </div>
    </div>
  );
}

function QuickActionsCard({ onCatat }: { onCatat: () => void }) {
  const router = useRouter();
  const actions = [
    { ic: Ic.receipt, label: "Catat\nTransaksi", color: C.sky, run: onCatat },
    { ic: Ic.calc, label: "Hitung\nPajak", color: C.yellowDeep, run: () => router.push("/dashboard/pajak") },
    { ic: Ic.store, label: "Cari\nSupplier", color: "#7BC678", run: () => router.push("/dashboard/supplier") },
    { ic: Ic.image, label: "Buat\nIklan", color: "#E97373", run: () => router.push("/dashboard/iklan") },
  ];
  return (
    <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, letterSpacing: -0.2 }}>Aksi Cepat</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {actions.map((a, i) => (
          <button key={i} onClick={a.run} style={{ background: C.bg, borderRadius: r(14), padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, cursor: "pointer", fontFamily: F }}>
            <div style={{ width: 40, height: 40, borderRadius: r(12), background: C.white, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.line}` }}>{a.ic(20, a.color)}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.25 }}>{a.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RecentTransactionsCard({ txs }: { txs: Tx[] }) {
  return (
    <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: -0.2 }}>Transaksi Terbaru</div>
        <button onClick={() => toast("Menampilkan semua transaksi belum tersedia. (demo)", "info")} style={{ fontSize: 11.5, color: C.skyDeep, fontWeight: 700, background: "transparent", border: "none", cursor: "pointer", fontFamily: F }}>Lihat semua →</button>
      </div>
      {txs.map((tx, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
          <div style={{ width: 36, height: 36, borderRadius: r(10), background: tx.neg ? "#FCEAEA" : "#E5F7EE", color: tx.neg ? "#E97373" : C.ok, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{tx.neg ? "↑" : "↓"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>{tx.name}</div>
            <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600 }}>{tx.cat} · {tx.time}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: tx.neg ? "#D04848" : C.ok }}>{tx.amt}</div>
        </div>
      ))}
    </div>
  );
}
