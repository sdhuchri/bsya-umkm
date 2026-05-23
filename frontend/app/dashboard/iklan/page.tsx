"use client";

import React, { useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader, Deco } from "@/components/ui";
import { useProfile } from "@/context/ProfileContext";
import { aiIklan } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Modal } from "@/components/Modal";
import { useIsMobile } from "@/lib/useIsMobile";

const ALL_ADS = [
  { title: "Promo Lebaran Sembako Murah", plat: "Instagram + TikTok", reach: "12.4K", clicks: "847", spent: "Rp 250rb", state: "Aktif" },
  { title: "Diskon 10% Pelanggan Baru", plat: "Facebook Ads", reach: "6.2K", clicks: "412", spent: "Rp 120rb", state: "Aktif" },
  { title: "Buka Cabang Baru Bekasi", plat: "Google Maps", reach: "3.1K", clicks: "198", spent: "Rp 80rb", state: "Selesai" },
  { title: "Bundling Kopi + Roti", plat: "Instagram", reach: "4.8K", clicks: "256", spent: "Rp 60rb", state: "Selesai" },
  { title: "Giveaway Followers 1K", plat: "TikTok", reach: "9.1K", clicks: "523", spent: "Rp 40rb", state: "Selesai" },
];

export default function IklanPage() {
  const m = useIsMobile();
  const ads = ALL_ADS.slice(0, 3);
  const [allOpen, setAllOpen] = useState(false);
  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <PageHeader title="Iklan AI" subtitle="Buat materi & jalankan kampanye dalam hitungan menit" />

      <AdGenerator />

      <div style={{ display: "grid", gridTemplateColumns: m ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: m ? 10 : 14 }}>
        {(
          [
            ["Total reach", "21.7K", "+34% MoM"],
            ["Total clicks", "1.4K", "CTR 6.4%"],
            ["Pengeluaran", "Rp 450rb", "dari budget Rp 600rb"],
            ["ROAS", "4.2×", "di atas target"],
          ] as const
        ).map(([k, v, s], i) => (
          <div key={i} style={{ background: C.white, borderRadius: r(16), padding: 18, border: `1px solid ${C.line}` }}>
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 700 }}>{k}</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, marginTop: 4 }}>{v}</div>
            <div style={{ fontSize: 11, color: C.ok, fontWeight: 700, marginTop: 4 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800 }}>Kampanye Aktif</div>
          <button onClick={() => setAllOpen(true)} style={{ fontSize: 11.5, color: C.skyDeep, fontWeight: 700, background: "transparent", border: "none", cursor: "pointer", fontFamily: F }}>Lihat semua →</button>
        </div>
        {ads.map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
            <div style={{ width: 60, height: 60, borderRadius: r(12), flexShrink: 0, background: i === 0 ? `linear-gradient(135deg, ${C.yellow}, ${C.yellowDeep})` : i === 1 ? `linear-gradient(135deg, ${C.sky}, ${C.skyDeep})` : `linear-gradient(135deg, #7BC678, #4A9648)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 22 }}>{i === 0 ? "🌙" : i === 1 ? "🎁" : "📍"}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 800 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>{a.plat}</div>
            </div>
            <div style={{ display: "flex", gap: 18, fontSize: 12 }}>
              {([["Reach", a.reach], ["Klik", a.clicks], ["Biaya", a.spent]] as const).map(([k, v]) => (
                <div key={k} style={{ textAlign: "right" }}>
                  <div style={{ color: C.muted, fontWeight: 600, fontSize: 10.5 }}>{k}</div>
                  <div style={{ fontWeight: 800 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "5px 10px", borderRadius: 999, fontSize: 10.5, fontWeight: 800, background: a.state === "Aktif" ? C.ok : C.bg, color: a.state === "Aktif" ? C.white : C.muted, letterSpacing: 0.3 }}>{a.state}</div>
          </div>
        ))}
      </div>

      <Modal open={allOpen} onClose={() => setAllOpen(false)} title="Semua Kampanye" subtitle={`${ALL_ADS.length} kampanye sepanjang 2026`} width={560}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ALL_ADS.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: `1px solid ${C.line}`, borderRadius: r(12) }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{a.title}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>{a.plat} · {a.reach} reach · {a.clicks} klik</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.ink2 }}>{a.spent}</div>
              <span style={{ padding: "4px 9px", borderRadius: 999, fontSize: 10, fontWeight: 800, background: a.state === "Aktif" ? C.ok : C.bg, color: a.state === "Aktif" ? C.white : C.muted }}>{a.state}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function AdGenerator() {
  const profile = useProfile();
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await aiIklan(profile, desc);
      setResult(data?.text ?? null);
    } catch {
      setResult("Gagal membuat iklan. Coba lagi sebentar ya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ borderRadius: r(22), padding: 28, color: C.white, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.sky}, ${C.skyDeep})` }}>
      <Deco size={80} rotate={25} color={C.yellow} style={{ position: "absolute", right: -16, top: -20, opacity: 0.85 }} />
      <Deco size={36} rotate={-15} color="rgba(255,255,255,0.25)" style={{ position: "absolute", right: 100, top: 30 }} />
      <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 0.5, textTransform: "uppercase" }}>Buat Iklan dengan AI</div>
      <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6, marginBottom: 8, letterSpacing: -0.6, maxWidth: 540, lineHeight: 1.2 }}>Cukup deskripsikan produk — AI akan buatkan visual & teks dalam 30 detik</div>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Buatkan iklan untuk warung sembako saya dengan promo lebaran, audience ibu rumah tangga umur 25-45…"
        rows={2}
        style={{ width: "100%", background: "rgba(0,0,0,0.2)", borderRadius: r(12), padding: 14, marginTop: 18, fontSize: 13, fontWeight: 600, color: C.white, border: "1px solid rgba(255,255,255,0.25)", outline: "none", fontFamily: F, resize: "vertical" }}
      />
      <button onClick={generate} disabled={loading || !desc.trim()} style={{ background: C.yellow, color: C.ink, border: "none", marginTop: 16, padding: "12px 20px", borderRadius: r(999), fontSize: 13, fontWeight: 800, fontFamily: F, cursor: loading || !desc.trim() ? "not-allowed" : "pointer", opacity: !desc.trim() ? 0.7 : 1 }}>
        {loading ? "⏳ Membuat iklan…" : "✨ Mulai buat iklan →"}
      </button>
      {result && (
        <div style={{ marginTop: 16, background: C.white, color: C.ink, borderRadius: r(14), padding: 16, fontSize: 13, fontWeight: 600, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{result}</div>
      )}
    </div>
  );
}
