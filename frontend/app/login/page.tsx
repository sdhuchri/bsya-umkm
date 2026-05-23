"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { C, F, r } from "@/lib/theme";
import { Mark, Deco } from "@/components/ui";
import { getProfile, setLoggedIn } from "@/lib/profile";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated login — no real auth in the prototype.
    setLoggedIn(true);
    router.replace(getProfile() ? "/dashboard" : "/onboarding");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.sky, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: F, position: "relative", overflow: "hidden" }}>
      <Deco size={120} rotate={18} color={C.yellow} style={{ position: "absolute", right: "8%", top: "10%", opacity: 0.85 }} />
      <Deco size={40} rotate={-20} color="rgba(255,255,255,0.25)" style={{ position: "absolute", left: "12%", top: "20%" }} />
      <Deco size={28} rotate={45} color={C.yellow} style={{ position: "absolute", left: "18%", bottom: "14%", opacity: 0.6 }} />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: C.white,
          borderRadius: r(24),
          padding: 36,
          boxShadow: "0 30px 60px rgba(11,39,64,0.18)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <Mark size={48} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.4, color: C.ink }}>
              BSya UMKM<span style={{ color: C.yellowDeep }}>+</span>
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, letterSpacing: 0.5, textTransform: "uppercase" }}>Super App · Powered by AI</div>
          </div>
        </div>

        <div style={{ fontSize: 24, fontWeight: 900, color: C.ink, letterSpacing: -0.5 }}>Masuk ke akunmu</div>
        <div style={{ fontSize: 13.5, color: C.ink2, fontWeight: 600, marginTop: 6, marginBottom: 24 }}>
          Kelola keuangan, pajak, dan modal usahamu dalam satu tempat.
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Nomor HP / Email">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0812xxxxxxx" style={inputStyle} />
          </Field>
          <Field label="PIN / Password">
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••••" style={inputStyle} />
          </Field>

          <button
            type="submit"
            style={{
              marginTop: 8,
              background: C.ink,
              color: C.white,
              border: "none",
              padding: 15,
              borderRadius: r(999),
              fontFamily: F,
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 8px 20px rgba(11,39,64,0.18)",
            }}
          >
            Masuk
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: C.yellow, color: C.ink, fontWeight: 900, fontSize: 14, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>→</span>
          </button>
        </form>

        <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600, textAlign: "center", marginTop: 18, lineHeight: 1.5 }}>
          Mode prototipe — login disimulasikan. Cukup tekan <b style={{ color: C.ink2 }}>Masuk</b> untuk mencoba.
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "13px 15px",
  fontSize: 14,
  fontFamily: F,
  fontWeight: 700,
  color: C.ink,
  border: `1.5px solid ${C.line}`,
  borderRadius: r(12),
  outline: "none",
  background: C.white,
  width: "100%",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: C.ink2 }}>{label}</span>
      {children}
    </label>
  );
}
