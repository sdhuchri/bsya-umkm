"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { C, F, r } from "@/lib/theme";
import { Mark, Deco, ProgressBar, AIBubble, Chip } from "@/components/ui";
import { BRANCH_MAP } from "@/data/questions";
import type { Answer, Branch, BusinessProfile, Question } from "@/types";
import { getProfile, isLoggedIn, saveProfile } from "@/lib/profile";
import { saveProfileRemote } from "@/lib/api";
import { useIsMobile } from "@/lib/useIsMobile";
import { Sparkles } from "@/components/ui/sparkles";
import { TextGenerate } from "@/components/ui/text-generate";

export default function OnboardingPage() {
  const router = useRouter();
  const m = useIsMobile();
  const [ready, setReady] = useState(false);

  // step: -1 welcome · 0 branch · 1..N questions · N+1 summary
  const [step, setStep] = useState(-1);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    if (getProfile()) {
      router.replace("/dashboard");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return <div style={{ minHeight: "100vh", background: C.sky }} />;

  return (
    <div style={{ minHeight: "100vh", background: C.sky, position: "relative", fontFamily: F, overflow: "hidden", padding: m ? "20px 0" : "40px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BackgroundTriangles />
      <div style={{ width: "100%", maxWidth: 1080, padding: m ? "0 14px" : "0 24px", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: m ? 14 : 24, color: C.white }}>
          <Mark size={m ? 38 : 48} />
          <div>
            <div style={{ fontSize: m ? 16 : 20, fontWeight: 900, letterSpacing: -0.4, lineHeight: 1 }}>
              BSya <span style={{ color: C.yellow }}>Grow</span> · Onboarding
            </div>
            <div style={{ fontSize: m ? 9.5 : 11, fontWeight: 700, opacity: 0.85, marginTop: 4, letterSpacing: 0.5 }}>FIRST-TIME LOGIN FLOW · AI AGENT</div>
          </div>
        </div>

        <div style={{ background: C.bg, borderRadius: r(20), overflow: "hidden", display: "flex", minHeight: m ? 560 : 620, boxShadow: "0 30px 60px rgba(11,39,64,0.22)" }}>
          {!m && <DecorativePanel />}
          <div style={{ flex: 1, padding: m ? "22px 18px" : "36px 48px", display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, letterSpacing: 0.5, textTransform: "uppercase" }}>Langkah pertama</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 480, width: "100%", margin: "0 auto" }}>
              <OnboardingFlow
                step={step}
                branch={branch}
                answers={answers}
                setStep={setStep}
                setBranch={setBranch}
                setAnswers={setAnswers}
                onComplete={(profile) => {
                  saveProfile(profile); // local cache for synchronous route guards
                  // Persist to the Go backend (Postgres); non-blocking for UX.
                  saveProfileRemote(profile).catch(() => {});
                  router.replace("/dashboard");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundTriangles() {
  const tris = [
    { l: "4%", t: "12%", s: 32, r: -10 },
    { l: "90%", t: "8%", s: 26, r: 20 },
    { l: "93%", t: "62%", s: 22, r: -25 },
    { l: "5%", t: "72%", s: 28, r: 15 },
    { l: "20%", t: "88%", s: 18, r: 30 },
    { l: "72%", t: "92%", s: 24, r: -15 },
  ];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: `radial-gradient(${C.white} 1.4px, transparent 1.4px)`, backgroundSize: "24px 24px", zIndex: 1 }} />
      {tris.map((tri, i) => (
        <div key={i} style={{ position: "absolute", left: tri.l, top: tri.t, zIndex: 1, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.08))" }}>
          <Deco size={tri.s} rotate={tri.r} color={C.yellow} />
        </div>
      ))}
    </>
  );
}

function DecorativePanel() {
  return (
    <div style={{ flex: "0 0 38%", background: `linear-gradient(160deg, ${C.sky}, ${C.skyDeep})`, color: C.white, padding: 36, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <Sparkles count={36} color="rgba(255,255,255,0.9)" />
      <Deco size={120} rotate={18} color={C.yellow} style={{ position: "absolute", right: -30, top: -40, opacity: 0.85 }} />
      <Deco size={40} rotate={-20} color="rgba(255,255,255,0.2)" style={{ position: "absolute", right: 100, top: 60 }} />
      <Deco size={26} rotate={45} color={C.yellow} style={{ position: "absolute", left: 40, bottom: 100, opacity: 0.6 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
        <Mark size={40} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: -0.3 }}>
            BSya <span style={{ color: C.yellow }}>Grow</span>
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 700, opacity: 0.85, letterSpacing: 0.4, marginTop: 2 }}>SUPER APP · POWERED BY AI</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1, maxWidth: 320 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start", padding: "5px 11px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", borderRadius: 999, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.3, border: "1px solid rgba(255,255,255,0.25)", marginBottom: 18 }}>
          ✨ ONBOARDING AI
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.8, lineHeight: 1.1 }}>
          <TextGenerate words="Yuk kenalan dengan bisnismu." />
        </div>
        <div style={{ fontSize: 14, opacity: 0.92, fontWeight: 600, marginTop: 14, lineHeight: 1.5 }}>
          Beberapa pertanyaan singkat untuk saya pahami kebutuhanmu — jawabannya langsung jadi pengaturan awal aplikasi.
        </div>
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["🎯", "Dashboard yang disesuaikan dengan tipe usahamu"],
            ["📊", "Modul aktif sesuai kebutuhan saja, tidak overwhelming"],
            ["🔒", "Data tersimpan aman di server BCA Syariah"],
          ].map(([i, l], k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: r(10), background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{i}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.95 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ Flow container ═══════════════════════════════════════════════
function OnboardingFlow({
  step,
  branch,
  answers,
  setStep,
  setBranch,
  setAnswers,
  onComplete,
}: {
  step: number;
  branch: Branch | null;
  answers: Record<string, Answer>;
  setStep: (n: number) => void;
  setBranch: (b: Branch | null) => void;
  setAnswers: (a: Record<string, Answer>) => void;
  onComplete: (profile: BusinessProfile) => void;
}) {
  const branchInfo = branch ? BRANCH_MAP[branch] : null;

  if (step === -1) return <WelcomeStep onStart={() => setStep(0)} />;
  if (step === 0)
    return (
      <BranchStep
        onBack={() => setStep(-1)}
        onPick={(b) => {
          setBranch(b);
          setStep(1);
        }}
      />
    );
  if (!branchInfo) return null;

  const qIdx = step - 1;
  if (qIdx < branchInfo.questions.length) {
    const q = branchInfo.questions[qIdx];
    return (
      <QuestionStep
        q={q}
        answer={answers[q.id]}
        stepNum={step + 1}
        totalSteps={branchInfo.questions.length + 1}
        onAnswer={(ans) => setAnswers({ ...answers, [q.id]: ans })}
        onNext={() => setStep(step + 1)}
        onBack={() => setStep(step - 1)}
      />
    );
  }

  return <SummaryStep branch={branch as Branch} answers={answers} onFinish={onComplete} />;
}

function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "0 20px" }}>
        <div style={{ position: "relative" }}>
          <Mark size={88} />
          <Deco size={24} rotate={20} style={{ position: "absolute", top: -8, right: -14 }} />
          <Deco size={18} rotate={-15} color={C.skyDeep} style={{ position: "absolute", bottom: -4, left: -16, opacity: 0.6 }} />
        </div>
        <div style={{ fontSize: 30, fontWeight: 900, marginTop: 24, letterSpacing: -0.6, color: C.ink, lineHeight: 1.15 }}>
          Halo! Saya
          <br />
          <span style={{ color: C.skyDeep }}>BSya AI</span> 👋
        </div>
        <div style={{ fontSize: 15, color: C.ink2, fontWeight: 600, marginTop: 14, maxWidth: 360, lineHeight: 1.5 }}>
          Sebelum mulai, saya mau kenalan dulu dengan bisnismu — biar dashboard yang kamu lihat nanti benar-benar pas.
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 18, padding: "6px 12px", background: C.skySoft, borderRadius: 999, fontSize: 11.5, fontWeight: 700, color: C.skyDeep, letterSpacing: 0.3 }}>
          ⏱ Cuma 2 menit · 8 pertanyaan
        </div>
      </div>
      <button onClick={onStart} style={{ background: C.ink, color: C.white, border: "none", padding: 16, borderRadius: r(999), fontFamily: F, fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 20px rgba(11,39,64,0.18)" }}>
        Mulai kenalan
        <span style={{ width: 24, height: 24, borderRadius: "50%", background: C.yellow, color: C.ink, fontWeight: 900, fontSize: 14, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>→</span>
      </button>
    </div>
  );
}

function BranchStep({ onPick, onBack }: { onPick: (b: Branch) => void; onBack: () => void }) {
  const options: { id: Branch; emoji: string; label: string; sub: string }[] = [
    { id: "A", emoji: "🏪", label: "Bisnis sudah jalan", sub: "Sudah > 3 bulan dengan pelanggan rutin" },
    { id: "C", emoji: "🌱", label: "Baru mulai banget", sub: "Kurang dari 3 bulan, masih cari ritme" },
    { id: "B", emoji: "💡", label: "Masih sebatas ide", sub: "Belum jualan, baru riset & rencana" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: 18 }}>
        <ProgressBar current={1} total={10} />
      </div>
      <AIBubble text="Biar saya pilih cocoknya yang mana — bisnismu sekarang gimana?" />
      <div style={{ fontSize: 24, fontWeight: 900, color: C.ink, letterSpacing: -0.4, marginBottom: 18, lineHeight: 1.2 }}>Posisi bisnismu saat ini?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onPick(opt.id)}
            style={{ background: C.white, border: `1.5px solid ${C.line}`, borderRadius: r(16), padding: "18px 18px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", fontFamily: F, textAlign: "left", transition: "all 0.15s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.sky;
              e.currentTarget.style.background = C.skySoft;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.line;
              e.currentTarget.style.background = C.white;
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: r(14), background: `linear-gradient(135deg, ${C.yellow}, ${C.yellowDeep})`, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{opt.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginTop: 2 }}>{opt.sub}</div>
            </div>
            <div style={{ color: C.muted, fontSize: 20 }}>›</div>
          </button>
        ))}
      </div>
      <button onClick={onBack} style={{ marginTop: 16, background: "transparent", color: C.muted, border: "none", fontFamily: F, fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: 8 }}>
        ← Kembali
      </button>
    </div>
  );
}

