"use client";

import React, { useState } from "react";
import { C, F, r } from "@/lib/theme";
import { PageHeader, Deco } from "@/components/ui";
import { toast } from "@/lib/toast";
import { Modal, PrimaryButton, fieldLabel, inputStyle } from "@/components/Modal";
import { useIsMobile } from "@/lib/useIsMobile";

type Supplier = { name: string; cat: string; loc: string; rating: number; last: string; tag: string };

const INITIAL: Supplier[] = [
  { name: "Toko Beras Pak Karim", cat: "Beras & Sembako", loc: "Bekasi", rating: 4.8, last: "Rp 2.4jt", tag: "sering" },
  { name: "CV Mitra Sejahtera", cat: "Minuman kemasan", loc: "Jakarta Timur", rating: 4.6, last: "Rp 1.8jt", tag: "baru" },
  { name: "Grosir Sumber Rejeki", cat: "Mi instan & snack", loc: "Bogor", rating: 4.9, last: "Rp 3.1jt", tag: "favorit" },
  { name: "PD Anugerah", cat: "Rokok & tembakau", loc: "Bekasi", rating: 4.4, last: "Rp 1.2jt", tag: "" },
];

const RECOMMENDED: Supplier[] = [
  { name: "UD Berkah Tani", cat: "Beras & Sembako", loc: "Bekasi", rating: 4.7, last: "—", tag: "hemat 12%" },
  { name: "CV Sumber Makmur", cat: "Minyak & gula", loc: "Bekasi", rating: 4.5, last: "—", tag: "hemat 9%" },
  { name: "Toko Grosir Amanah", cat: "Snack & minuman", loc: "Bekasi", rating: 4.8, last: "—", tag: "hemat 15%" },
];

