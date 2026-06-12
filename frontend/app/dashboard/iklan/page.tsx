"use client";

import React, { useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader, Deco, Mark } from "@/components/ui";
import { useProfile, useIdentity } from "@/context/ProfileContext";
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
  const { businessName, category } = useIdentity();
  const m = useIsMobile();
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

  const copy = () => {
    if (!result) return;
    navigator.clipboard?.writeText(result).then(
      () => toast("Caption disalin ke clipboard.", "ok"),
      () => toast("Gagal menyalin caption.", "info"),
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <div style={{ borderRadius: r(22), padding: m ? 20 : 28, color: C.white, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.sky}, ${C.skyDeep})` }}>
        <Deco size={80} rotate={25} color={C.yellow} style={{ position: "absolute", right: -16, top: -20, opacity: 0.85 }} />
        <Deco size={36} rotate={-15} color="rgba(255,255,255,0.25)" style={{ position: "absolute", right: 100, top: 30 }} />
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 0.5, textTransform: "uppercase" }}>Buat Iklan dengan AI</div>
        <div style={{ fontSize: m ? 21 : 28, fontWeight: 900, marginTop: 6, marginBottom: 8, letterSpacing: -0.6, maxWidth: 540, lineHeight: 1.2 }}>Cukup deskripsikan produk — AI akan buatkan visual & teks dalam 30 detik</div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Buatkan iklan untuk warung sembako saya dengan promo lebaran, audience ibu rumah tangga umur 25-45…"
          rows={2}
          style={{ width: "100%", background: "rgba(0,0,0,0.2)", borderRadius: r(12), padding: 14, marginTop: 18, fontSize: 13, fontWeight: 600, color: C.white, border: "1px solid rgba(255,255,255,0.25)", outline: "none", fontFamily: F, resize: "vertical", boxSizing: "border-box" }}
        />
        <button onClick={generate} disabled={loading || !desc.trim()} style={{ background: C.yellow, color: C.ink, border: "none", marginTop: 16, padding: "12px 20px", borderRadius: r(999), fontSize: 13, fontWeight: 800, fontFamily: F, cursor: loading || !desc.trim() ? "not-allowed" : "pointer", opacity: !desc.trim() ? 0.7 : 1 }}>
          {loading ? "⏳ Membuat iklan…" : "✨ Mulai buat iklan →"}
        </button>
      </div>

      {result && (
        <div style={{ background: C.white, borderRadius: r(18), padding: m ? 16 : 22, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 900, letterSpacing: -0.2 }}>Hasil iklan untuk {businessName}</div>
              <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, marginTop: 2 }}>Pratinjau tampilan di sosial media · contoh ilustrasi</div>
            </div>
            <button onClick={copy} style={{ background: C.skySoft, color: C.skyDeep, border: "none", padding: "8px 14px", borderRadius: r(999), fontSize: 12, fontWeight: 800, fontFamily: F, cursor: "pointer" }}>⧉ Salin caption</button>
          </div>

          <div style={{ background: C.bg, borderRadius: r(14), padding: 14, fontSize: 12.5, fontWeight: 600, lineHeight: 1.55, whiteSpace: "pre-wrap", color: C.ink2, border: `1px solid ${C.line}` }}>{result}</div>

          <SocialPreviews caption={result} businessName={businessName} category={category} isMobile={m} />
        </div>
      )}
    </div>
  );
}

// ─── Social media ad previews (IG / TikTok / Facebook) ───
function slugifyHandle(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 18) || "tokoumkm";
}
function deriveHeadline(text: string) {
  const first = (text.split(/\n|(?<=[.!?])\s/).find((s) => s.trim().length > 3) || text).trim();
  return first.length > 58 ? first.slice(0, 55).trimEnd() + "…" : first;
}
function adEmoji(category?: string, name?: string) {
  const s = `${category ?? ""} ${name ?? ""}`.toLowerCase();
  if (/(kopi|coffee|cafe|kafe|minuman|teh|juice)/.test(s)) return "☕";
  if (/(roti|bakery|kue|cake|donat|pastr)/.test(s)) return "🥐";
  if (/(sembako|warung|grocer|kelontong)/.test(s)) return "🛒";
  if (/(fashion|baju|hijab|pakaian|busana|gamis)/.test(s)) return "👗";
  if (/(makan|food|kuliner|resto|warteg|nasi|ayam|bakso|catering)/.test(s)) return "🍛";
  if (/(skincare|kosmetik|beauty|kecantikan|parfum)/.test(s)) return "💄";
  if (/(elektronik|gadget|hp|aksesoris)/.test(s)) return "📱";
  return "🛍️";
}

function SocialPreviews({ caption, businessName, category, isMobile }: { caption: string; businessName: string; category?: string; isMobile: boolean }) {
  const headline = deriveHeadline(caption);
  const handle = slugifyHandle(businessName);
  const emoji = adEmoji(category, businessName);
  const tags = [`#${businessName.replace(/\s+/g, "")}`, "#UMKM", "#PromoSpesial", "#BCASyariah"];
  const shared = { caption, businessName, handle, emoji, headline, tags };
  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, alignItems: "start" }}>
      <InstagramCard {...shared} />
      <TikTokCard {...shared} />
      <FacebookCard {...shared} />
    </div>
  );
}