function QuestionStep({
  q,
  answer,
  stepNum,
  totalSteps,
  onAnswer,
  onNext,
  onBack,
}: {
  q: Question;
  answer?: Answer;
  stepNum: number;
  totalSteps: number;
  onAnswer: (a: Answer) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [textVal, setTextVal] = useState(answer?.text || "");
  const [chipVal, setChipVal] = useState<string | null>(answer?.chip || null);
  const [multiVal, setMultiVal] = useState<string[]>(answer?.multi || []);
  const [singleVal, setSingleVal] = useState<string | null>(answer?.single || null);

  useEffect(() => {
    setTextVal(answer?.text || "");
    setChipVal(answer?.chip || null);
    setMultiVal(answer?.multi || []);
    setSingleVal(answer?.single || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.id]);

  const isValid = (() => {
    if (q.type === "single") return !!singleVal;
    if (q.type === "multi") return multiVal.length > 0;
    if (q.type === "text") return textVal.trim().length > 0;
    if (q.type === "text-chips") return textVal.trim().length > 0 && !!chipVal;
    return false;
  })();

  const commit = () => {
    onAnswer({ text: textVal, chip: chipVal, multi: multiVal, single: singleVal });
    onNext();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: 18 }}>
        <ProgressBar current={stepNum} total={totalSteps} />
      </div>
      <AIBubble text={q.ai} />
      <div style={{ fontSize: 22, fontWeight: 900, color: C.ink, letterSpacing: -0.3, lineHeight: 1.25, marginBottom: 4 }}>{q.q}</div>
      {q.sub ? (
        <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginBottom: 16, lineHeight: 1.4 }}>{q.sub}</div>
      ) : (
        <div style={{ height: 16 }} />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", paddingRight: 2 }}>
        {(q.type === "text" || q.type === "text-chips") && (
          <input
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            placeholder={q.textHint}
            style={{ padding: "14px 16px", fontSize: 15, fontFamily: F, fontWeight: 700, color: C.ink, border: `1.5px solid ${C.line}`, borderRadius: r(14), outline: "none", background: C.white, transition: "border-color 0.15s" }}
            onFocus={(e) => (e.target.style.borderColor = C.sky)}
            onBlur={(e) => (e.target.style.borderColor = C.line)}
          />
        )}

        {q.type === "text-chips" && (
          <>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: C.ink2, marginTop: 10, marginBottom: 2 }}>{q.chipsLabel}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {q.options?.map((opt) => (
                <Chip key={opt} active={chipVal === opt} onClick={() => setChipVal(opt)}>
                  {opt}
                </Chip>
              ))}
            </div>
          </>
        )}

        {q.type === "single" && q.options?.map((opt) => (
          <Chip key={opt} active={singleVal === opt} onClick={() => setSingleVal(opt)}>
            {opt}
          </Chip>
        ))}

        {q.type === "multi" && q.options?.map((opt) => (
          <Chip key={opt} multi active={multiVal.includes(opt)} onClick={() => setMultiVal(multiVal.includes(opt) ? multiVal.filter((x) => x !== opt) : [...multiVal, opt])}>
            {opt}
          </Chip>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button onClick={onBack} style={{ flex: "0 0 auto", padding: "14px 20px", borderRadius: r(999), background: C.white, color: C.ink2, border: `1.5px solid ${C.line}`, fontFamily: F, fontSize: 13.5, fontWeight: 800, cursor: "pointer" }}>
          ←
        </button>
        <button
          onClick={commit}
          disabled={!isValid}
          style={{ flex: 1, padding: 14, borderRadius: r(999), background: isValid ? C.ink : C.line, color: isValid ? C.white : C.muted, border: "none", fontFamily: F, fontSize: 14, fontWeight: 800, cursor: isValid ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          Lanjut
          <span style={{ width: 24, height: 24, borderRadius: "50%", background: isValid ? C.yellow : "transparent", color: C.ink, fontWeight: 900, fontSize: 14, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>→</span>
        </button>
      </div>
    </div>
  );
}

function SummaryStep({ branch, answers, onFinish }: { branch: Branch; answers: Record<string, Answer>; onFinish: (p: BusinessProfile) => void }) {
  const branchInfo = BRANCH_MAP[branch];
  const namaQ = branchInfo.questions[0];
  const nama = answers[namaQ.id]?.text || "—";
  const jenis = answers[namaQ.id]?.chip || "—";
  const needsKey = branchInfo.questions[branchInfo.questions.length - 1].id;
  const needs = answers[needsKey]?.multi || [];

  const ctas: { ic: string; label: string; sub: string }[] = [];
  if (needs.some((n) => n.toLowerCase().includes("modal"))) ctas.push({ ic: "💰", label: "Cek plafon modal", sub: "Permodalan" });
  if (needs.some((n) => n.toLowerCase().includes("pajak"))) ctas.push({ ic: "🧾", label: "Lihat estimasi pajak", sub: "Pajak AI" });
  if (needs.some((n) => n.toLowerCase().includes("supplier"))) ctas.push({ ic: "🤝", label: "Cari supplier hemat", sub: "Supplier" });
  if (needs.some((n) => n.toLowerCase().includes("promosi") || n.toLowerCase().includes("iklan"))) ctas.push({ ic: "📣", label: "Bikin iklan AI", sub: "Iklan AI" });
  if (needs.some((n) => n.toLowerCase().includes("catat") || n.toLowerCase().includes("keuangan"))) ctas.push({ ic: "📊", label: "Mulai catat keuangan", sub: "Laporan" });
  if (ctas.length === 0) ctas.push({ ic: "🏠", label: "Buka dashboard", sub: "Dashboard" });
  const topCtas = ctas.slice(0, 3);

  const finish = () => {
    onFinish({
      branch,
      businessName: nama === "—" ? "Usaha Saya" : nama,
      category: jenis,
      needs,
      answers,
      completedAt: new Date().toISOString(),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ marginBottom: 18 }}>
        <ProgressBar current={branchInfo.questions.length + 1} total={branchInfo.questions.length + 1} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.ok, color: C.white, fontSize: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 900, boxShadow: "0 8px 20px rgba(34,181,122,0.3)" }}>✓</div>
        <div style={{ fontSize: 24, fontWeight: 900, marginTop: 14, color: C.ink, letterSpacing: -0.4, lineHeight: 1.2 }}>Selesai! Profilmu sudah siap.</div>
        <div style={{ fontSize: 13.5, color: C.ink2, fontWeight: 600, marginTop: 6 }}>Saya susun dashboardmu sesuai kebutuhan.</div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.sky}, ${C.skyDeep})`, color: C.white, borderRadius: r(16), padding: 18, position: "relative", overflow: "hidden", marginBottom: 14 }}>
        <Deco size={44} rotate={20} color={C.yellow} style={{ position: "absolute", right: -6, top: -8, opacity: 0.85 }} />
        <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.85, letterSpacing: 0.4, textTransform: "uppercase" }}>Profil Bisnismu</div>
        <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4, letterSpacing: -0.3, lineHeight: 1.2 }}>{nama}</div>
        <div style={{ fontSize: 13, opacity: 0.9, fontWeight: 600, marginTop: 2 }}>
          {jenis} · {branchInfo.label}
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, color: C.ink2, marginBottom: 10 }}>Yang bisa kamu mulai sekarang:</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {topCtas.map((c, i) => (
          <div key={i} style={{ background: i === 0 ? C.yellow : C.white, border: i === 0 ? "none" : `1.5px solid ${C.line}`, borderRadius: r(14), padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 26 }}>{c.ic}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: C.ink, letterSpacing: -0.2 }}>{c.label}</div>
              <div style={{ fontSize: 11.5, color: C.ink2, fontWeight: 700, opacity: 0.75, marginTop: 1 }}>{c.sub}</div>
            </div>
            <div style={{ fontSize: 18, color: C.ink }}>›</div>
          </div>
        ))}
      </div>

      <button onClick={finish} style={{ marginTop: 16, background: C.ink, color: C.white, border: "none", padding: 15, borderRadius: r(999), fontFamily: F, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
        Buka Dashboard
      </button>
    </div>
  );
}