export default function SupplierPage() {
  const m = useIsMobile();
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL);
  const [addOpen, setAddOpen] = useState(false);
  const [recOpen, setRecOpen] = useState(false);

  const customers = [
    { name: "Ibu Yanti", spend: "Rp 4.2jt", visits: 47 },
    { name: "Pak Surya", spend: "Rp 2.8jt", visits: 31 },
    { name: "Ibu Lastri", spend: "Rp 2.1jt", visits: 28 },
  ];

  const addSupplier = (s: Supplier) => {
    setSuppliers((prev) => [s, ...prev]);
  };

  return (
    <div style={{ flex: 1, padding: m ? 16 : 24, overflow: "auto", display: "flex", flexDirection: "column", gap: m ? 14 : 18 }}>
      <PageHeader title="Supplier & Customer" subtitle="Kelola jaringan bisnismu dalam satu tempat" />

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.3fr 1fr", gap: m ? 14 : 18 }}>
        <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Supplier Aktif</div>
              <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, marginTop: 2 }}>{suppliers.length} supplier · {suppliers.filter((s) => s.tag === "favorit").length} favorit</div>
            </div>
            <button onClick={() => setAddOpen(true)} style={{ background: C.sky, color: C.white, border: "none", padding: "8px 14px", borderRadius: r(999), fontSize: 12, fontWeight: 700, fontFamily: F, cursor: "pointer" }}>+ Tambah Supplier</button>
          </div>
          {suppliers.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
              <div style={{ width: 42, height: 42, borderRadius: r(12), background: `linear-gradient(135deg, ${C.sky}, ${C.skyDeep})`, color: C.white, fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.3 }}>{s.name}</div>
                  {s.tag && <div style={{ fontSize: 9.5, fontWeight: 800, padding: "2px 7px", borderRadius: 999, background: s.tag === "favorit" ? C.yellow : s.tag === "baru" ? "#E5F7EE" : C.skySoft, color: s.tag === "favorit" ? C.ink : s.tag === "baru" ? C.ok : C.skyDeep, textTransform: "uppercase", letterSpacing: 0.4 }}>{s.tag}</div>}
                </div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>{s.cat} · {s.loc} · ⭐ {s.rating}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12.5, fontWeight: 800 }}>{s.last}</div>
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, marginTop: 2 }}>order terakhir</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderRadius: r(18), padding: 20, color: C.ink, position: "relative", overflow: "hidden", background: `linear-gradient(155deg, ${C.yellow} 0%, ${C.yellowDeep} 100%)` }}>
          <Deco size={56} rotate={28} color="rgba(255,255,255,0.3)" style={{ position: "absolute", right: -10, top: -14 }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.ink, color: C.yellow, fontSize: 10.5, fontWeight: 800, padding: "4px 10px", borderRadius: 999, marginBottom: 12, letterSpacing: 0.4 }}>✨ AI MATCH</div>
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.3, marginBottom: 8, letterSpacing: -0.2 }}>3 supplier baru di Bekasi cocok untukmu</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5, fontWeight: 600, marginBottom: 14, opacity: 0.85 }}>
            Berdasarkan kategori belanja kamu, AI menemukan supplier yang bisa hemat hingga <b>Rp 1.4jt/bulan</b>.
          </div>
          <button onClick={() => setRecOpen(true)} style={{ background: C.ink, color: C.white, border: "none", padding: "10px 16px", borderRadius: r(999), fontSize: 12.5, fontWeight: 700, fontFamily: F, cursor: "pointer" }}>Lihat rekomendasi →</button>
        </div>
      </div>

      <div style={{ background: C.white, borderRadius: r(18), padding: 20, border: `1px solid ${C.line}` }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Top Customer Bulan Ini</div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {customers.map((c, i) => (
            <div key={i} style={{ background: C.bg, borderRadius: r(14), padding: 16, border: `1px solid ${C.line}`, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.yellow, color: C.ink, fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{c.visits} kunjungan</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.ok }}>{c.spend}</div>
            </div>
          ))}
        </div>
      </div>

      <AddSupplierModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addSupplier} />

      <Modal open={recOpen} onClose={() => setRecOpen(false)} title="Rekomendasi Supplier AI" subtitle="3 supplier di Bekasi yang cocok dengan pola belanjamu." width={500}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RECOMMENDED.map((s, i) => {
            const added = suppliers.some((x) => x.name === s.name);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, border: `1px solid ${C.line}`, borderRadius: r(12) }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginTop: 2 }}>{s.cat} · {s.loc} · ⭐ {s.rating}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: C.ok, background: "#E5F7EE", padding: "3px 8px", borderRadius: 999 }}>{s.tag}</span>
                <button
                  onClick={() => {
                    if (added) return;
                    addSupplier({ ...s, tag: "baru", last: "Belum order" });
                    toast(`${s.name} ditambahkan ke supplier aktif.`, "ok");
                  }}
                  disabled={added}
                  style={{ background: added ? C.line : C.ink, color: added ? C.muted : C.white, border: "none", padding: "8px 12px", borderRadius: r(999), fontSize: 11.5, fontWeight: 800, fontFamily: F, cursor: added ? "default" : "pointer" }}
                >
                  {added ? "Ditambahkan" : "+ Tambah"}
                </button>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

function AddSupplierModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (s: Supplier) => void }) {
  const [name, setName] = useState("");
  const [cat, setCat] = useState("");
  const [loc, setLoc] = useState("");

  const valid = name.trim() && cat.trim() && loc.trim();

  const submit = () => {
    if (!valid) return;
    onAdd({ name: name.trim(), cat: cat.trim(), loc: loc.trim(), rating: 5.0, last: "Belum order", tag: "baru" });
    toast(`Supplier "${name.trim()}" ditambahkan.`, "ok");
    setName(""); setCat(""); setLoc("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Tambah Supplier" subtitle="Catat supplier baru ke jaringan bisnismu.">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={fieldLabel}>Nama supplier</label>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="mis. Toko Sembako Jaya" />
        </div>
        <div>
          <label style={fieldLabel}>Kategori</label>
          <input style={inputStyle} value={cat} onChange={(e) => setCat(e.target.value)} placeholder="mis. Beras & Sembako" />
        </div>
        <div>
          <label style={fieldLabel}>Lokasi</label>
          <input style={inputStyle} value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="mis. Bekasi" />
        </div>
        <PrimaryButton onClick={submit} disabled={!valid}>Simpan Supplier</PrimaryButton>
      </div>
    </Modal>
  );
}