type CardProps = { caption: string; businessName: string; handle: string; emoji: string; headline: string; tags: string[] };

function PlatformLabel({ icon, name, color }: { icon: React.ReactNode; name: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
      <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ fontSize: 11.5, fontWeight: 800, color }}>{name}</div>
    </div>
  );
}

function Visual({ emoji, headline, gradient, height, dark }: { emoji: string; headline: string; gradient: string; height: number; dark?: boolean }) {
  return (
    <div style={{ position: "relative", height, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Deco size={70} rotate={20} color="rgba(255,255,255,0.18)" style={{ position: "absolute", right: -10, top: -16 }} />
      <div style={{ fontSize: height > 280 ? 84 : 56, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.25))" }}>{emoji}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 14px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.55))" }}>
        <div style={{ color: "#fff", fontSize: dark ? 16 : 15, fontWeight: 900, lineHeight: 1.2, letterSpacing: -0.3, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>{headline}</div>
      </div>
    </div>
  );
}

function InstagramCard({ caption, businessName, handle, emoji, headline, tags }: CardProps) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: r(14), overflow: "hidden", background: C.white }}>
      <PlatformLabel name="Instagram" color="#C13584" icon={SIc.instagram(18)} />
      <div style={{ border: `1px solid ${C.line}`, borderRadius: r(10), overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px" }}>
          <Mark size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{handle}</div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>Bersponsor</div>
          </div>
          {SIc.dots(18, C.ink2)}
        </div>
        <Visual emoji={emoji} headline={headline} gradient={`linear-gradient(135deg, ${C.yellow}, ${C.yellowDeep})`} height={210} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 10px 4px" }}>
          {SIc.heart(22)} {SIc.comment(22)} {SIc.send(22)}
          <div style={{ flex: 1 }} />
          {SIc.bookmark(22)}
        </div>
        <div style={{ padding: "2px 10px 12px" }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: C.ink }}>Disukai 1.248 orang</div>
          <div style={{ fontSize: 11.5, color: C.ink, lineHeight: 1.5, marginTop: 3 }}>
            <span style={{ fontWeight: 800 }}>{handle}</span> {clip(caption, 90)}
          </div>
          <div style={{ fontSize: 11.5, color: "#1d6fd6", fontWeight: 600, marginTop: 3 }}>{tags.join(" ")}</div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 5, fontWeight: 600 }}>Lihat semua 86 komentar</div>
        </div>
      </div>
    </div>
  );
}

function TikTokCard({ caption, handle, emoji, headline }: CardProps) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: r(14), overflow: "hidden", background: C.white }}>
      <PlatformLabel name="TikTok" color="#010101" icon={SIc.tiktok(17)} />
      <div style={{ position: "relative", borderRadius: r(10), overflow: "hidden", background: "#000" }}>
        <div style={{ position: "relative" }}>
          <Visual emoji={emoji} headline="" gradient="linear-gradient(160deg, #2b2b3a, #0c0c14)" height={300} dark />
          {/* center headline */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, padding: 16, pointerEvents: "none" }}>
            <div style={{ fontSize: 64, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.4))" }}>{emoji}</div>
            <div style={{ color: "#fff", fontSize: 15, fontWeight: 900, textAlign: "center", lineHeight: 1.25, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{headline}</div>
          </div>
          {/* right action rail */}
          <div style={{ position: "absolute", right: 8, bottom: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <Mark size={34} />
            {railIcon(SIc.heart(26, "#fff"), "21.4K")}
            {railIcon(SIc.comment(26, "#fff"), "1.2K")}
            {railIcon(SIc.send(26, "#fff"), "Bagikan")}
          </div>
          {/* bottom caption */}
          <div style={{ position: "absolute", left: 10, right: 64, bottom: 10 }}>
            <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 800, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>@{handle}</div>
            <div style={{ color: "#fff", fontSize: 11.5, fontWeight: 500, lineHeight: 1.4, marginTop: 3, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{clip(caption, 70)}</div>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: 600, marginTop: 4, opacity: 0.95 }}>♫ Audio promosi · {handle}</div>
          </div>
          <div style={{ position: "absolute", left: 10, top: 10, background: "rgba(0,0,0,0.45)", color: "#fff", fontSize: 9.5, fontWeight: 800, padding: "3px 8px", borderRadius: 6, letterSpacing: 0.4 }}>Bersponsor</div>
        </div>
      </div>
    </div>
  );
}

function FacebookCard({ caption, businessName, handle, emoji, headline }: CardProps) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: r(14), overflow: "hidden", background: C.white }}>
      <PlatformLabel name="Facebook" color="#1877F2" icon={SIc.facebook(18)} />
      <div style={{ border: `1px solid ${C.line}`, borderRadius: r(10), overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 10px 8px" }}>
          <Mark size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: C.ink }}>{businessName}</div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>Bersponsor · {SIc.globe(11, C.muted)}</div>
          </div>
          {SIc.dots(18, C.ink2)}
        </div>
        <div style={{ padding: "0 10px 10px", fontSize: 12, color: C.ink, lineHeight: 1.5 }}>{clip(caption, 120)}</div>
        <Visual emoji={emoji} headline={headline} gradient={`linear-gradient(135deg, ${C.sky}, ${C.skyDeep})`} height={170} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px", background: "#F0F2F5" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9.5, color: C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3 }}>{handle}.bsya.id</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{headline}</div>
          </div>
          <button style={{ background: "#E4E6EB", color: C.ink, border: "none", padding: "8px 12px", borderRadius: 8, fontSize: 11.5, fontWeight: 800, fontFamily: F, cursor: "pointer", flexShrink: 0 }}>Pesan</button>
        </div>
        <div style={{ display: "flex", borderTop: `1px solid ${C.line}` }}>
          {[["👍", "Suka"], ["💬", "Komentari"], ["↪", "Bagikan"]].map(([ic, label]) => (
            <div key={label} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px 0", fontSize: 11.5, fontWeight: 700, color: C.ink2 }}>
              <span style={{ fontSize: 13 }}>{ic}</span> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function railIcon(icon: React.ReactNode, label: string) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      {icon}
      <span style={{ color: "#fff", fontSize: 9.5, fontWeight: 700, textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>{label}</span>
    </div>
  );
}

function clip(text: string, n: number) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > n ? t.slice(0, n).trimEnd() + "…" : t;
}

// Minimal inline icons for the social previews.
const SIc = {
  heart: (s = 22, c = "#262626") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" /></svg>
  ),
  comment: (s = 22, c = "#262626") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-11.9 7.6L3 21l1.9-6.1A8.4 8.4 0 1 1 21 11.5z" /></svg>
  ),
  send: (s = 22, c = "#262626") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" /></svg>
  ),
  bookmark: (s = 22, c = "#262626") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
  ),
  dots: (s = 18, c = "#262626") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
  ),
  globe: (s = 12, c = "#7A8FA3") => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" /></svg>
  ),
  instagram: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24"><defs><linearGradient id="igg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#FEDA75" /><stop offset="0.45" stopColor="#FA7E1E" /><stop offset="0.7" stopColor="#D62976" /><stop offset="1" stopColor="#962FBF" /></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#igg)" /><circle cx="12" cy="12" r="4.6" fill="none" stroke="#fff" strokeWidth="1.7" /><circle cx="17.4" cy="6.6" r="1.3" fill="#fff" /></svg>
  ),
  tiktok: (s = 17) => (
    <svg width={s} height={s} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="#010101" /><path d="M16.4 8.3a3.6 3.6 0 0 1-2.3-1.6v5.9a3.4 3.4 0 1 1-3.4-3.4c.2 0 .3 0 .5.1v1.9a1.6 1.6 0 1 0 1.1 1.5V5.5h1.8c.2 1.2 1 2.1 2.1 2.4z" fill="#fff" /></svg>
  ),
  facebook: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6" fill="#1877F2" /><path d="M13.6 21v-7h2.1l.4-2.6h-2.5v-1.5c0-.7.3-1.2 1.3-1.2h1.2V6.4a18 18 0 0 0-1.9-.1c-2 0-3.3 1.2-3.3 3.3V11.4H8.6V14h1.8v7z" fill="#fff" /></svg>
  ),
};
